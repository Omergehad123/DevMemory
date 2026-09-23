'use client'

import React from 'react'
import Link from 'next/link'
import { IoSearch, IoClose } from 'react-icons/io5'
import { HiArrowRight } from 'react-icons/hi2'
import SearchResultCard from '../ui/SearchResultCard'

export default function HeaderSearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  results,
  isLoading,
  dropdownRef,
}) {
  const totalResults = results.categories.length + results.references.length
  const isSearchActive = isOpen && searchQuery.trim().length > 0

  if (!isSearchActive) return null

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className='fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-300 opacity-100 pointer-events-auto'
      />

      {/* Live Search Popup Container */}
      <div
        ref={dropdownRef}
        className='fixed top-[68px] sm:top-[78px] md:top-[84px] left-1/2 -translate-x-1/2 w-[94%] sm:w-[85%] md:w-[70%] max-w-4xl max-h-[82vh] z-40 bg-(--bgColor) text-white rounded-2xl shadow-2xl border border-white/10 p-5 sm:p-7 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden'
      >
        {/* Header Bar */}
        <div className='flex items-center justify-between border-b border-white/10 pb-3 shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-white/5 border border-white/10 text-(--hoverColor)'>
              <IoSearch className='text-xl' />
            </div>
            <div>
              <span className='text-[11px] font-mono uppercase tracking-widest text-gray-400 block'>
                Search Across Memory
              </span>
              <h3 className='text-base sm:text-lg font-bold text-white flex items-center gap-2'>
                <span>&ldquo;{searchQuery}&rdquo;</span>
                {!isLoading && (
                  <span className='text-xs font-mono font-normal text-gray-400'>
                    ({totalResults} {totalResults === 1 ? 'match' : 'matches'})
                  </span>
                )}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer'
            aria-label='Close search modal'
          >
            <IoClose className='text-xl' />
          </button>
        </div>

        {/* Scrollable Results Area */}
        <div className='flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar max-h-[50vh]'>
          {isLoading ? (
            /* Loading Skeletons */
            <div className='space-y-3 py-2'>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className='h-16 rounded-xl bg-white/5 animate-pulse border border-white/5'
                />
              ))}
            </div>
          ) : totalResults === 0 ? (
            /* No results */
            <div className='py-10 text-center flex flex-col items-center justify-center text-gray-400'>
              <div className='p-3 rounded-2xl bg-white/5 text-gray-500 mb-3'>
                <IoSearch className='text-3xl' />
              </div>
              <p className='text-white font-semibold text-base sm:text-lg'>
                No results found for &ldquo;{searchQuery}&rdquo;
              </p>
              <p className='text-xs sm:text-sm text-gray-400 mt-1 max-w-sm'>
                Try searching with keywords, category names, or syntax terms.
              </p>
            </div>
          ) : (
            <>
              {/* Categories Section */}
              {results.categories.length > 0 && (
                <div>
                  <div className='flex items-center gap-2 mb-2 px-1'>
                    <span className='text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-400'>
                      Categories
                    </span>
                    <span className='text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold'>
                      {results.categories.length}
                    </span>
                  </div>
                  <div className='space-y-2'>
                    {results.categories.map((cat) => (
                      <SearchResultCard
                        key={cat._id || cat.id}
                        type='category'
                        item={cat}
                        query={searchQuery}
                        onClick={onClose}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* References Section */}
              {results.references.length > 0 && (
                <div>
                  <div className='flex items-center gap-2 mb-2 px-1'>
                    <span className='text-[11px] font-mono uppercase tracking-wider font-bold text-blue-400'>
                      References
                    </span>
                    <span className='text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold'>
                      {results.references.length}
                    </span>
                  </div>
                  <div className='space-y-2'>
                    {results.references.map((ref) => (
                      <SearchResultCard
                        key={ref._id || ref.id}
                        type='reference'
                        item={ref}
                        query={searchQuery}
                        onClick={onClose}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 shrink-0'>
          <span className='text-xs font-mono text-gray-400 hidden sm:inline-block'>
            Press <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]'>Enter</kbd> to search everything
          </span>

          <Link
            href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
            onClick={onClose}
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-(--hoverColor) hover:opacity-90 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-(--hoverColor)/25 ml-auto'
          >
            <span>Open Search Page</span>
            <HiArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </>
  )
}
