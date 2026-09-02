import { Phone, MessageCircle, ChevronUp } from 'lucide-react';
import { trackPhoneClick, trackWhatsAppClick, trackSiteVisitCTA } from '../../utils/tracking';

export default function FloatingCTA({ onCTAClick }) {
  const phone = import.meta.env.VITE_CONTACT_PHONE || '+919999999999';
  const wa = import.meta.env.VITE_CONTACT_WHATSAPP || '919999999999';

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-stone-200 shadow-luxury-lg">
        <div className="grid grid-cols-3 divide-x divide-stone-200">
          <a
            href={`tel:${phone}`}
            onClick={trackPhoneClick}
            className="flex flex-col items-center justify-center gap-1 py-3 text-forest-700 hover:bg-forest-50 active:bg-forest-100 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-medium">Call</span>
          </a>
          <button
            onClick={() => { trackSiteVisitCTA(); onCTAClick(); }}
            className="flex flex-col items-center justify-center gap-1 py-3 bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-700 transition-colors"
            id="floating-cta"
          >
            <span className="text-xs font-bold leading-tight">Book Site</span>
            <span className="text-xs font-bold leading-tight">Visit</span>
          </button>
          <a
            href={`https://wa.me/${wa}?text=Hi, I'm interested in Arvind Sylva, Sarjapur.`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className="flex flex-col items-center justify-center gap-1 py-3 text-green-600 hover:bg-green-50 active:bg-green-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Desktop floating WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col gap-3">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 bg-white border border-stone-200 rounded-full shadow-luxury flex items-center justify-center text-stone-500 hover:text-forest-700 hover:border-forest-300 transition-all"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <a
          href={`https://wa.me/${wa}?text=Hi, I'm interested in Arvind Sylva, Sarjapur.`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsAppClick}
          className="w-14 h-14 bg-green-500 rounded-full shadow-luxury-lg flex items-center justify-center text-white hover:bg-green-600 hover:scale-110 transition-all"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      </div>

      {/* Mobile bottom padding spacer to avoid content hidden behind sticky bar */}
      <div className="h-16 md:hidden" />
    </>
  );
}
