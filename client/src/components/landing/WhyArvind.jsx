import { CheckCircle2 } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const REASONS = [
  {
    title: 'Trusted Brand',
    desc: 'Arvind SmartSpaces is a reputed developer with a long track record of delivering quality projects across Bangalore.',
    icon: '🛡️',
  },
  {
    title: 'Nature-Inspired Design',
    desc: '70% open spaces, lush greenery, and biophilic design principles that integrate nature into every corner of your home.',
    icon: '🌿',
  },
  {
    title: 'Prime Location',
    desc: 'Sarjapur Road — one of Bangalore\'s fastest growing corridors with excellent connectivity to tech hubs.',
    icon: '📍',
  },
  {
    title: '40+ Amenities',
    desc: 'A fully loaded lifestyle ecosystem covering fitness, recreation, community, and wellness.',
    icon: '✨',
  },
  {
    title: 'Designed for Families',
    desc: 'Spacious 3 & 4 BHK homes with thoughtful layouts for every family need — today and tomorrow.',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Strong Infrastructure',
    desc: 'Proximity to schools, hospitals, malls, and tech parks makes Arvind Sylva an ideal long-term home.',
    icon: '🏗️',
  },
];

export default function WhyArvind({ onCTAClick }) {
  const ref = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-forest-950 text-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="reveal section-label text-gold-400 mb-3">Why Arvind Sylva</p>
          <h2 className="reveal font-display text-4xl md:text-5xl text-white font-bold mb-4">
            More Than a Home.<br />
            <span className="text-gold-400 italic">A Way of Life.</span>
          </h2>
          <p className="reveal text-white/60 max-w-lg mx-auto text-lg">
            Six compelling reasons why Arvind Sylva stands apart in Sarjapur's competitive landscape.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="reveal group p-6 border border-white/10 rounded-sm hover:border-gold-400/40 hover:bg-white/5 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-4xl mb-4">{r.icon}</div>
              <h3 className="font-display text-xl text-white font-semibold mb-3 group-hover:text-gold-300 transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                {r.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal text-center">
          <button onClick={onCTAClick} className="btn-gold px-10 py-4 text-base" id="why-cta">
            Book a Site Visit Today
          </button>
        </div>
      </div>
    </section>
  );
}
