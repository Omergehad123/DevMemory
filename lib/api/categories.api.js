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

export async function fetchCategoryById(id, options = {}) {
  return fetchCategoryBySlug(id, options);
}

export async function fetchCategoryBySlug(slugOrId, options = {}) {
  if (!slugOrId) throw new Error("Category slug or ID is required");

  const fetchOptions = {
    next: { revalidate: options.revalidate !== undefined ? options.revalidate : 60 },
    ...options,
  };

  const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slugOrId)}`, fetchOptions);

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch category (${res.status})`);
  }

  const json = await res.json();
  return json.data?.category || null;
}

