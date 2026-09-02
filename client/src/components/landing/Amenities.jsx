import useScrollReveal from '../../hooks/useScrollReveal';

const AMENITIES = [
  { icon: '🏊', name: 'Swimming Pool' },
  { icon: '💪', name: 'Fitness Center' },
  { icon: '🧘', name: 'Yoga Deck' },
  { icon: '🎾', name: 'Sports Courts' },
  { icon: '🎪', name: 'Grand Clubhouse' },
  { icon: '🌿', name: 'Landscaped Gardens' },
  { icon: '👶', name: "Children's Play Area" },
  { icon: '🚶', name: 'Walking Trails' },
  { icon: '🎭', name: 'Party Hall' },
  { icon: '📚', name: 'Library & Co-work' },
  { icon: '🏀', name: 'Basketball Court' },
  { icon: '🎮', name: 'Gaming Zone' },
  { icon: '🧖', name: 'Spa & Wellness' },
  { icon: '🐕', name: 'Pet-Friendly Zone' },
  { icon: '🚗', name: 'Covered Parking' },
  { icon: '🔒', name: '24/7 Security' },
  { icon: '⚡', name: 'EV Charging' },
  { icon: '🌱', name: 'Organic Garden' },
  { icon: '🏃', name: 'Jogging Track' },
  { icon: '🎵', name: 'Amphitheatre' },
];

export default function Amenities({ onCTAClick }) {
  const ref = useScrollReveal();

  return (
    <section id="amenities" className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="reveal section-label mb-3">Lifestyle Amenities</p>
          <h2 className="reveal section-title mb-4">
            40+ World-Class<br />
            <span className="text-forest-700 italic">Lifestyle Amenities</span>
          </h2>
          <div className="reveal h-0.5 w-12 bg-gold-400 mx-auto mb-6" />
          <p className="reveal section-subtitle max-w-xl mx-auto">
            Every day at Arvind Sylva feels like a curated resort experience — designed for wellness, connection, and joy.
          </p>
        </div>

        <div className="reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-12">
          {AMENITIES.map((a, i) => (
            <div
              key={a.name}
              className="group flex flex-col items-center gap-2 p-4 rounded-sm border border-stone-100 hover:border-forest-200 hover:bg-forest-50 transition-all duration-300 cursor-default"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{a.icon}</span>
              <span className="text-xs font-medium text-stone-600 text-center leading-tight">{a.name}</span>
            </div>
          ))}
        </div>

        {/* 15,000 sq ft Clubhouse banner */}
        <div className="reveal bg-forest-800 rounded-sm p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase mb-2">Grand Clubhouse</p>
            <h3 className="font-display text-3xl md:text-4xl text-white font-bold mb-2">15,000+ sq. ft.</h3>
            <p className="text-white/60 text-base">A grand social hub for recreation, celebration, and community.</p>
          </div>
          <button onClick={onCTAClick} className="btn-gold flex-shrink-0" id="amenities-cta">
            Explore Amenities
          </button>
        </div>
      </div>
    </section>
  );
}
