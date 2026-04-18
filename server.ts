import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Admin SDK'yı başlat
const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

let db: any = null;
let auth: any = null;

try {
  if (Object.values(firebaseConfig).every(v => v)) {
    const app = initializeApp({
      credential: cert(firebaseConfig as any),
    });
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('Firebase Admin initialized');
  } else {
    console.warn('Firebase config incomplete - database features disabled');
  }
} catch (error: any) {
  console.warn('Firebase initialization failed:', error.message);
}

// Resend'i lazy başlat — top-level crash önlenir
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.trim() === '') {
    console.error('RESEND_API_KEY is not set or empty');
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(key);
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '8080', 10);

  app.use(express.json());

  // Debug: Log all requests
  app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
  });

  // ============================================================
  // POLAR.SH VERIFICATION ENDPOINT
  // ============================================================
  app.post("/api/verify-checkout", async (req, res) => {
    const { checkout_id } = req.body;

    if (!checkout_id) {
      return res.status(400).json({ error: "checkout_id required" });
    }

    try {
      const polarApiKey = process.env.POLAR_API_KEY;
      if (!polarApiKey) {
        return res.status(500).json({ error: "POLAR_API_KEY not configured" });
      }

      // Polar.sh API'sine checkout'u doğrula
      const response = await fetch(`https://api.polar.sh/v1/checkouts/${checkout_id}`, {
        headers: {
          'Authorization': `Bearer ${polarApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `Polar API error: ${response.statusText}` 
        });
      }

      const checkout = await response.json();

      // Ödeme başarılı mı kontrol et
      if (checkout.status === 'succeeded' || checkout.status === 'confirmed') {
        let userId: string | null = null;
        let customToken: string | null = null;

        // Firestore'da işlemler
        if (db && checkout.customer_email) {
          try {
            // 1. User document'ini bul veya oluştur
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('email', '==', checkout.customer_email).get();
            
            let userDoc: any = null;
            
            if (!snapshot.empty) {
              // User var, güncelle
              userDoc = snapshot.docs[0];
              userId = userDoc.id;
              
              await userDoc.ref.update({
                subscription_status: 'premium',
                subscription_plan: checkout.product?.name || 'premium',
                subscription_start_date: Timestamp.now(),
                subscription_end_date: null, // Aktif abonelik
                polar_customer_id: checkout.customer_id,
                polar_checkout_id: checkout_id,
                polar_subscription_id: checkout.subscription_id,
                lastLogin: Timestamp.now(),
              });
            } else {
              // Yeni user oluştur
              const newUserRef = await usersRef.add({
                email: checkout.customer_email,
                name: checkout.customer_name || checkout.customer_email.split('@')[0],
                plan: 'pro',
                subscription_status: 'premium',
                subscription_plan: checkout.product?.name || 'premium',
                subscription_start_date: Timestamp.now(),
                subscription_end_date: null,
                polar_customer_id: checkout.customer_id,
                polar_checkout_id: checkout_id,
                polar_subscription_id: checkout.subscription_id,
                role: 'user',
                createdAt: Timestamp.now(),
                lastLogin: Timestamp.now(),
              });
              userId = newUserRef.id;
            }

            // 2. Firebase Auth user'ını kontrol et veya oluştur
            if (auth && userId) {
              try {
                try {
                  await auth.getUser(userId);
                } catch (e) {
                  // User yoksa oluştur
                  await auth.createUser({
                    uid: userId,
                    email: checkout.customer_email,
                  });
                }
                customToken = await auth.createCustomToken(userId);
              } catch (authError: any) {
                console.error('Auth token error:', authError.message);
              }
            }

            // 3. Payment history'ye ekle
            if (userId) {
              await db.collection('users').doc(userId).collection('payments').add({
                checkout_id: checkout_id,
                amount: checkout.amount,
                currency: checkout.currency || 'usd',
                status: 'completed',
                payment_date: Timestamp.now(),
                product_name: checkout.product?.name || 'Premium Plan',
                polar_subscription_id: checkout.subscription_id,
              });
            }

            console.log(`Payment verified for ${checkout.customer_email}`);
          } catch (dbError: any) {
            console.error('Database update error:', dbError.message);
            // Continue anyway - don't fail the request
          }
        }

        return res.json({ 
          success: true, 
          message: 'Subscription activated',
          checkout_id: checkout_id,
          customer_email: checkout.customer_email,
          user_id: userId,
          customToken: customToken,
        });
      } else {
        return res.status(400).json({ 
          error: `Payment not completed. Status: ${checkout.status}`,
          checkout_status: checkout.status,
        });
      }

    } catch (error: any) {
      console.error('Checkout verification error:', error);
      res.status(500).json({ 
        error: error.message || 'Verification failed',
        details: error.toString(),
      });
    }
  });

  // ============================================================
  // POLAR.SH WEBHOOK ENDPOINT
  // ============================================================
  app.post("/api/polar-webhook", async (req, res) => {
    try {
      const event = req.body;
      const polarApiKey = process.env.POLAR_API_KEY;

      if (!event.type) {
        return res.status(400).json({ error: "No event type" });
      }

      // Event'i doğrula (Polar.sh'nin gönderdiğini kontrol et)
      // TODO: Implement Polar.sh webhook signature verification

      console.log(`Received Polar webhook: ${event.type}`);

      // Subscription cancelled
      if (event.type === 'subscription.cancelled') {
        const { subscription_id, customer } = event.data;

        try {
          const usersRef = db.collection('users');
          const snapshot = await usersRef
            .where('polar_customer_id', '==', customer.id)
            .limit(1)
            .get();

          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            await userDoc.ref.update({
              subscription_status: 'cancelled',
              plan: 'free',
              subscription_end_date: Timestamp.now(),
            });

            console.log(`Subscription cancelled for user: ${userDoc.id}`);
          }
        } catch (error: any) {
          console.error('Webhook processing error:', error.message);
        }
      }

      // Subscription renewed
      if (event.type === 'subscription.renewed') {
        const { subscription_id, customer, amount } = event.data;

        try {
          const usersRef = db.collection('users');
          const snapshot = await usersRef
            .where('polar_customer_id', '==', customer.id)
            .limit(1)
            .get();

          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;

            // Update subscription
            await userDoc.ref.update({
              subscription_status: 'premium',
              plan: 'pro',
              subscription_end_date: null,
              lastLogin: Timestamp.now(),
            });

            // Add to payment history
            await db.collection('users').doc(userId).collection('payments').add({
              subscription_id: subscription_id,
              amount: amount,
              currency: 'usd',
              status: 'completed',
              payment_date: Timestamp.now(),
              product_name: 'Premium Plan (Renewal)',
              polar_subscription_id: subscription_id,
            });

            console.log(`Subscription renewed for user: ${userId}`);
          }
        } catch (error: any) {
          console.error('Webhook processing error:', error.message);
        }
      }

      res.json({ success: true });

    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================
  // GET USER SUBSCRIPTION INFO
  // ============================================================
  app.post("/api/get-user-subscription", async (req, res) => {
    const { user_id } = req.body;

    if (!user_id || !db) {
      return res.status(400).json({ error: "user_id required or db not available" });
    }

    try {
      const userDoc = await db.collection('users').doc(user_id).get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();

      // Get payment history
      const paymentsSnapshot = await db
        .collection('users')
        .doc(user_id)
        .collection('payments')
        .orderBy('payment_date', 'desc')
        .limit(10)
        .get();

      const payments = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        payment_date: doc.data().payment_date?.toDate?.() || new Date(),
      }));

      res.json({
        subscription: {
          status: userData.subscription_status || 'free',
          plan: userData.plan || 'free',
          subscription_start_date: userData.subscription_start_date?.toDate?.(),
          subscription_end_date: userData.subscription_end_date?.toDate?.(),
        },
        payments,
      });

    } catch (error: any) {
      console.error('Get subscription error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================
  // ADMIN: FIX USER STATUS
  // ============================================================
  app.post("/api/admin/fix-user-status", async (req, res) => {
    const { admin_email, target_email, subscription_id } = req.body;

    // Security check: Only allow the specific admin
    if (admin_email !== "cihadilbas@gmail.com") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', target_email).get();
      
      if (snapshot.empty) {
        return res.status(404).json({ error: "User not found" });
      }

      const userDoc = snapshot.docs[0];
      const updateData: any = {
        subscription_status: 'premium',
        plan: 'pro',
      };

      if (subscription_id) {
        updateData.polar_subscription_id = subscription_id;
      }

      await userDoc.ref.update(updateData);

      res.json({ success: true, message: `User ${target_email} updated to premium` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================
  // CANCEL SUBSCRIPTION ENDPOINT
  // ============================================================
  app.post("/api/cancel-subscription", async (req, res) => {
    console.log('Cancel subscription request received. Body:', req.body);
    const { user_id } = req.body;
    console.log('Cancel subscription request received for user_id:', user_id);

    if (!user_id || !db) {
      console.error('Missing user_id or db');
      return res.status(400).json({ error: "user_id required or db not available" });
    }

    try {
      const userDocRef = db.collection('users').doc(user_id);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        console.error('User not found in Firestore:', user_id);
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();
      console.log('User data:', userData);
      const subscriptionId = userData.polar_subscription_id;

      if (!subscriptionId) {
        console.error('No polar_subscription_id for user:', user_id);
        return res.status(400).json({ error: "No active subscription found" });
      }

      // Call Polar API to cancel
      const polarApiKey = process.env.POLAR_API_KEY;
      if (!polarApiKey) {
        console.error('Polar API key missing');
        return res.status(500).json({ error: "Polar API key not configured" });
      }

      console.log('Calling Polar API to cancel subscription:', subscriptionId);
      const response = await fetch(`https://api.polar.sh/v1/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${polarApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Polar API error:', errorData);
        return res.status(500).json({ error: "Failed to cancel subscription on Polar" });
      }

      console.log('Polar subscription cancelled successfully');

      // Update Firestore
      await userDocRef.update({
        subscription_status: 'cancelled',
        plan: 'free',
        subscription_end_date: Timestamp.now(),
      });
      console.log('Firestore updated successfully');

      res.json({ success: true });

    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // ============================================================
  // VERİ SİLME TALEBİ ENDPOINT
  // ============================================================
  app.post("/api/request-deletion", async (req, res) => {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ error: "Email gerekli" });

    try {
      const resend = getResend();

      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: 'kvkk@ferhengai.com',
        subject: `[VERİ SİLME TALEBİ] ${email}`,
        html: `
          <h2>Veri Silme Talebi</h2>
          <p><strong>E-posta:</strong> ${email}</p>
          <p><strong>Sebep:</strong> ${reason || 'Belirtilmedi'}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          <hr>
          <p>Bu kullanıcının tüm verileri 30 gün içinde silinmelidir.</p>
        `,
      });

      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Veri Silme Talebiniz Alındı — FerhengAI',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #1a1a1a;">Talebiniz Alındı</h1>
            <p style="color: #555;">Veri silme talebiniz başarıyla alınmıştır.</p>
            <p style="color: #555;">Verileriniz <strong>30 gün içinde</strong> sistemlerimizden kalıcı olarak silinecektir.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">FerhengAI.com — kvkk@ferhengai.com</p>
          </div>
        `,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================
  // STATIC FILES & SPA FALLBACK
  // ============================================================
  app.use(express.static(path.join(__dirname, 'dist')));

  // SPA fallback
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
