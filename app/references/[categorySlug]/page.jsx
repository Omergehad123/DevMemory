import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  IoArrowBack, 
  IoLayersOutline, 
  IoDocumentTextOutline, 
  IoCalendarOutline,
  IoCodeSlashOutline,
  IoFolderOpenOutline
} from 'react-icons/io5'
import { HiArrowRight } from 'react-icons/hi2'
import { fetchCategoryBySlug } from '@/lib/api/categories.api'
import { fetchReferences } from '@/lib/api/references.api'
import { SITE_URL } from '@/lib/api/config'
import { formatDate } from '@/lib/utils/format'

export async function generateMetadata({ params }) {
  const { categorySlug } = await params
  const category = await fetchCategoryBySlug(categorySlug).catch(() => null)

  if (!category) {
    return {
      title: 'Category Not Found — DevMemory',
      robots: { index: false, follow: false },
    }
  }

  const catName = category.name || 'Category'
  const title = category.seoTitle || `${catName} References & Cheat Sheets`
  const description =
    category.seoDescription ||
    category.description ||
    `Explore comprehensive ${catName} programming references, syntax notes, best practices, and code examples on DevMemory.`
  const canonicalPath = `/references/${category.slug || categorySlug}`
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
      type: 'website',
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

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params
  const category = await fetchCategoryBySlug(categorySlug).catch(() => null)

  if (!category) {
    notFound()
  }

  const catId = category._id || category.id
  const catSlug = category.slug || categorySlug
  const catName = category.name || 'Category'
  const catDescription = category.description || ''
  const catStack = category.stack || 'General'

  // Fetch all references in this category
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

  const canonicalUrl = `${SITE_URL}/references/${catSlug}`

  // Schema.org Structured Data: CollectionPage & BreadcrumbList
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `${catName} References — DevMemory`,
        description: catDescription || `Developer cheat sheets and references for ${catName}.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: 'DevMemory',
          url: SITE_URL,
        },
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
            item: canonicalUrl,
          },
        ],
      },
    ],
  }

  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-(--bgColor) text-gray-100 flex flex-col py-10 px-4 sm:px-8 md:px-16'>
      {/* Schema.org Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className='max-w-6xl w-full mx-auto flex flex-col gap-8'>
        {/* Breadcrumb Bar */}
        <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-xs font-mono text-gray-400'>
          <Link href='/' className='hover:text-white transition-colors'>
            Home
          </Link>
          <span>&gt;</span>
          <Link href='/references' className='hover:text-white transition-colors'>
            References
          </Link>
          <span>&gt;</span>
          <span className='text-(--secondColor) font-bold'>{catName}</span>
        </nav>

        {/* Category Banner Header */}
        <div className='p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#131b2e] to-[#0b101c] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl'>
          <div className='flex items-start gap-5'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 shrink-0 shadow-inner overflow-hidden'>
              {category.image ? (
                <img
                  src={category.image}
                  alt={catName}
                  className='w-full h-full object-contain'
                />
              ) : (
                <IoCodeSlashOutline className='w-9 h-9 text-(--secondColor)' />
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2.5 flex-wrap'>
                <span className='px-3 py-1 rounded-full text-xs font-mono font-semibold bg-(--secondColor)/15 text-(--secondColor) border border-(--secondColor)/30'>
                  {catStack}
                </span>
                <span className='text-xs font-mono text-gray-400'>
                  {references.length} {references.length === 1 ? 'topic' : 'topics'}
                </span>
              </div>
              <h1 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>
                {catName} References
              </h1>
              {catDescription && (
                <p className='text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed'>
                  {catDescription}
                </p>
              )}
            </div>
          </div>

          <Link
            href='/references'
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors shrink-0'
          >
            <IoArrowBack className='text-sm' />
            <span>All Categories</span>
          </Link>
        </div>

        {/* References List / Grid */}
        <div>
          <div className='flex items-center justify-between pb-4 mb-6 border-b border-white/10'>
            <h2 className='text-lg sm:text-xl font-bold text-white flex items-center gap-2'>
              <IoLayersOutline className='text-(--secondColor)' />
              <span>Available Topics & Syntax Guides</span>
            </h2>
            <span className='text-xs font-mono text-gray-400'>
              Click a topic to view complete reference
            </span>
          </div>

          {references.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {references.map((ref, idx) => {
                const refSlug = ref.slug || ref._id || ref.id
                const refUrl = `/references/${catSlug}/${refSlug}`

                return (
                  <Link
                    key={ref._id || ref.id}
                    href={refUrl}
                    className='group relative flex flex-col justify-between p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-(--secondColor)/60 hover:shadow-xl hover:shadow-(--secondColor)/10 hover:-translate-y-1 transition-all duration-200'
                  >
                    <div>
                      {/* Topic Number & Icon */}
                      <div className='flex items-center justify-between mb-3 text-xs'>
                        <span className='w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-gray-300 group-hover:bg-(--secondColor) group-hover:text-white transition-colors'>
                          {idx + 1}
                        </span>
                        {ref.updatedAt && (
                          <div className='flex items-center gap-1 text-[11px] font-mono text-gray-500'>
                            <IoCalendarOutline className='text-xs' />
                            <span>{formatDate(ref.updatedAt)}</span>
                          </div>
                        )}
                      </div>

                      {/* Topic Title */}
                      <h3 className='text-base sm:text-lg font-bold text-white group-hover:text-(--secondColor) transition-colors mb-2 line-clamp-2'>
                        {ref.title}
                      </h3>

                      {/* Topic Description */}
                      {ref.description && (
                        <p className='text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed font-normal'>
                          {ref.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className='flex items-center justify-between pt-4 border-t border-white/5 mt-4 text-xs font-semibold text-(--secondColor) group-hover:text-white transition-colors'>
                      <span className='flex items-center gap-1'>
                        <IoDocumentTextOutline className='text-sm' />
                        <span>Read Reference</span>
                      </span>
                      <HiArrowRight className='w-4 h-4 transform group-hover:translate-x-1 transition-transform' />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className='py-20 text-center flex flex-col items-center gap-4 bg-[#111827]/40 rounded-3xl border border-white/5 p-8 max-w-md mx-auto'>
              <div className='w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 text-3xl'>
                <IoFolderOpenOutline />
              </div>
              <h3 className='text-xl font-bold text-white'>No Topics Published Yet</h3>
              <p className='text-xs sm:text-sm text-gray-400'>
                This category doesn&apos;t have any published references yet. Check back soon or browse other categories.
              </p>
              <Link
                href='/references'
                className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-colors'
              >
                <IoArrowBack className='text-sm' />
                <span>Explore Other Categories</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
