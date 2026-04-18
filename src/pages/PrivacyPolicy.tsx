export function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-foreground">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-10">Last updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Data Controller</h2>
        <p className="text-muted-foreground leading-relaxed">
          This Privacy Policy describes how <strong>FerhengAI.com</strong> ("we", "us", or "our") 
          collects, uses, and protects your personal data when you use our Service. We act as 
          the data controller under the Turkish Personal Data Protection Law No. 6698 (KVKK) 
          and, where applicable, the EU General Data Protection Regulation (GDPR).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We collect the following categories of personal data:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>
            <strong>Account data:</strong> Name and email address provided during registration
          </li>
          <li>
            <strong>Payment data:</strong> Subscription and payment processing is handled 
            entirely by Polar.sh; we do not store your card or banking details. 
            Polar.sh may collect billing information in accordance with their own privacy policy
          </li>
          <li>
            <strong>Usage data:</strong> Search history, preferred dialect, session duration, 
            and feature interactions
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, device type, and 
            operating system
          </li>
          <li>
            <strong>Communication data:</strong> Email address provided for newsletter 
            subscription (with your explicit consent)
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>Providing and maintaining the Service</li>
          <li>Managing your account and authenticating your identity</li>
          <li>Processing payments and managing subscriptions via Polar.sh</li>
          <li>Sending transactional emails (account verification, subscription confirmation)</li>
          <li>Sending newsletters and product updates (only with your explicit consent)</li>
          <li>Improving and personalizing the Service</li>
          <li>Detecting and preventing fraud or abuse</li>
          <li>Complying with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Legal Basis for Processing</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>Contract performance:</strong> Processing necessary to provide the Service you signed up for</li>
          <li><strong>Legitimate interests:</strong> Fraud prevention, security, and service improvement</li>
          <li><strong>Consent:</strong> Newsletter subscription and non-essential cookies</li>
          <li><strong>Legal obligation:</strong> Compliance with applicable laws and regulations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We share your data only with trusted third-party service providers necessary to 
          operate FerhengAI.com. Your data is never sold or shared for advertising purposes.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>
            <strong>Polar.sh</strong> — subscription management and payment processing. 
            Polar.sh acts as an independent data controller for payment data. 
            See their privacy policy at{" "}
            <a href="https://polar.sh/privacy" target="_blank" rel="noopener noreferrer" 
               className="text-primary underline">polar.sh/privacy</a>
          </li>
          <li><strong>Google Firebase</strong> — authentication and database (Google LLC)</li>
          <li><strong>Resend</strong> — transactional and newsletter email delivery</li>
          <li><strong>Google Cloud Run</strong> — application hosting and infrastructure</li>
          <li><strong>Google Gemini API</strong> — AI-powered language processing</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Each provider maintains their own privacy policies and data protection standards. 
          Where data is transferred outside of Turkey or the EU, we ensure appropriate 
          safeguards are in place.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>
            <strong>Strictly necessary cookies:</strong> Required for authentication and 
            core functionality. These cannot be disabled.
          </li>
          <li>
            <strong>Analytics cookies:</strong> Used to understand how users interact with 
            the Service. Activated only with your consent.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You can manage your cookie preferences at any time via the cookie banner or 
          your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
        <p className="text-muted-foreground leading-relaxed">
          We retain your personal data for as long as your account is active or as needed 
          to provide the Service. Upon account deletion, your personal data is permanently 
          removed from our systems within 30 days, except where retention is required by 
          applicable law. Subscription and billing records managed by Polar.sh are subject 
          to their own retention policies. Newsletter subscription data is retained until 
          you unsubscribe.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Under KVKK and, where applicable, GDPR, you have the following rights:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
          <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
          <li><strong>Right to restriction:</strong> Request that we limit processing of your data</li>
          <li><strong>Right to data portability:</strong> Receive your data in a structured, machine-readable format</li>
          <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
          <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time without affecting prior processing</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          For rights related to payment and billing data, please contact Polar.sh directly 
          at{" "}
          <a href="https://polar.sh/privacy" target="_blank" rel="noopener noreferrer"
             className="text-primary underline">polar.sh/privacy</a>. 
          For all other requests, contact us at{" "}
          <a href="mailto:privacy@ferhengai.com" className="text-primary underline">
            privacy@ferhengai.com
          </a>
          . We will respond within 30 days.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We implement appropriate technical and organizational measures to protect your 
          personal data against unauthorized access, alteration, disclosure, or destruction. 
          These measures include encrypted data transmission (HTTPS), secure authentication 
          via Firebase, and strict access controls. Payment security is managed by Polar.sh 
          in accordance with PCI-DSS standards.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
        <p className="text-muted-foreground leading-relaxed">
          FerhengAI.com is not directed to children under the age of 13. We do not knowingly 
          collect personal data from children. If you believe a child has provided us with 
          personal data, please contact us and we will delete it promptly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of 
          significant changes by email or by posting a prominent notice on the Service. 
          Your continued use of FerhengAI.com after changes take effect constitutes 
          your acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          For any questions or requests regarding this Privacy Policy:{" "}
          <a href="mailto:privacy@ferhengai.com" className="text-primary underline">
            privacy@ferhengai.com
          </a>
        </p>
      </section>
    </div>
  );
}
