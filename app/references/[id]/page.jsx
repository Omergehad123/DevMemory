'use client'

import React, { useState, useEffect, useMemo, use } from 'react'
import Link from 'next/link'
import { IoArrowBack, IoMenu, IoFolderOpenOutline } from 'react-icons/io5'
import { fetchCategoryById } from '@/lib/api/categories.api'
import { fetchReferences } from '@/lib/api/references.api'
import { hasValidContent } from '@/app/components/references/DocumentRenderer'
import ReferenceSidebar from '@/app/components/references/ReferenceSidebar'
import ReferenceViewer from '@/app/components/references/ReferenceViewer'

function getDefaultTabForRef(ref) {
  if (!ref) return 'why'
  if (hasValidContent(ref.whyContent)) return 'why'
  if (hasValidContent(ref.whatContent || ref.content)) return 'what'
  if (hasValidContent(ref.howContent)) return 'how'
  return 'why'
}

export default function CategoryReferencesPage({ params }) {
  const resolvedParams = use(params)
  const categoryId = resolvedParams?.id

  const [category, setCategory] = useState(null)
  const [references, setReferences] = useState([])
  const [selectedRefId, setSelectedRefId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeContentTab, setActiveContentTab] = useState('why')

  useEffect(() => {
    let isMounted = true
    async function loadCategoryAndReferences() {
      if (!categoryId) return
      try {
        setError(null)
        const [catData, refsData] = await Promise.all([
          fetchCategoryById(categoryId).catch(() => null),
          fetchReferences({ categoryId, limit: 100 }),
        ])

        if (!isMounted) return

        setCategory(catData)
        const refs = refsData?.references || []
        setReferences(refs)

        if (refs.length > 0) {
          const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
          const paramRefId = urlParams?.get('ref')
          const matchedRef = paramRefId ? refs.find((r) => (r._id || r.id) === paramRefId) : null
          const initialRef = matchedRef || refs[0]
          setSelectedRefId(initialRef._id || initialRef.id)
          setActiveContentTab(getDefaultTabForRef(initialRef))
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to load category references:', err)
        setError(err.message || 'Failed to load category references.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadCategoryAndReferences()
    return () => {
      isMounted = false
    }
  }, [categoryId])

  const handleSelectReference = (refId) => {
    setSelectedRefId(refId)
    setMobileSidebarOpen(false)
    const targetRef = references.find((r) => (r._id || r.id) === refId)
    if (targetRef) {
      setActiveContentTab(getDefaultTabForRef(targetRef))
    }
  }

  const handleNavigateReference = (refId) => {
    handleSelectReference(refId)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Filter references by search
  const filteredReferences = useMemo(() => {
    if (!searchQuery.trim()) return references
    return references.filter((ref) =>
      ref.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [references, searchQuery])

  // Find active reference object
  const activeReference = useMemo(() => {
    return references.find((r) => (r._id || r.id) === selectedRefId) || references[0] || null
  }, [references, selectedRefId])

  // Next and Previous references index calculations
  const currentIndex = useMemo(() => {
    if (!activeReference) return -1
    return references.findIndex((r) => (r._id || r.id) === (activeReference._id || activeReference.id))
  }, [references, activeReference])

  const prevRef = currentIndex > 0 ? references[currentIndex - 1] : null
  const nextRef = currentIndex >= 0 && currentIndex < references.length - 1 ? references[currentIndex + 1] : null

  if (isLoading) {
    return (
      <main className='w-full flex-1 bg-(--bgColor) min-h-[calc(100vh-80px)] flex items-center justify-center p-6'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='w-12 h-12 rounded-full border-4 border-(--secondColor)/30 border-t-(--secondColor) animate-spin' />
          <p className='text-gray-300 font-medium text-sm sm:text-base'>
            Loading references...
          </p>
        </div>
      </main>
    )
  }

  if (error || (!category && references.length === 0)) {
    return (
      <main className='w-full flex-1 bg-(--bgColor) min-h-[calc(100vh-80px)] flex items-center justify-center p-6'>
        <div className='max-w-md w-full bg-[#131b2e] border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center gap-4 shadow-2xl'>
          <div className='w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center text-2xl font-bold'>
            !
          </div>
          <h2 className='text-xl font-bold text-white'>Category Not Found</h2>
          <p className='text-sm text-gray-400'>
            {error || 'The requested category does not exist or has been removed.'}
          </p>
          <Link
            href='/references'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all'
          >
            <IoArrowBack className='text-base' />
            <span>Back to Categories</span>
          </Link>
        </div>
      </main>
    )
  }

  const categoryName = category?.name || activeReference?.categoryId?.name || 'Category'
  const categoryStack = category?.stack || activeReference?.categoryId?.stack || 'General'

  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-(--bgColor) text-gray-100 flex flex-col'>
      {/* Mobile Top Header / Breadcrumb Bar */}
      <div className='md:hidden bg-[#131b2e] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className='p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors'
            aria-label='Toggle references menu'
          >
            <IoMenu className='text-lg' />
          </button>
          <div className='flex flex-col truncate'>
            <span className='text-[10px] uppercase font-mono text-(--secondColor) font-bold'>
              {categoryName}
            </span>
            <span className='text-xs font-semibold text-white truncate max-w-[200px]'>
              {activeReference ? activeReference.title : 'No reference selected'}
            </span>
          </div>
        </div>

        <Link
          href='/references'
          className='flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white px-2 py-1.5 rounded-lg bg-white/5'
        >
          <IoArrowBack className='text-xs' />
          <span>All</span>
        </Link>
      </div>

      {/* Main Layout Area */}
      <div className='flex-1 flex w-full relative'>
        <ReferenceSidebar
          categoryName={categoryName}
          categoryStack={categoryStack}
          references={references}
          filteredReferences={filteredReferences}
          selectedRefId={selectedRefId}
          onSelectRef={handleSelectReference}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className='flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-8 sm:py-10 w-full'>
          {activeReference ? (
            <ReferenceViewer
              activeReference={activeReference}
              categoryName={categoryName}
              categoryStack={categoryStack}
              activeContentTab={activeContentTab}
              setActiveContentTab={setActiveContentTab}
              prevRef={prevRef}
              nextRef={nextRef}
              onNavigateRef={handleNavigateReference}
            />
          ) : (
            <div className='py-20 text-center flex flex-col items-center gap-5 max-w-lg mx-auto'>
              <div className='w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 text-3xl'>
                <IoFolderOpenOutline />
              </div>
              <h2 className='text-2xl font-bold text-white'>
                No References in this Category Yet
              </h2>
              <p className='text-sm text-gray-400'>
                This category doesn&apos;t have any published references or cheat sheets yet. You can create references in the dashboard or explore other categories.
              </p>
              <Link
                href='/references'
                className='inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-(--secondColor) hover:opacity-90 text-white font-bold text-sm transition-all shadow-lg shadow-(--secondColor)/25'
              >
                <IoArrowBack className='text-base' />
                <span>Explore Other Categories</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
