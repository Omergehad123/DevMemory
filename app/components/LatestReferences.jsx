'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'
import { IoCodeSlashOutline, IoCalendarOutline } from 'react-icons/io5'
import { fetchReferences } from '@/lib/api/references.api'
import { formatDate } from '@/lib/utils/format'
import SoonPlaceholder from './ui/SoonPlaceholder'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function LatestReferences() {
  const [references, setReferences] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadLatest() {
      try {
        const data = await fetchReferences({ limit: 3, sortBy: 'updated-desc' })
        if (isMounted) {
          setReferences(data?.references || [])
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load latest references:', err)
          setReferences([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadLatest()
    return () => {
      isMounted = false
    }
  }, [])

  const hasReferences = references.length > 0

  return (
    <section className='w-full bg-[#eee] text-gray-900 py-14 sm:py-16 px-4 sm:px-8 relative overflow-hidden'>
      <div className='max-w-6xl mx-auto flex flex-col'>
        {/* Section Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6'>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className='max-w-2xl'
          >
            {/* Heading */}
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight'>
              Latest References
            </h2>

            {/* Subtitle */}
            <p className='text-gray-600 text-base sm:text-lg font-medium mt-3 leading-relaxed'>
              Fresh concepts, languages, and tools added to your developer memory.
            </p>
          </motion.div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-52 rounded-3xl bg-gray-200 border border-gray-300/60 animate-pulse'
              />
            ))}
          </div>
        )}

        {/* Conditional Content */}
        {!isLoading && (
          <>
            {hasReferences ? (
              /* Cards Grid — last 3 references */
              <motion.div
                variants={containerVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, margin: '-60px' }}
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              >
                {references.map((ref) => {
                  const refId = ref._id || ref.id
                  const rawCat = ref.categoryId
                  const catSlug =
                    typeof rawCat === 'object' && rawCat !== null
                      ? rawCat.slug || rawCat._id || rawCat.id || 'general'
                      : rawCat || 'general'
                  const refSlug = ref.slug || refId
                  const catName =
                    typeof rawCat === 'object' && rawCat !== null
                      ? rawCat.name || 'Reference'
                      : 'Reference'
                  const catStack =
                    typeof rawCat === 'object' && rawCat !== null
                      ? rawCat.stack || ''
                      : ''
                  const catImage =
                    typeof rawCat === 'object' && rawCat !== null
                      ? rawCat.image || null
                      : null

                  const targetUrl = `/references/${catSlug}/${refSlug}`

                  return (
                    <motion.div
                      key={refId}
                      variants={cardVariants}
                      className='group relative rounded-2xl bg-(--bgColor) text-white border border-white/10 hover:border-(--secondColor)/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-1'
                    >
                      {/* Top: Category Icon + Stack */}
                      <div className='flex items-center justify-between mb-5'>
                        <div className='w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:border-(--secondColor)/40 transition-all duration-300 overflow-hidden shrink-0'>
                          {catImage ? (
                            <img
                              src={catImage}
                              alt={catName}
                              className='w-full h-full object-contain'
                            />
                          ) : (
                            <IoCodeSlashOutline className='w-5 h-5 text-(--secondColor)' />
                          )}
                        </div>
                        {catStack && (
                          <span className='px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-white/5 text-gray-300 border border-white/10 group-hover:border-(--secondColor)/30 group-hover:text-(--secondColor) transition-colors'>
                            {catStack}
                          </span>
                        )}
                      </div>

                      {/* Category name pill */}
                      <div className='mb-2'>
                        <Link
                          href={`/references/${catSlug}`}
                          className='inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-(--hoverColor)/15 text-(--hoverColor) hover:bg-(--hoverColor)/25 border border-(--hoverColor)/30 uppercase tracking-wider transition-colors'
                        >
                          {catName}
                        </Link>
                      </div>

                      {/* Title */}
                      <h3 className='text-lg sm:text-xl font-bold text-white tracking-tight mb-2 group-hover:text-(--hoverColor) transition-colors duration-200 line-clamp-2 flex-1'>
                        <Link href={targetUrl} className='hover:underline'>
                          {ref.title}
                        </Link>
                      </h3>

                      {/* Description */}
                      {ref.description && (
                        <p className='text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 font-normal line-clamp-2'>
                          {ref.description}
                        </p>
                      )}

                      {/* Bottom: Date & Link */}
                      <div className='pt-4 border-t border-white/5 flex items-center justify-between'>
                        {ref.updatedAt && (
                          <div className='flex items-center gap-1.5 text-gray-500 text-[11px] font-mono'>
                            <IoCalendarOutline className='text-xs text-(--hoverColor)' />
                            <span>{formatDate(ref.updatedAt)}</span>
                          </div>
                        )}
                        <Link
                          href={targetUrl}
                          className='inline-flex items-center gap-1.5 text-gray-300 group-hover:text-(--secondColor) font-mono text-xs font-semibold transition-colors duration-200 ml-auto'
                        >
                          <span>View Reference</span>
                          <HiArrowRight className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}

              </motion.div>
            ) : (
              /* Animated SoonPlaceholder State */
              <SoonPlaceholder />
            )}

            {/* Bottom Link — only when references exist */}
            {hasReferences && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='mt-14 sm:mt-18 flex items-center justify-center'
              >
                <Link
                  href='/references'
                  className='group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-(--bgColor) hover:bg-black text-white hover:text-(--secondColor) font-mono text-sm sm:text-base font-bold tracking-wide transition-all duration-300 shadow-xl shadow-black/15 border border-black/10 hover:border-(--secondColor)/50'
                >
                  <span>Explore all references</span>
                  <div className='w-6 h-6 rounded-full bg-white/10 group-hover:bg-(--secondColor)/20 flex items-center justify-center text-gray-300 group-hover:text-(--secondColor) transition-colors'>
                    <HiArrowRight className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
                  </div>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
