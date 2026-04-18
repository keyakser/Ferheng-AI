import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { planName, planType } = req.body;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FerhengAI ${planName} (${planType})`,
            },
            unit_amount: planName === 'Pro' ? (planType === 'monthly' ? 499 : 4999) : 0,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/#/success`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/#/pricing`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
