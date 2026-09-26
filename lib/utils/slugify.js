/**
 * Generates an SEO-friendly URL slug from any title or name string.
 * Supports Unicode/Arabic/multilingual characters.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[^\p{L}\p{N}]+/gu, '-') // replace any non-alphanumeric unicode char with -
    .replace(/^-+|-+$/g, '') // trim leading/trailing -
    .replace(/-+/g, '-'); // collapse consecutive -
}

/**
 * Safely extracts a slug from a category object or string.
 * Falls back to slugified name, and then ID.
 * @param {object|string} cat
 * @returns {string}
 */
export function getCategorySlug(cat) {
  if (!cat) return 'general';
  if (typeof cat === 'string') {
    return cat.trim() || 'general';
  }
  if (cat.slug && String(cat.slug).trim()) {
    return String(cat.slug).trim();
  }
  if (cat.name && String(cat.name).trim()) {
    return slugify(cat.name) || cat._id || cat.id || 'general';
  }
  return cat._id || cat.id || 'general';
}

/**
 * Safely extracts a slug from a reference object or string.
 * Falls back to slugified title, and then ID.
 * @param {object|string} ref
 * @returns {string}
 */
export function getReferenceSlug(ref) {
  if (!ref) return '';
  if (typeof ref === 'string') {
    return ref.trim();
  }
  if (ref.slug && String(ref.slug).trim()) {
    return String(ref.slug).trim();
  }
  if (ref.title && String(ref.title).trim()) {
    return slugify(ref.title) || ref._id || ref.id || '';
  }
  return ref._id || ref.id || '';
}
