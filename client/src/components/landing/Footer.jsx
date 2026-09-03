import { Phone, MessageCircle, MapPin, Mail, ExternalLink } from 'lucide-react';
import { trackPhoneClick, trackWhatsAppClick } from '../../utils/tracking';

export default function Footer({ onCTAClick }) {
  const phone = import.meta.env.VITE_CONTACT_PHONE || '+919606010736';
  const wa = import.meta.env.VITE_CONTACT_WHATSAPP || '919606010736';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <div className="font-display text-3xl font-bold text-white mb-1">
                ARVIND <span className="text-gold-400">SYLVA</span>
              </div>
              <div className="text-white/50 text-sm tracking-widest uppercase">Sarjapur · Bangalore</div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              Experience nature-inspired luxury with premium 3 &amp; 4 BHK residences
              designed for elevated living at Sarjapur, Bangalore.
            </p>
            <div className="flex items-start gap-2 text-white/60 text-sm mb-2">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>Opp. Wipro Campus, Kodathi, Sarjapur, Bangalore, Karnataka</span>
            </div>
            <div className="flex gap-3 mt-5">
              <a
                href={`tel:${phone}`}
                onClick={trackPhoneClick}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-sm text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a
                href={`https://wa.me/${wa}?text=Hi, I'm interested in Arvind Sylva, Sarjapur.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhatsAppClick}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-sm text-sm text-white hover:bg-green-700 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {['Overview', 'Highlights', 'Amenities', 'Location', 'Gallery', 'FAQ'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => document.querySelector(`#${item.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-white/50 text-sm hover:text-gold-400 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-5">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/privacy-policy" className="text-white/50 text-sm hover:text-gold-400 transition-colors flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="text-white/50 text-sm hover:text-gold-400 transition-colors flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Terms & Conditions</a></li>
            </ul>
            <div className="mt-8">
              <h4 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Register Interest</h4>
              <button onClick={onCTAClick} className="btn-gold w-full text-sm" id="footer-cta">
                Book Site Visit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {year} Arvind Sylva, Sarjapur, Bangalore. All rights reserved.
          </p>
          <p className="text-white/30 text-xs text-center sm:text-right max-w-lg">
            This is a marketing website. All information herein is for general awareness only. Please verify all details with the sales team before making any investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
