export const GA_TRACKING_ID = 'G-K027G0YD6R';

// Generic gtag wrapper
export const gtag = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
};

// Track search term event in Google Analytics
export const trackSearch = (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string') return;
  const term = searchTerm.trim();
  if (!term) return;

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'search', {
      search_term: term,
    });
  }
};
