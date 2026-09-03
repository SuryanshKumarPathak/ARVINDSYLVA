import { CheckCircle2, Phone, MessageCircle, Home } from 'lucide-react';

export default function ThankYou() {
  const phone = import.meta.env.VITE_CONTACT_PHONE || '+919606010736';
  const wa = import.meta.env.VITE_CONTACT_WHATSAPP || '919606010736';

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Header */}
      <header className="bg-forest-900 py-4 px-6">
        <a href="/" className="font-display text-2xl font-bold text-white">
          ARVIND <span className="text-gold-400">SYLVA</span>
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-forest-900 font-bold mb-4">
            Thank You!
          </h1>
          <p className="text-stone-600 text-lg mb-2">
            Your interest in <strong className="text-forest-800">Arvind Sylva</strong> has been registered.
          </p>
          <p className="text-stone-500 mb-10">
            Our sales team will reach out to you within <strong>24 hours</strong> to schedule your site visit.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-gold-500 text-lg">✦</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <p className="text-stone-600 font-medium mb-4">Or reach us directly:</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <a
              href={`tel:${phone}`}
              className="btn-primary gap-2"
              id="thankyou-phone"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
              href={`https://wa.me/${wa}?text=Hi, I'm interested in Arvind Sylva, Sarjapur.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary gap-2 bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700"
              id="thankyou-whatsapp"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-medium text-sm transition-colors"
            id="thankyou-home"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4 text-center text-xs text-stone-400 px-4">
        © {new Date().getFullYear()} Arvind Sylva, Sarjapur, Bangalore. All rights reserved.
      </footer>
    </div>
  );
}
