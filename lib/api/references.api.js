import { API_BASE_URL } from "./config";

export async function fetchReferences(params = {}) {
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
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);

  const queryStr = searchParams.toString();
  const res = await fetch(`${API_BASE_URL}/references${queryStr ? `?${queryStr}` : ""}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch references (${res.status})`);
  }

  const json = await res.json();
  return json.data; // { references, pagination }
}

export async function fetchReferenceById(id) {
  if (!id) throw new Error("Reference ID is required");
  const res = await fetch(`${API_BASE_URL}/references/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch reference (${res.status})`);
  }

  const json = await res.json();
  return json.data?.reference;
}
