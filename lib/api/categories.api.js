import { API_BASE_URL } from "./config";

export async function fetchCategories(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page);
  if (params.limit) searchParams.set("limit", params.limit || 100);
  if (params.search) searchParams.set("search", params.search);

  const queryStr = searchParams.toString();
  const res = await fetch(`${API_BASE_URL}/categories${queryStr ? `?${queryStr}` : ""}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`);
  }

  const json = await res.json();
  return json.data; // { categories, pagination }
}

export async function fetchCategoryById(id) {
  if (!id) throw new Error("Category ID is required");
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch category (${res.status})`);
  }

  const json = await res.json();
  return json.data?.category;
}
