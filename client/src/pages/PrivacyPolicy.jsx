import { ArrowLeft } from 'lucide-react';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl text-forest-900 font-bold mb-3 pb-2 border-b border-stone-200">
        {title}
      </h2>
      <div className="text-stone-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-forest-900 py-4 px-6 flex items-center gap-4">
        <a href="/" className="font-display text-2xl font-bold text-white">
          ARVIND <span className="text-gold-400">SYLVA</span>
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>

        <h1 className="font-display text-4xl text-forest-900 font-bold mb-2">Privacy Policy</h1>
        <p className="text-stone-400 text-sm mb-10">Last updated: September 2026</p>

        <Section title="1. Introduction">
          <p>
            Arvind Sylva ("we", "us", or "our") operates this website to provide information about
            our real estate project and to capture enquiries from prospective buyers. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following personal information when you submit an enquiry:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full name</li>
            <li>Mobile phone number</li>
            <li>Email address (optional)</li>
            <li>City of residence (optional)</li>
            <li>Preferred apartment configuration</li>
            <li>Any message you include in the enquiry form</li>
          </ul>
          <p>
            We also automatically collect technical data such as your IP address, browser type, and
            referring URL through cookies and analytics tools (Google Analytics, Meta Pixel).
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To respond to your enquiry and schedule site visits</li>
            <li>To send project updates, offers, and relevant communications</li>
            <li>To improve our website and marketing effectiveness</li>
            <li>To comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="4. Sharing of Information">
          <p>
            We do <strong>not</strong> sell your personal data to third parties. We may share it
            with our authorised sales partners, marketing service providers (email/SMS), and legal
            authorities when required by law. All third parties are required to protect your data.
          </p>
        </Section>

        <Section title="5. Cookies & Tracking">
          <p>
            We use cookies and similar technologies (Google Analytics, Meta Pixel) to understand
            how visitors interact with our website and to measure advertising performance. You can
            disable cookies in your browser settings, but some site features may not function
            correctly.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal data for as long as necessary to fulfil the purposes described
            in this policy, or as required by applicable law. You may request deletion of your data
            at any time.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <ul className="list-disc pl-5 space-y-1">
            <li>Right to access your data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to request deletion</li>
            <li>Right to opt out of marketing communications</li>
          </ul>
        </Section>

        <Section title="8. Contact Us">
          <p>
            For any privacy-related queries, please contact us at:{' '}
            <a
              href="mailto:info@arvindsylva.com"
              className="text-forest-700 underline hover:text-forest-900"
            >
              info@arvindsylva.com
            </a>
          </p>
        </Section>
      </main>

      <footer className="border-t border-stone-200 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Arvind Sylva, Sarjapur, Bangalore. All rights reserved.
      </footer>
    </div>
  );
}
