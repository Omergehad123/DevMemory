'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  IoSearch, 
  IoLayersOutline, 
  IoReloadOutline,
  IoFolderOutline,
  IoCodeSlashOutline 
} from 'react-icons/io5'
import { HiArrowRight, HiOutlineBookOpen } from 'react-icons/hi2'
import { fetchCategories } from '@/lib/api/categories.api'
import SoonPlaceholder from '@/app/components/ui/SoonPlaceholder'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function ReferencesPage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStack, setSelectedStack] = useState('All')

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const data = await fetchCategories({ limit: 100 })
        if (isMounted) {
          setCategories(data?.categories || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load categories:', err)
          setError(err.message || 'Failed to load categories. Please ensure the backend is running.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  const handleRetry = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCategories({ limit: 100 })
      setCategories(data?.categories || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
      setError(err.message || 'Failed to load categories. Please ensure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  // Extract unique stacks for filter pills
  const availableStacks = useMemo(() => {
    const stacks = new Set(['All'])
    categories.forEach((cat) => {
      if (cat.stack && cat.stack.trim()) {
        stacks.add(cat.stack.trim())
      }
    })
    return Array.from(stacks)
  }, [categories])

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.stack?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStack = selectedStack === 'All' || cat.stack === selectedStack

      return matchesSearch && matchesStack
    })
  }, [categories, searchQuery, selectedStack])

  return (
    <main className='w-full min-h-[calc(100vh-80px)] bg-(--bgColor) text-gray-100 py-12 sm:py-16 px-4 sm:px-8 md:px-12 flex flex-col items-center'>
      <div className='max-w-7xl w-full mx-auto flex flex-col gap-10'>
        {/* Header Title Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10'>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-2xl'
          >
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--secondColor)/15 border border-(--secondColor)/30 text-(--secondColor) text-xs font-mono uppercase tracking-wider mb-4'>
              <IoLayersOutline className='text-sm' />
              <span>Reference Library</span>
            </div>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight'>
              Explore Categories
            </h1>
            <p className='text-gray-400 text-sm sm:text-base md:text-lg mt-3 leading-relaxed'>
              Select a category box to dive into its curated developer references, syntax rules, and quick cheat sheets.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='relative w-full md:w-80'
          >
            <IoSearch className='text-gray-400 text-lg absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search categories or stack...'
              className='w-full pl-11 pr-4 py-3 bg-[#131b2e] text-white text-sm rounded-2xl border border-white/10 focus:outline-none focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/20 transition-all placeholder-gray-500 shadow-inner'
            />
          </motion.div>
        </div>

        {/* Stack Filter Pills */}
        {availableStacks.length > 2 && (
          <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none'>
            {availableStacks.map((stack) => {
              const isSelected = selectedStack === stack
              return (
                <button
                  key={stack}
                  onClick={() => setSelectedStack(stack)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-(--secondColor) text-white shadow-lg shadow-(--secondColor)/30 scale-105'
                      : 'bg-[#131b2e] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {stack}
                </button>
              )
            })}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className='h-64 rounded-3xl bg-[#131b2e]/60 border border-white/5 p-6 flex flex-col justify-between animate-pulse'
              >
                <div className='flex items-center justify-between'>
                  <div className='w-12 h-12 rounded-2xl bg-white/10' />
                  <div className='w-20 h-6 rounded-full bg-white/10' />
                </div>
                <div className='space-y-3 my-4'>
                  <div className='w-3/4 h-6 rounded-lg bg-white/10' />
                  <div className='w-full h-4 rounded-lg bg-white/5' />
                  <div className='w-2/3 h-4 rounded-lg bg-white/5' />
                </div>
                <div className='w-1/3 h-4 rounded-lg bg-white/10' />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className='p-8 sm:p-12 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center max-w-xl mx-auto flex flex-col items-center gap-4'>
            <div className='w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-bold'>
              !
            </div>
            <h3 className='text-xl font-bold text-white'>Failed to load categories</h3>
            <p className='text-sm text-gray-400 max-w-md'>{error}</p>
            <button
              onClick={handleRetry}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 transition-all cursor-pointer shadow-md'
            >
              <IoReloadOutline className='text-base' />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && filteredCategories.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
          >
            {filteredCategories.map((category) => {
              const catId = category._id || category.id
              const refCount = Array.isArray(category.references)
                ? category.references.length
                : 0

              return (
                <motion.div key={catId} variants={cardVariants}>
                  <Link
                    href={`/references/${catId}`}
                    className='group relative flex flex-col justify-between h-full min-h-[260px] p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#131b2e] to-[#0d1322] border border-white/10 hover:border-(--secondColor)/60 hover:shadow-2xl hover:shadow-(--secondColor)/15 hover:-translate-y-1.5 transition-all duration-300'
                  >
                    {/* Top Row: Icon/Image & Stack Badge */}
                    <div className='flex items-start justify-between gap-4 mb-4'>
                      <div className='w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 shadow-md group-hover:scale-110 group-hover:border-(--secondColor)/40 transition-transform duration-300 overflow-hidden shrink-0'>
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className='w-full h-full object-contain'
                          />
                        ) : (
                          <IoCodeSlashOutline className='w-7 h-7 text-(--secondColor)' />
                        )}
                      </div>

                      {category.stack && (
                        <span className='px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/5 text-gray-300 border border-white/10 group-hover:border-(--secondColor)/30 group-hover:text-(--secondColor) transition-colors'>
                          {category.stack}
                        </span>
                      )}
                    </div>

                    {/* Middle: Name & Description */}
                    <div className='flex-1 flex flex-col mb-5'>
                      <h2 className='text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-(--secondColor) transition-colors'>
                        {category.name}
                      </h2>
                      <p className='text-gray-400 text-xs sm:text-sm line-clamp-3 mt-2 leading-relaxed font-normal'>
                        {category.description || 'Comprehensive references and documentation notes for this category.'}
                      </p>
                    </div>

                    {/* Bottom: Reference Count & Action Arrow */}
                    <div className='flex items-center justify-between pt-4 border-t border-white/5 text-xs'>
                      <div className='flex items-center gap-1.5 text-gray-400 font-medium'>
                        <HiOutlineBookOpen className='w-4 h-4 text-(--hoverColor)' />
                        <span>
                          {refCount} {refCount === 1 ? 'reference' : 'references'}
                        </span>
                      </div>

                      <div className='flex items-center gap-1 font-semibold text-(--secondColor) group-hover:text-white transition-colors'>
                        <span>Open Category</span>
                        <HiArrowRight className='w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200' />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Empty State — search returned nothing */}
        {!isLoading && !error && filteredCategories.length === 0 && searchQuery && (
          <div className='text-center py-20 bg-[#131b2e]/40 rounded-3xl border border-white/5 max-w-lg mx-auto p-8 flex flex-col items-center gap-4'>
            <div className='w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 text-3xl'>
              <IoFolderOutline />
            </div>
            <h3 className='text-xl font-bold text-white'>No Categories Found</h3>
            <p className='text-sm text-gray-400'>
              No categories matched your search for &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className='px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors'
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Empty State — no data at all → animated SoonPlaceholder */}
        {!isLoading && !error && categories.length === 0 && !searchQuery && (
          <SoonPlaceholder message='References are being prepared. Check back soon!' />
        )}
      </div>
    </main>
  )
}
