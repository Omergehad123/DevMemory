import React from 'react'
import { fetchCategories } from '@/lib/api/categories.api'
import { SITE_URL } from '@/lib/api/config'
import ReferencesExplorer from '@/app/components/references/ReferencesExplorer'

export const metadata = {
  title: 'All Categories & Developer References',
  description:
    'Browse all programming categories, tech stacks, and topics in DevMemory. Access concise cheat sheets, syntax explanations, and practical code snippets.',
  alternates: {
    canonical: '/references',
  },
  openGraph: {
    title: 'All Categories & Developer References — DevMemory',
    description:
      'Browse programming categories, tech stacks, and developer notes.',
    url: `${SITE_URL}/references`,
    type: 'website',
  },
}

export default async function ReferencesPage() {
  let initialCategories = []
  try {
    const data = await fetchCategories({ limit: 100 }, { next: { revalidate: 60 } })
    initialCategories = data?.categories || []
  } catch (err) {
    console.error('SSR fetchCategories error:', err)
  }

  // Schema.org CollectionPage and BreadcrumbList
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/references#webpage`,
        url: `${SITE_URL}/references`,
        name: 'Developer References & Categories — DevMemory',
        description:
          'Explore programming languages, frameworks, and tools reference library.',
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
        ],
      },
    ],
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ReferencesExplorer initialCategories={initialCategories} />
    </>
  )
}
