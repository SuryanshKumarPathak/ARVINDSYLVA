import { useEffect, useRef } from 'react';

/**
 * Intersection Observer hook for scroll-reveal animations.
 * Adds 'visible' class to each observed element when it enters the viewport.
 */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    );

    const elements = el.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    // Also observe the container itself if it has reveal class
    if (el.classList.contains('reveal')) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
};

export default useScrollReveal;
