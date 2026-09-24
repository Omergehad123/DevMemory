import { API_BASE_URL } from "./config";

export async function fetchReferences(params = {}, options = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page);
  if (params.limit) searchParams.set("limit", params.limit || 100);
  if (params.search) searchParams.set("search", params.search);
  if (params.categoryId && params.categoryId !== "all") {
    searchParams.set("categoryId", params.categoryId);
  }
  if (params.category && params.category !== "all") {
    searchParams.set("categoryId", params.category);
  }
  if (params.categorySlug && params.categorySlug !== "all") {
    searchParams.set("categorySlug", params.categorySlug);
  }
  if (params.slug) {
    searchParams.set("slug", params.slug);
  }
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);

  const queryStr = searchParams.toString();
  const fetchOptions = {
    next: { revalidate: options.revalidate !== undefined ? options.revalidate : 60 },
    ...options,
  };

  const res = await fetch(`${API_BASE_URL}/references${queryStr ? `?${queryStr}` : ""}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`Failed to fetch references (${res.status})`);
  }

  const json = await res.json();
  return json.data; // { references, pagination }
}

export async function fetchReferenceById(id, options = {}) {
  return fetchReferenceBySlug(id, null, options);
}

export async function fetchReferenceBySlug(slugOrId, categorySlugOrId = null, options = {}) {
  if (!slugOrId) throw new Error("Reference slug or ID is required");

  const searchParams = new URLSearchParams();
  if (categorySlugOrId) {
    searchParams.set("categorySlug", categorySlugOrId);
  }

  const queryStr = searchParams.toString();
  const fetchOptions = {
    next: { revalidate: options.revalidate !== undefined ? options.revalidate : 60 },
    ...options,
  };

  const res = await fetch(
    `${API_BASE_URL}/references/${encodeURIComponent(slugOrId)}${queryStr ? `?${queryStr}` : ""}`,
    fetchOptions
  );

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch reference (${res.status})`);
  }

  const json = await res.json();
  return json.data?.reference || null;
}

