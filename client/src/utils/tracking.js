/**
 * Centralized analytics & ad pixel tracking utility.
 * All tracking IDs come from environment variables.
 * Falls back gracefully if pixels are not configured.
 */

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID;
const GOOGLE_ADS_LABEL = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fbq = (...args) => {
  if (typeof window !== 'undefined' && window.fbq) window.fbq(...args);
};

const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag) window.gtag(...args);
};

// ─── Initialize Meta Pixel ────────────────────────────────────────────────────
export const initMetaPixel = () => {
  if (!META_PIXEL_ID) return;
  !function(f,b,e,v,n,t,s){
    if(f.fbq) return;
    n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq) f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', META_PIXEL_ID);
};

// ─── Initialize GA4 ───────────────────────────────────────────────────────────
export const initGA4 = () => {
  if (!GA_ID) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
};

// ─── Events ───────────────────────────────────────────────────────────────────
export const trackPageView = (path) => {
  fbq('track', 'PageView');
  if (GA_ID) gtag('event', 'page_view', { page_path: path || window.location.pathname });
};

export const trackViewContent = () => {
  fbq('track', 'ViewContent', { content_name: 'Arvind Sylva', content_category: 'Real Estate' });
  gtag('event', 'view_item', { items: [{ item_name: 'Arvind Sylva', item_category: 'Real Estate' }] });
};

export const trackFormStart = () => {
  fbq('trackCustom', 'FormStart');
  gtag('event', 'form_start', { form_name: 'lead_form' });
};

export const trackLeadGenerated = (leadData = {}) => {
  // Meta – Lead standard event
  fbq('track', 'Lead', {
    content_name: 'Arvind Sylva Lead',
    content_category: 'Real Estate',
    currency: 'INR',
  });

  // GA4 – generate_lead
  gtag('event', 'generate_lead', { currency: 'INR', value: 0 });

  // Google Ads conversion
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LABEL) {
    gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LABEL}`,
      currency: 'INR',
    });
  }
};

export const trackSiteVisitCTA = () => {
  fbq('trackCustom', 'SiteVisitCTA');
  gtag('event', 'site_visit_cta_click');
};

export const trackPhoneClick = () => {
  fbq('trackCustom', 'PhoneClick');
  gtag('event', 'phone_click');
};

export const trackWhatsAppClick = () => {
  fbq('trackCustom', 'WhatsAppClick');
  gtag('event', 'whatsapp_click');
};

export const initTracking = () => {
  initMetaPixel();
  initGA4();
};
