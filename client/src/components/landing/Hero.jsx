import { ChevronDown, MapPin } from 'lucide-react';
import { trackSiteVisitCTA } from '../../utils/tracking';
import heroImg from '../../assets/hero-promo.jpg';

export default function Hero({ onCTAClick }) {
  const scrollToOverview = () => {
    document.querySelector('#overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Arvind Sylva – Nature-Inspired Luxury Living, Sarjapur Bangalore"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchpriority="high"
        />
        {/* Layered overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950/80" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 pt-40">
        {/* Location tag */}
        <div className="reveal flex items-center justify-center gap-2 mb-6">
          <MapPin className="w-4 h-4 text-gold-400" />
          <span className="text-gold-300 text-sm font-medium tracking-widest uppercase">
            Opp. Wipro Campus, Kodathi, Sarjapur
          </span>
        </div>

        {/* Main title */}
        <h1 className="reveal font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold leading-none mb-4 tracking-tight">
          ARVIND{' '}
          <span className="text-gold-400 italic">SYLVA</span>
        </h1>

        <p className="reveal font-display text-lg sm:text-xl md:text-2xl text-white/80 font-light italic mb-2">
          Sarjapur, Bangalore
        </p>

        {/* Divider */}
        <div className="reveal flex items-center justify-center gap-4 my-6">
          <div className="h-px w-16 bg-gold-400/60" />
          <span className="text-gold-400 text-xl">✦</span>
          <div className="h-px w-16 bg-gold-400/60" />
        </div>

        {/* Tagline */}
        <p className="reveal font-display text-2xl sm:text-3xl md:text-4xl text-cream-100 font-light italic mb-3">
          "Nature-Inspired Luxury Living"
        </p>

        <p className="reveal text-white/70 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Premium 3 &amp; 4 BHK Residences · 374 Exclusive Homes · 70% Open Spaces
        </p>

        {/* CTAs */}
        <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-cta-primary"
            onClick={() => { trackSiteVisitCTA(); onCTAClick(); }}
            className="btn-gold px-8 py-4 text-base w-full sm:w-auto"
          >
            Book a Site Visit
          </button>
          <button
            id="hero-cta-secondary"
            onClick={onCTAClick}
            className="btn-ghost px-8 py-4 text-base w-full sm:w-auto"
          >
            Get Project Details
          </button>
        </div>

        {/* Key highlights strip */}
        <div className="reveal mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { value: '374', label: 'Exclusive Residences' },
            { value: '70%', label: 'Open Spaces' },
            { value: '40+', label: 'Lifestyle Amenities' },
            { value: '2B+G+17', label: 'Floors' },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm px-4 py-3">
              <div className="font-display text-2xl font-bold text-gold-300">{item.value}</div>
              <div className="text-white/70 text-xs mt-0.5 leading-tight">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToOverview}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Explore</span>
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
}
