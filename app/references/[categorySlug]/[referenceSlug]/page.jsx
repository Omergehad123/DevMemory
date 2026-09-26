import React from 'react'
import { notFound } from 'next/navigation'
import { fetchCategoryBySlug } from '@/lib/api/categories.api'
import { fetchReferenceBySlug, fetchReferences } from '@/lib/api/references.api'
import { SITE_URL } from '@/lib/api/config'
import InteractiveReferenceView from '@/app/components/references/InteractiveReferenceView'
import { slugify } from '@/lib/utils/slugify'

export async function generateMetadata({ params }) {
  const { categorySlug, referenceSlug } = await params

  const [category, reference] = await Promise.all([
    fetchCategoryBySlug(categorySlug).catch(() => null),
    fetchReferenceBySlug(referenceSlug, categorySlug).catch(() => null),
  ])

  if (!category || !reference) {
    return {
      title: 'Reference Not Found — DevMemory',
      robots: { index: false, follow: false },
    }
  }

  const catName = category.name || 'Category'
  const title = reference.seoTitle || `${reference.title} — ${catName} Reference`
  const description =
    reference.seoDescription ||
    reference.description ||
    `Learn ${reference.title} in ${catName}. Complete developer reference with Why, What, and How explanations, syntax, and practical examples.`

  const canonicalCatSlug = category.slug || slugify(category.name) || categorySlug
  const canonicalRefSlug = reference.slug || slugify(reference.title) || referenceSlug
  const canonicalPath = `/references/${canonicalCatSlug}/${canonicalRefSlug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${title} — DevMemory`,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: reference.createdAt,
      modifiedTime: reference.updatedAt,
      section: catName,
      images: category.image ? [{ url: category.image }] : [{ url: '/logo.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — DevMemory`,
      description,
      images: category.image ? [category.image] : ['/logo.png'],
    },
  }
}

export default async function ReferenceDetailPage({ params }) {
  const { categorySlug, referenceSlug } = await params

  const [category, reference] = await Promise.all([
    fetchCategoryBySlug(categorySlug).catch(() => null),
    fetchReferenceBySlug(referenceSlug, categorySlug).catch(() => null),
  ])

  if (!category || !reference) {
    notFound()
  }

  const catId = category._id || category.id
  const catSlug = category.slug || slugify(category.name) || categorySlug
  const refSlug = reference.slug || slugify(reference.title) || referenceSlug
  const catName = category.name || 'Category'

  // Fetch sibling references in this category for sidebar navigation
  let references = []
  try {
    const refsData = await fetchReferences(
      { categoryId: catId, limit: 100 },
      { next: { revalidate: 60 } }
    )
    references = refsData?.references || []
  } catch (err) {
    console.error('Failed to load category references:', err)
  }

  const canonicalUrl = `${SITE_URL}/references/${catSlug}/${refSlug}`
  const categoryUrl = `${SITE_URL}/references/${catSlug}`

  // Schema.org Structured Data: TechArticle & BreadcrumbList
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        url: canonicalUrl,
        headline: reference.title,
        description:
          reference.description ||
          `Developer documentation and reference for ${reference.title} in ${catName}.`,
        datePublished: reference.createdAt || new Date().toISOString(),
        dateModified: reference.updatedAt || new Date().toISOString(),
        inLanguage: 'en',
        mainEntityOfPage: canonicalUrl,
        author: {
          '@type': 'Organization',
          name: 'DevMemory',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'DevMemory',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
          },
        },
        articleSection: catName,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'References',
            item: `${SITE_URL}/references`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: catName,
            item: categoryUrl,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: reference.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  }

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Interactive Reference View */}
      <InteractiveReferenceView
        category={category}
        activeReference={reference}
        references={references}
        categorySlug={catSlug}
      />
    </>
  )
}
