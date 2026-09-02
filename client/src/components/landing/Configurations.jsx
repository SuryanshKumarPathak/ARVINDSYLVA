import { Home, Maximize2, ArrowRight } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const CONFIGS = [
  {
    type: '3 BHK',
    size: '1,500 – 1,800 sq. ft.',
    tag: 'Most Popular',
    tagColor: 'bg-gold-500 text-white',
    desc: 'Thoughtfully designed 3-bedroom residences perfect for growing families seeking space, comfort, and elegance.',
    features: ['3 Bedrooms', '3 Bathrooms', 'Living + Dining', 'Kitchen & Utility', 'Balcony'],
    accent: 'border-gold-400 bg-gold-50',
  },
  {
    type: '4 BHK',
    size: '2,000 – 2,300 sq. ft.',
    tag: 'Premium',
    tagColor: 'bg-forest-800 text-white',
    desc: 'Expansive 4-bedroom premium residences offering generous living spaces for those who seek the finest.',
    features: ['4 Bedrooms', '4 Bathrooms', 'Grand Living Room', 'Premium Kitchen', 'Multiple Balconies'],
    accent: 'border-forest-600 bg-forest-50',
  },
];

export default function Configurations({ onCTAClick }) {
  const ref = useScrollReveal();

  return (
    <section id="configurations" className="py-20 md:py-28 bg-cream-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="reveal section-label mb-3">Residential Configuration</p>
          <h2 className="reveal section-title mb-4">
            Choose Your<br />
            <span className="text-forest-700 italic">Dream Home</span>
          </h2>
          <div className="reveal h-0.5 w-12 bg-gold-400 mx-auto mb-6" />
          <p className="reveal section-subtitle max-w-lg mx-auto">
            Premium 3 &amp; 4 BHK residences crafted for families who demand the finest.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {CONFIGS.map((config, i) => (
            <div
              key={config.type}
              className={`reveal card-luxury border-2 ${config.accent} overflow-hidden`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Card header */}
              <div className="p-6 border-b border-stone-100">
                <div className="flex items-start justify-between mb-4">
                  <Home className="w-8 h-8 text-forest-700" />
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.tagColor}`}>
                    {config.tag}
                  </span>
                </div>
                <h3 className="font-display text-4xl font-bold text-forest-900 mb-1">{config.type}</h3>
                <div className="flex items-center gap-2 text-stone-500">
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-sm font-medium">{config.size}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <p className="text-stone-600 text-sm leading-relaxed mb-5">{config.desc}</p>
                <ul className="space-y-2 mb-6">
                  {config.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-stone-700">
                      <div className="w-2 h-2 rounded-full bg-forest-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onCTAClick}
                  className="flex items-center gap-2 text-forest-700 font-semibold text-sm hover:text-forest-900 hover:gap-3 transition-all duration-200 group"
                  id={`config-cta-${config.type}`}
                >
                  Get {config.type} Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal text-center mt-10">
          <p className="text-stone-500 text-sm mb-4">Not sure which configuration suits you?</p>
          <button onClick={onCTAClick} className="btn-secondary" id="config-help-cta">
            Talk to Our Sales Team
          </button>
        </div>
      </div>
    </section>
  );
}
