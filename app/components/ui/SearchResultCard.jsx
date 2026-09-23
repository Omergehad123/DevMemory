'use client'

import React from 'react'
import Link from 'next/link'
import {
  IoFolderOpenOutline,
  IoDocumentTextOutline,
  IoLayersOutline
} from 'react-icons/io5'
import { HiArrowRight } from 'react-icons/hi2'
import HighlightMatch from './HighlightMatch'

export default function SearchResultCard({
  type = 'category',
  item,
  query = '',
  onClick,
  compact = false,
}) {
  if (!item) return null

  const isCategory = type === 'category'
  const itemId = item._id || item.id

  let href = '#'
  let catName = null

  if (isCategory) {
    href = `/references/${itemId}`
  } else {
    const catId = item.categoryId?._id || item.categoryId?.id || item.categoryId
    catName = item.categoryId?.name
    href = `/references/${catId}?ref=${itemId}`
  }

  const title = isCategory ? item.name : item.title
  const description = item.description

  const baseHoverStyles = isCategory
    ? 'hover:bg-indigo-500/[0.08] hover:border-indigo-500/35 hover:shadow-indigo-500/10'
    : 'hover:bg-blue-500/[0.08] hover:border-blue-500/35 hover:shadow-blue-500/10'

  const titleHoverColor = isCategory
    ? 'group-hover:text-indigo-300'
    : 'group-hover:text-blue-300'

  const arrowHoverColor = isCategory
    ? 'group-hover:text-indigo-400'
    : 'group-hover:text-blue-400'

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group block rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-200 shadow-lg ${baseHoverStyles} ${
        compact ? 'p-3.5' : 'p-5 h-full'
      }`}
    >
      <div className='flex items-start justify-between gap-3 mb-2.5'>
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Type Badge */}
          {isCategory ? (
            <span className='inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/25 text-indigo-300 border border-indigo-500/30'>
              <IoFolderOpenOutline className='text-xs' />
              Category
            </span>
          ) : (
            <span className='inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-500/25 text-blue-300 border border-blue-500/30'>
              <IoDocumentTextOutline className='text-xs' />
              Reference
            </span>
          )}

          {/* Category Stack or Parent Category Name */}
          {isCategory && item.stack && (
            <span className='text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300'>
              {item.stack}
            </span>
          )}

          {!isCategory && catName && (
            <span className='inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300'>
              <IoLayersOutline className='text-xs text-blue-400' />
              {catName}
            </span>
          )}
        </div>

        <HiArrowRight
          className={`text-gray-500 ${arrowHoverColor} group-hover:translate-x-1 transition-all shrink-0 mt-0.5`}
        />
      </div>

      <h3
        className={`font-bold text-white transition-colors mb-1.5 truncate ${
          compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
        } ${titleHoverColor}`}
      >
        <HighlightMatch text={title} query={query} />
      </h3>

      {description && (
        <p
          className={`text-gray-400 font-normal leading-relaxed ${
            compact ? 'text-xs line-clamp-1' : 'text-xs sm:text-sm line-clamp-2'
          }`}
        >
          <HighlightMatch text={description} query={query} />
        </p>
      )}
    </Link>
  )
}
