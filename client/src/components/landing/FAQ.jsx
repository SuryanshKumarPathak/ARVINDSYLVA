import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const FAQS = [
  {
    q: 'Where is Arvind Sylva located?',
    a: 'Arvind Sylva is located opposite the Wipro Campus, Kodathi, Sarjapur, Bangalore — one of Bengaluru\'s fastest-growing residential and commercial corridors.',
  },
  {
    q: 'What configurations are available at Arvind Sylva?',
    a: 'Arvind Sylva offers premium 3 BHK and 4 BHK residences ranging from 1,500 to 2,300 sq. ft., designed for families seeking space, luxury, and nature-inspired living.',
  },
  {
    q: 'How many residences are there in the project?',
    a: 'Arvind Sylva comprises 374 exclusive residences across 2 Basement + Ground + 17 upper floors.',
  },
  {
    q: 'What amenities are offered at Arvind Sylva?',
    a: 'The project offers 40+ world-class lifestyle amenities including a 15,000+ sq. ft. grand clubhouse, swimming pool, fitness center, yoga deck, sports courts, children\'s play areas, landscaped gardens, and much more.',
  },
  {
    q: 'Are bookings currently open?',
    a: 'Yes, bookings are now open for Arvind Sylva. Please fill in the enquiry form and our sales team will get in touch with you at the earliest.',
  },
  {
    q: 'How can I schedule a site visit?',
    a: 'You can register your interest using the form on this page or call/WhatsApp our sales team. We\'ll arrange a guided site visit at your preferred time.',
  },
  {
    q: 'What is the connectivity like from Arvind Sylva?',
    a: 'Arvind Sylva enjoys excellent connectivity to the Outer Ring Road (ORR), Electronic City, and Whitefield. It is located directly opposite the Wipro Campus and is surrounded by Sarjapur\'s growing social infrastructure.',
  },
];

function FAQItem({ faq, isOpen, toggle }) {
  return (
    <div className="border border-stone-200 rounded-sm overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-forest-50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-stone-800 pr-4 group-hover:text-forest-800 transition-colors">{faq.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-5 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-4 bg-white">
          {faq.a}
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ onCTAClick }) {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useScrollReveal();

  return (
    <section id="faq" className="py-20 md:py-28 bg-cream-50" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="reveal section-label mb-3">Frequently Asked Questions</p>
          <h2 className="reveal section-title mb-4">
            Everything You Need<br />
            <span className="text-forest-700 italic">to Know</span>
          </h2>
          <div className="reveal h-0.5 w-12 bg-gold-400 mx-auto" />
        </div>

        <div className="reveal space-y-3 mb-12">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>

        <div className="reveal text-center bg-forest-800 rounded-sm p-8">
          <p className="font-display text-2xl text-white font-semibold mb-2">Still have questions?</p>
          <p className="text-white/60 text-sm mb-6">Our team is happy to answer any specific questions about Arvind Sylva.</p>
          <button onClick={onCTAClick} className="btn-gold" id="faq-cta">
            Talk to Our Team
          </button>
        </div>
      </div>
    </section>
  );
}
