/**
 * Formats a date string into a user-friendly format (e.g., 'Sep 21, 2026').
 * @param {string|Date} dateStr 
 * @returns {string|null}
 */
export function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}
