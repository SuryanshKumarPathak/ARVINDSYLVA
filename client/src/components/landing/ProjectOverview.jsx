import useScrollReveal from '../../hooks/useScrollReveal';

export default function ProjectOverview({ onCTAClick }) {
  const ref = useScrollReveal();

  return (
    <section id="overview" className="py-20 md:py-28 bg-cream-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="reveal section-label mb-3">About the Project</p>
            <h2 className="reveal section-title mb-6">
              Where Nature Meets<br />
              <span className="text-forest-700 italic">Elevated Living</span>
            </h2>
            <div className="reveal h-0.5 w-16 bg-gold-400 mb-8" />
            <p className="reveal section-subtitle mb-6">
              Experience nature-inspired luxury with premium 3 &amp; 4 BHK residences
              designed for elevated living at Arvind Sylva, Sarjapur, Bangalore.
            </p>
            <p className="reveal text-stone-600 leading-relaxed mb-8">
              Nestled opposite the Wipro Campus in Kodathi, Arvind Sylva brings together
              the best of Bangalore — a thriving tech ecosystem, excellent connectivity
              to ORR, Electronic City &amp; Whitefield — with the serenity of 70% open,
              green spaces. A home here is not just a residence; it is a statement
              of how you choose to live.
            </p>
            <div className="reveal flex flex-wrap gap-3 mb-8">
              {['3 BHK', '4 BHK', '1,500–2,300 sq. ft.', 'Bookings Open'].map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-forest-800 text-cream-100 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={onCTAClick}
              className="reveal btn-primary"
              id="overview-cta"
            >
              Register Your Interest
            </button>
          </div>

          {/* Stats grid */}
          <div className="reveal grid grid-cols-2 gap-4">
            {[
              { value: '374', label: 'Exclusive Residences', icon: '🏛️' },
              { value: '70%', label: 'Open Spaces', icon: '🌿' },
              { value: '40+', label: 'Lifestyle Amenities', icon: '✨' },
              { value: '15,000+', label: 'sq. ft. Clubhouse', icon: '🏊' },
              { value: '2B+G+17', label: 'Tower Configuration', icon: '🏗️' },
              { value: '1,500–2,300', label: 'sq. ft. Home Sizes', icon: '📐' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="card-luxury p-5 text-center hover:-translate-y-1 transition-transform duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-display text-2xl font-bold text-forest-800 leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-stone-500 mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
