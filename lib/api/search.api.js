import { fetchCategories } from "./categories.api";
import { fetchReferences } from "./references.api";

export async function searchAll(query, options = {}) {
  const limit = options.limit || 5;
  if (!query || !query.trim()) {
    return { categories: [], references: [] };
  }

  const [catData, refData] = await Promise.all([
    fetchCategories({ search: query.trim(), limit }).catch((err) => {
      console.error("Error searching categories:", err);
      return { categories: [] };
    }),
    fetchReferences({ search: query.trim(), limit }).catch((err) => {
      console.error("Error searching references:", err);
      return { references: [] };
    }),
  ]);

  return {
    categories: catData?.categories || [],
    references: refData?.references || [],
  };
}
