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



export default function TermsAndConditions() {
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

        <h1 className="font-display text-4xl text-forest-900 font-bold mb-2">Terms & Conditions</h1>
        <p className="text-stone-400 text-sm mb-10">Last updated: September 2026</p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using this website, you agree to be bound by these Terms and Conditions.
            If you do not agree, please do not use this website.
          </p>
        </Section>

        <Section title="2. Nature of This Website">
          <p>
            This website is a marketing platform for <strong>Arvind Sylva</strong>, a residential
            project located at Sarjapur, Bangalore. All content is for general information and
            marketing purposes only.
          </p>
          <p>
            Nothing on this website constitutes a legal offer, booking, or agreement to sell. All
            project details, specifications, pricing, and floor plans are indicative and subject to
            change without prior notice.
          </p>
        </Section>

        <Section title="3. No Guarantee of Accuracy">
          <p>
            While we strive to keep information up to date and accurate, we make no warranties of
            any kind regarding the completeness, accuracy, or reliability of any content on this
            site. Rendering images and amenities depicted are indicative and may differ from the
            final delivered product.
          </p>
        </Section>

        <Section title="4. Enquiry Submission">
          <p>
            When you submit an enquiry, you consent to being contacted by our sales team via phone,
            WhatsApp, SMS, or email. You may opt out of further communications at any time by
            notifying us.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            All content on this website, including images, text, graphics, and logos, is the
            intellectual property of Arvind Sylva and its licensors. Unauthorised reproduction or
            distribution is strictly prohibited.
          </p>
        </Section>

        <Section title="6. Third-Party Links">
          <p>
            This website may contain links to third-party websites (e.g., Google Maps). We are not
            responsible for the content or privacy practices of those sites.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Arvind Sylva shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of this website or
            reliance on any information provided herein.
          </p>
        </Section>

        <Section title="8. Governing Law">
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the
            exclusive jurisdiction of the courts in Bangalore, Karnataka.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            For questions about these Terms, contact us at:{' '}
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
