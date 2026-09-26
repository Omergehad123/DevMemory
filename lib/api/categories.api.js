import { API_BASE_URL } from "./config";

export async function fetchCategories(params = {}, options = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page);
  if (params.limit) searchParams.set("limit", params.limit || 100);
  if (params.search) searchParams.set("search", params.search);

  const queryStr = searchParams.toString();
  const fetchOptions = {
    next: { revalidate: options.revalidate !== undefined ? options.revalidate : 60 },
    ...options,
  };

  const res = await fetch(`${API_BASE_URL}/categories${queryStr ? `?${queryStr}` : ""}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`);
  }

  const json = await res.json();
  return json.data; // { categories, pagination }
}

import { slugify } from "@/lib/utils/slugify";

export async function fetchCategoryById(id, options = {}) {
  return fetchCategoryBySlug(id, options);
}

export async function fetchCategoryBySlug(slugOrId, options = {}) {
  if (!slugOrId) throw new Error("Category slug or ID is required");

  const fetchOptions = {
    next: { revalidate: options.revalidate !== undefined ? options.revalidate : 60 },
    ...options,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slugOrId)}`, fetchOptions);

    if (res.ok) {
      const json = await res.json();
      if (json.data?.category) {
        return json.data.category;
      }
    }
  } catch (err) {
    // Network or fetch error, proceed to fallback
  }

  // Fallback: search the categories list if backend endpoint returns 400 or 404
  try {
    const all = await fetchCategories({ limit: 100 }, fetchOptions);
    const clean = String(slugOrId).trim().toLowerCase();
    const found = (all?.categories || []).find(
      (c) =>
        (c.slug && c.slug.toLowerCase() === clean) ||
        (c.name && c.name.toLowerCase() === clean) ||
        (c.name && slugify(c.name) === clean) ||
        c._id === slugOrId ||
        c.id === slugOrId
    );
    if (found) return found;
  } catch (e) {
    console.error("fetchCategoryBySlug fallback failed:", e);
  }

  return null;
}


