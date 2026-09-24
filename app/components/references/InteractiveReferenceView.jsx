'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { IoArrowBack, IoMenu } from 'react-icons/io5'
import ReferenceSidebar from './ReferenceSidebar'
import ReferenceViewer from './ReferenceViewer'
import { hasValidContent } from './DocumentRenderer'

function getDefaultTabForRef(ref) {
  if (!ref) return 'why'
  if (hasValidContent(ref.whyContent)) return 'why'
  if (hasValidContent(ref.whatContent || ref.content)) return 'what'
  if (hasValidContent(ref.howContent)) return 'how'
  return 'why'
}

export default function InteractiveReferenceView({
  category,
  activeReference,
  references = [],
  categorySlug,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeContentTab, setActiveContentTab] = useState(() =>
    getDefaultTabForRef(activeReference)
  )

  const categoryName = category?.name || activeReference?.categoryId?.name || 'Category'
  const categoryStack = category?.stack || activeReference?.categoryId?.stack || 'General'
  const catSlug = category?.slug || categorySlug

  // Filter references by search inside sidebar
  const filteredReferences = useMemo(() => {
    if (!searchQuery.trim()) return references
    return references.filter(
      (ref) =>
        ref.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [references, searchQuery])

  // Current index for next/prev calculations
  const currentIndex = useMemo(() => {
    if (!activeReference) return -1
    return references.findIndex(
      (r) =>
        (r._id && r._id === (activeReference._id || activeReference.id)) ||
        (r.slug && r.slug === activeReference.slug)
    )
  }, [references, activeReference])

  const prevRef = currentIndex > 0 ? references[currentIndex - 1] : null
  const nextRef =
    currentIndex >= 0 && currentIndex < references.length - 1
      ? references[currentIndex + 1]
      : null

  const selectedRefId = activeReference?._id || activeReference?.id || activeReference?.slug

  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-(--bgColor) text-gray-100 flex flex-col'>
      {/* Mobile Top Header / Breadcrumb Bar */}
      <div className='md:hidden bg-[#131b2e] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className='p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors'
            aria-label='Toggle topics menu'
          >
            <IoMenu className='text-lg' />
          </button>
          <div className='flex flex-col truncate'>
            <span className='text-[10px] uppercase font-mono text-(--secondColor) font-bold'>
              {categoryName}
            </span>
            <span className='text-xs font-semibold text-white truncate max-w-[200px]'>
              {activeReference ? activeReference.title : 'Topic'}
            </span>
          </div>
        </div>

        <Link
          href={`/references/${catSlug}`}
          className='flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white px-2 py-1.5 rounded-lg bg-white/5'
        >
          <IoArrowBack className='text-xs' />
          <span>Hub</span>
        </Link>
      </div>

      {/* Main Layout Area */}
      <div className='flex-1 flex w-full relative'>
        <ReferenceSidebar
          categoryName={categoryName}
          categoryStack={categoryStack}
          categorySlug={catSlug}
          references={references}
          filteredReferences={filteredReferences}
          selectedRefId={selectedRefId}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className='flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-8 sm:py-10 w-full'>
          <ReferenceViewer
            activeReference={activeReference}
            categoryName={categoryName}
            categoryStack={categoryStack}
            categorySlug={catSlug}
            activeContentTab={activeContentTab}
            setActiveContentTab={setActiveContentTab}
            prevRef={prevRef}
            nextRef={nextRef}
          />
        </main>
      </div>
    </div>
  )
}
