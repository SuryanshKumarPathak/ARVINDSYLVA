/**
 * Extract UTM parameters and ad tracking IDs from URL
 * and persist them in sessionStorage so they survive
 * multi-page navigation before form submission.
 */

const UTM_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign',
  'utm_term', 'utm_content', 'gclid', 'fbclid',
];

const STORAGE_KEY = 'as_attribution';

export const captureAttribution = () => {
  const params = new URLSearchParams(window.location.search);
  const existing = getAttribution();

  const attribution = {
    ...existing,
    landingPage: existing.landingPage || window.location.href,
    referrer: existing.referrer || document.referrer || '',
  };

  // Only update UTM params if new ones are present (first touch wins for source)
  let hasNewParams = false;
  UTM_KEYS.forEach((key) => {
    if (params.get(key)) {
      attribution[key] = params.get(key);
      hasNewParams = true;
    }
  });

  // Always update landing page if we have campaign params
  if (hasNewParams) {
    attribution.landingPage = window.location.href;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
};

export const getAttribution = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const clearAttribution = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const getAttributionForForm = () => {
  const attr = getAttribution();
  return {
    source: attr.utm_source || '',
    medium: attr.utm_medium || '',
    campaign: attr.utm_campaign || '',
    term: attr.utm_term || '',
    content: attr.utm_content || '',
    gclid: attr.gclid || '',
    fbclid: attr.fbclid || '',
    landingPage: attr.landingPage || window.location.href,
    referrer: attr.referrer || document.referrer || '',
  };
};
