import { fetchCategories } from '@/lib/api/categories.api'
import { fetchReferences } from '@/lib/api/references.api'
import { SITE_URL } from '@/lib/api/config'

export default async function sitemap() {
  const staticRoutes = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/references`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    const [categoriesData, referencesData] = await Promise.all([
      fetchCategories({ limit: 500 }, { next: { revalidate: 3600 } }).catch(() => ({ categories: [] })),
      fetchReferences({ limit: 2000 }, { next: { revalidate: 3600 } }).catch(() => ({ references: [] })),
    ])

    const categories = categoriesData?.categories || []
    const references = referencesData?.references || []

    // Build category map for quick slug lookup
    const categoryMap = new Map()
    categories.forEach((cat) => {
      const catId = cat._id || cat.id
      const catSlug = cat.slug || catId
      categoryMap.set(String(catId), catSlug)
      if (cat.name) {
        categoryMap.set(cat.name.toLowerCase(), catSlug)
      }
    })

    // Dynamic Category URLs
    const categoryRoutes = categories.map((cat) => {
      const catSlug = cat.slug || cat._id || cat.id
      return {
        url: `${SITE_URL}/references/${catSlug}`,
        lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }
    })

    // Dynamic Reference URLs
    const referenceRoutes = references
      .map((ref) => {
        const rawCat = ref.categoryId
        let catSlug = 'general'

        if (typeof rawCat === 'object' && rawCat !== null) {
          catSlug = rawCat.slug || rawCat._id || rawCat.id || 'general'
        } else if (rawCat) {
          catSlug = categoryMap.get(String(rawCat)) || rawCat
        }

        const refSlug = ref.slug || ref._id || ref.id
        if (!refSlug) return null

        return {
          url: `${SITE_URL}/references/${catSlug}/${refSlug}`,
          lastModified: ref.updatedAt ? new Date(ref.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }
      })
      .filter(Boolean)

    return [...staticRoutes, ...categoryRoutes, ...referenceRoutes]
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err)
    return staticRoutes
  }
}
