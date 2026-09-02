import useScrollReveal from '../../hooks/useScrollReveal';

const NATURE_FEATURES = [
  {
    title: 'Breathe Pure',
    desc: '70% of the project area is dedicated to open, green spaces — lawns, gardens, and tree-lined pathways.',
    icon: '🌿',
  },
  {
    title: 'Live Serene',
    desc: 'Designed to bring nature indoors with cross-ventilated homes, natural light, and green views from every window.',
    icon: '🌅',
  },
  {
    title: 'Stay Connected',
    desc: 'Proximity to tech parks, hospitals, schools, and entertainment without compromising on peace.',
    icon: '🌳',
  },
];

export default function NatureSection({ onCTAClick }) {
  const ref = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-forest-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-forest-200/30 rounded-sm -z-10" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-forest-800 rounded-sm p-8 flex flex-col items-center justify-center text-center aspect-square">
                  <span className="text-6xl mb-3">🌿</span>
                  <span className="font-display text-4xl font-bold text-gold-400">70%</span>
                  <span className="text-white/70 text-sm mt-1">Open Spaces</span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-cream-200 rounded-sm p-6 flex flex-col items-center justify-center text-center flex-1">
                    <span className="text-4xl mb-2">🏡</span>
                    <span className="font-display text-2xl font-bold text-forest-800">374</span>
                    <span className="text-stone-600 text-xs mt-0.5">Exclusive Homes</span>
                  </div>
                  <div className="bg-gold-500 rounded-sm p-6 flex flex-col items-center justify-center text-center flex-1">
                    <span className="text-4xl mb-2">🌳</span>
                    <span className="font-display text-2xl font-bold text-white">Nature</span>
                    <span className="text-white/80 text-xs mt-0.5">Inspired Living</span>
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-forest-200 rounded-sm p-6 text-center">
                  <p className="font-display text-2xl text-forest-800 italic font-medium">
                    "Bring the Best of Bangalore Home."
                  </p>
                  <p className="text-stone-500 text-sm mt-2">Arvind Sylva · Sarjapur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <p className="reveal section-label mb-3">Nature-Inspired Living</p>
            <h2 className="reveal section-title mb-6">
              Where Forests Meet<br />
              <span className="text-forest-700 italic">Modern Luxury</span>
            </h2>
            <div className="reveal h-0.5 w-16 bg-gold-400 mb-8" />
            <div className="space-y-6">
              {NATURE_FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="reveal flex gap-4"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-4xl flex-shrink-0 w-12 text-center">{f.icon}</div>
                  <div>
                    <h3 className="font-display text-xl text-forest-800 font-semibold mb-1">{f.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onCTAClick} className="reveal btn-primary mt-10" id="nature-cta">
              Experience It Yourself
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
