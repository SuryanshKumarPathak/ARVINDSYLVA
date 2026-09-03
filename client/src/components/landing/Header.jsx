import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { trackPhoneClick } from '../../utils/tracking';

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Location', href: '#location' },
  { label: 'Gallery', href: '#gallery' },
];

export default function Header({ onCTAClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const phone = import.meta.env.VITE_CONTACT_PHONE || '+919606010736';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-stone-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex flex-col leading-none">
              <span className={`font-display font-bold text-xl tracking-wide transition-colors ${scrolled ? 'text-forest-900' : 'text-white'}`}>
                ARVIND <span className={scrolled ? 'text-gold-500' : 'text-gold-300'}>SYLVA</span>
              </span>
              <span className={`text-[10px] tracking-[0.25em] uppercase font-medium transition-colors ${scrolled ? 'text-stone-500' : 'text-white/70'}`}>
                Sarjapur · Bangalore
              </span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                  scrolled ? 'text-stone-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${phone}`}
              onClick={trackPhoneClick}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                scrolled ? 'text-forest-700 hover:text-forest-900' : 'text-white/90 hover:text-gold-300'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:block">{phone}</span>
            </a>
            <button
              onClick={onCTAClick}
              className="btn-gold px-5 py-2.5 text-sm"
              id="header-cta"
            >
              Book Site Visit
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 shadow-luxury-lg">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-3 py-2.5 text-stone-700 hover:bg-forest-50 hover:text-forest-800 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <a
                href={`tel:${phone}`}
                onClick={trackPhoneClick}
                className="flex items-center gap-2 px-3 py-2.5 text-forest-700 text-sm font-medium"
              >
                <Phone className="w-4 h-4" /> {phone}
              </a>
              <button
                onClick={() => { setMenuOpen(false); onCTAClick(); }}
                className="btn-gold w-full"
                id="header-mobile-cta"
              >
                Book Site Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
