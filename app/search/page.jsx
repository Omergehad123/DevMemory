'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  IoSearch,
  IoClose,
  IoSparklesOutline
} from 'react-icons/io5'
import { searchAll } from '@/lib/api/search.api'
import SearchResultCard from '@/app/components/ui/SearchResultCard'

function SearchContent({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'categories' | 'references'
  const [results, setResults] = useState({ categories: [], references: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Debounced search query - triggers async fetching without synchronous setState
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    let isMounted = true
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        const data = await searchAll(trimmed, { limit: 50 })
        if (isMounted) {
          setResults(data)
          setHasSearched(true)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Search page error:', err)
          setResults({ categories: [], references: [] })
          setHasSearched(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }, 280)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [query])

  const handleQueryChange = (val) => {
    setQuery(val)
    if (!val.trim()) {
      setResults({ categories: [], references: [] })
      setHasSearched(false)
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults({ categories: [], references: [] })
    setHasSearched(false)
    setIsLoading(false)
  }

  const totalCategories = results.categories.length
  const totalReferences = results.references.length
  const totalResults = totalCategories + totalReferences
  const isTyping = query.trim().length > 0
  const quickPicks = ['JavaScript', 'FrontEnd', 'Array', 'CSS', 'Backend']

  return (
    <div className='w-full min-h-[calc(100vh-140px)] bg-(--bgColor) text-white flex flex-col items-center py-10 px-4 sm:px-8 relative overflow-hidden'>
      {/* Background ambient lighting */}
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-(--hoverColor)/5 blur-[140px] rounded-full pointer-events-none' />

      <div className='w-full max-w-5xl mx-auto flex flex-col items-center flex-1 z-10'>
        {/* Search Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='w-full max-w-2xl relative flex items-center mb-6'
        >
          <IoSearch className='text-gray-400 text-xl sm:text-2xl absolute left-5 pointer-events-none' />
          <input
            type='text'
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder='Search categories, references, syntax, stack...'
            className='w-full pl-14 pr-12 py-4 bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] text-white placeholder-gray-500 text-base sm:text-lg rounded-2xl border border-white/10 focus:border-(--hoverColor) focus:outline-none focus:ring-4 focus:ring-(--hoverColor)/20 transition-all duration-200 shadow-2xl backdrop-blur-md'
          />
          {query && (
            <button
              onClick={handleClear}
              className='absolute right-4 text-gray-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors'
              aria-label='Clear search'
            >
              <IoClose className='text-xl' />
            </button>
          )}
        </motion.div>

        {/* Motivational center when not typing */}
        {!isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35 }}
            className='flex flex-col items-center justify-center text-center max-w-2xl px-4 my-auto py-16'
          >
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight'>
              You don&apos;t need to remember everything.{' '}
              <span className='text-(--hoverColor)'>You just need to find it fast.</span>
            </h1>

            <p className='text-gray-400 text-sm sm:text-base mt-4 font-normal max-w-md'>
              Search across all saved categories, code documentation, and references instantly.
            </p>

            {/* Quick Suggestion Chips */}
            <div className='flex items-center flex-wrap justify-center gap-2 mt-8'>
              <span className='text-xs font-mono text-gray-500 flex items-center gap-1 mr-1'>
                <IoSparklesOutline className='text-(--hoverColor)' />
                Suggestions:
              </span>
              {quickPicks.map((pick) => (
                <button
                  key={pick}
                  onClick={() => handleQueryChange(pick)}
                  className='text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer'
                >
                  {pick}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Area */}
        {isTyping && (
          <div className='w-full flex flex-col gap-6 mt-2'>
            {/* Tabs & Meta Bar */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10'>
              {/* Filter Tabs */}
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white/15 text-white shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>All</span>
                  <span className='px-1.5 py-0.2 rounded-full bg-white/10 text-[11px] font-mono'>
                    {totalResults}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow'
                      : 'text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10'
                  }`}
                >
                  <span>Categories</span>
                  <span className='px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-[11px] font-mono text-indigo-300'>
                    {totalCategories}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('references')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'references'
                      ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40 shadow'
                      : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/10'
                  }`}
                >
                  <span>References</span>
                  <span className='px-1.5 py-0.2 rounded-full bg-blue-500/20 text-[11px] font-mono text-blue-300'>
                    {totalReferences}
                  </span>
                </button>
              </div>

              {/* Status info */}
              <div className='text-xs font-mono text-gray-400'>
                {isLoading ? (
                  <span>Searching...</span>
                ) : (
                  <span>
                    Showing results for <span className='text-white font-bold'>&ldquo;{query}&rdquo;</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-6'>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className='h-36 rounded-2xl bg-white/5 border border-white/5 animate-pulse'
                  />
                ))}
              </div>
            ) : hasSearched && totalResults === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className='py-16 text-center flex flex-col items-center justify-center text-gray-400 max-w-md mx-auto'
              >
                <div className='p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 mb-4'>
                  <IoSearch className='text-4xl' />
                </div>
                <h3 className='text-xl font-bold text-white mb-2'>
                  No results found for &ldquo;{query}&rdquo;
                </h3>
                <p className='text-sm text-gray-400 leading-relaxed'>
                  We couldn&apos;t find any categories or references matching your search. Try adjusting your query or keywords.
                </p>
              </motion.div>
            ) : (
              <div className='space-y-8 pb-12'>
                {/* Categories Section */}
                {(activeTab === 'all' || activeTab === 'categories') && totalCategories > 0 && (
                  <section>
                    <div className='flex items-center gap-2 mb-4'>
                      <span className='text-xs font-mono uppercase tracking-wider font-bold text-indigo-400'>
                        Categories
                      </span>
                      <span className='text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold'>
                        {totalCategories}
                      </span>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {results.categories.map((cat, idx) => (
                        <motion.div
                          key={cat._id || cat.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: idx * 0.03 }}
                        >
                          <SearchResultCard
                            type='category'
                            item={cat}
                            query={query}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* References Section */}
                {(activeTab === 'all' || activeTab === 'references') && totalReferences > 0 && (
                  <section>
                    <div className='flex items-center gap-2 mb-4'>
                      <span className='text-xs font-mono uppercase tracking-wider font-bold text-blue-400'>
                        References
                      </span>
                      <span className='text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold'>
                        {totalReferences}
                      </span>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {results.references.map((ref, idx) => (
                        <motion.div
                          key={ref._id || ref.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: idx * 0.03 }}
                        >
                          <SearchResultCard
                            type='reference'
                            item={ref}
                            query={query}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SearchPageWrapper() {
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('q') || ''

  return <SearchContent key={urlQuery} initialQuery={urlQuery} />
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-(--bgColor)' />}>
      <SearchPageWrapper />
    </Suspense>
  )
}
