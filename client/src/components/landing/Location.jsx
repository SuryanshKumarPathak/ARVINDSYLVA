import { MapPin, Navigation, Building2, Wifi } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const CONNECTIVITY = [
  { label: 'Wipro Campus', distance: 'Opposite', icon: Building2 },
  { label: 'Outer Ring Road', distance: 'Nearby', icon: Navigation },
  { label: 'Electronic City', distance: 'Close by', icon: Building2 },
  { label: 'Whitefield', distance: 'Well connected', icon: Wifi },
];

const NEARBY = [
  { category: 'Tech Parks', items: ['Wipro Campus (Opp.)', 'RGA Tech Park', 'Salarpuria Softzone'] },
  { category: 'Education', items: ['Inventure Academy', 'Chrysalis High', 'DPS East'] },
  { category: 'Healthcare', items: ['Sakra World Hospital', 'Columbia Asia', 'Narayana Health'] },
  { category: 'Shopping', items: ['Forum Mall', 'Market Square', 'Central Mall'] },
];

export default function Location({ onCTAClick }) {
  const ref = useScrollReveal();

  return (
    <section id="location" className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="reveal section-label mb-3">Location & Connectivity</p>
          <h2 className="reveal section-title mb-4">
            Perfectly Positioned in<br />
            <span className="text-forest-700 italic">Sarjapur, Bangalore</span>
          </h2>
          <div className="reveal flex items-center justify-center gap-2 text-stone-500 mb-6">
            <MapPin className="w-4 h-4 text-gold-500" />
            <span className="text-sm">Opp. Wipro Campus, Kodathi, Sarjapur, Bangalore</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map placeholder */}
          <div className="reveal lg:col-span-2">
            <div className="bg-forest-50 border border-forest-200 rounded-sm overflow-hidden aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-forest-100 to-forest-200" />
              <div className="relative text-center p-8">
                <MapPin className="w-12 h-12 text-forest-700 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-forest-800 font-bold mb-2">Arvind Sylva</h3>
                <p className="text-forest-600 text-sm mb-4">Opp. Wipro Campus, Kodathi, Sarjapur</p>
                <a
                  href="https://maps.google.com/?q=Wipro+Campus+Sarjapur+Bangalore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Open in Google Maps
                </a>
              </div>
              {/* Decorative grid lines */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#2e703c 1px, transparent 1px), linear-gradient(90deg, #2e703c 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            {/* Connectivity chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {CONNECTIVITY.map(({ label, distance, icon: Icon }) => (
                <div key={label} className="card-luxury p-3 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-stone-800 leading-tight">{label}</div>
                    <div className="text-xs text-gold-600">{distance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby */}
          <div className="reveal space-y-4">
            {NEARBY.map((group) => (
              <div key={group.category} className="card-luxury p-4">
                <h4 className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-2">{group.category}</h4>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={onCTAClick} className="btn-primary w-full" id="location-cta">
              Get Location Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
