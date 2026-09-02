import { CheckCircle2 } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const HIGHLIGHTS = [
  { title: '374 Exclusive Residences', desc: 'Limited homes designed for privacy, exclusivity, and community.', icon: '🏛️' },
  { title: '1,500 – 2,300 sq. ft.', desc: 'Generously proportioned homes crafted for comfortable family living.', icon: '📐' },
  { title: '70% Open Spaces', desc: 'Breathe freely with lush green courts, gardens, and walking paths.', icon: '🌿' },
  { title: '40+ Lifestyle Amenities', desc: 'World-class facilities for fitness, recreation, and social living.', icon: '✨' },
  { title: '15,000+ sq. ft. Clubhouse', desc: 'Grand clubhouse with premium facilities for every age.', icon: '🏊' },
  { title: '2B + G + 17 Floors', desc: 'Contemporary high-rise architecture with sweeping city views.', icon: '🏗️' },
];

const CONNECTIVITY = [
  'Excellent connectivity to Outer Ring Road (ORR)',
  'Close proximity to Electronic City',
  'Well-connected to Whitefield',
  'Opposite Wipro Campus, Kodathi',
  'Access to Sarjapur\'s rapidly developing social infrastructure',
];

export default function Highlights({ onCTAClick }) {
  const ref = useScrollReveal();

  return (
    <section id="highlights" className="py-20 md:py-28 bg-forest-950 text-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="reveal section-label text-gold-400 mb-3">Project Highlights</p>
          <h2 className="reveal font-display text-4xl md:text-5xl text-white font-bold mb-4">
            Built for the Discerning Few
          </h2>
          <p className="reveal text-white/60 max-w-xl mx-auto text-lg">
            Every detail at Arvind Sylva is curated to deliver an extraordinary living experience.
          </p>
        </div>

        {/* Highlights grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.title}
              className="reveal group p-6 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-gold-400/40 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-4xl mb-4">{h.icon}</div>
              <h3 className="font-display text-xl text-white font-semibold mb-2 group-hover:text-gold-300 transition-colors">
                {h.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Connectivity */}
        <div className="reveal bg-white/5 border border-white/10 rounded-sm p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="section-label text-gold-400 mb-3">Location & Connectivity</p>
              <h3 className="font-display text-3xl text-white font-bold mb-6">
                Strategic Location.<br />Unmatched Access.
              </h3>
              <ul className="space-y-3">
                {CONNECTIVITY.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/75 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="inline-block p-8 border border-gold-400/30 rounded-sm">
                <div className="font-display text-5xl font-bold text-gold-400 mb-1">Sarjapur</div>
                <div className="text-white/50 text-sm tracking-widest uppercase mb-6">Bangalore</div>
                <button onClick={onCTAClick} className="btn-gold" id="highlights-cta">
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
