'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoCalendarOutline,
  IoHelpCircleOutline,
  IoCodeSlashOutline,
  IoRocketOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5'
import {
  LuChevronLeft,
  LuChevronRight
} from 'react-icons/lu'
import DocumentRenderer, { hasValidContent } from './DocumentRenderer'
import { formatDate } from '@/lib/utils/format'

export default function ReferenceViewer({
  activeReference,
  categoryName,
  categoryStack,
  activeContentTab,
  setActiveContentTab,
  prevRef,
  nextRef,
  onNavigateRef,
}) {
  if (!activeReference) return null

  const activeDocContent =
    activeContentTab === 'why'
      ? activeReference.whyContent
      : activeContentTab === 'what'
      ? activeReference.whatContent || activeReference.content
      : activeReference.howContent

  const tabs = [
    {
      id: 'why',
      label: 'Why',
      icon: IoHelpCircleOutline,
      hasData: hasValidContent(activeReference.whyContent),
    },
    {
      id: 'what',
      label: 'What',
      icon: IoCodeSlashOutline,
      hasData: hasValidContent(activeReference.whatContent || activeReference.content),
    },
    {
      id: 'how',
      label: 'How',
      icon: IoRocketOutline,
      hasData: hasValidContent(activeReference.howContent),
    },
  ]

  const activeRefKey = activeReference._id || activeReference.id

  return (
    <div className='flex flex-col gap-8 w-full animate-in fade-in duration-300 text-left'>
      {/* Breadcrumb and Category Meta */}
      <div className='w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10'>
        <div className='flex items-center gap-2 text-xs font-mono text-gray-400'>
          <Link
            href='/references'
            className='hover:text-(--secondColor) transition-colors'
          >
            References
          </Link>
          <span>/</span>
          <span className='text-(--secondColor) font-semibold'>
            {categoryName}
          </span>
        </div>

        <div className='flex items-center gap-3 text-xs text-gray-400'>
          {activeReference.updatedAt && (
            <div className='flex items-center gap-1.5'>
              <IoCalendarOutline className='text-xs text-(--hoverColor)' />
              <span>Updated {formatDate(activeReference.updatedAt)}</span>
            </div>
          )}
          <span className='px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300'>
            {categoryStack}
          </span>
        </div>
      </div>

      {/* Reference Header Title & Description */}
      <div className='w-full flex flex-col gap-3'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight'>
          {activeReference.title}
        </h1>
        {activeReference.description && (
          <p className='text-gray-300 text-sm sm:text-base leading-relaxed'>
            {activeReference.description}
          </p>
        )}
      </div>

      {/* 3 Content Navigation Tabs: Why / What / How */}
      <div className='w-full flex items-center justify-between flex-wrap gap-4 pt-1'>
        <div className='flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0b0f19] border border-white/10 shadow-inner max-w-full overflow-x-auto'>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeContentTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveContentTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId='activeRefTabPill'
                    className='absolute inset-0 bg-gradient-to-r from-(--secondColor) to-(--hoverColor) rounded-xl shadow-lg shadow-(--secondColor)/30 -z-0'
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className='relative z-10 flex items-center gap-2'>
                  <Icon className='w-4 h-4' />
                  <span>{tab.label}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      tab.hasData
                        ? isActive
                          ? 'bg-white'
                          : 'bg-emerald-400'
                        : 'bg-gray-600'
                    }`}
                    title={tab.hasData ? `${tab.label} content available` : `${tab.label} content empty`}
                  />
                </span>
              </button>
            )
          })}
        </div>

        <div className='flex items-center gap-2 text-xs text-gray-400 font-mono'>
          <span className='px-3 py-1 rounded-full bg-white/5 border border-white/10'>
            Section: <strong className='text-(--secondColor) uppercase'>{activeContentTab}</strong>
          </span>
        </div>
      </div>

      {/* Document Content Container */}
      <div className='w-full max-w-7xl bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/40 min-h-[300px]'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={`${activeRefKey}-${activeContentTab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeDocContent && hasValidContent(activeDocContent) ? (
              <DocumentRenderer doc={activeDocContent} />
            ) : (
              <div className='text-center py-16 px-4 flex flex-col items-center justify-center gap-3'>
                <div className='w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400'>
                  <IoInformationCircleOutline className='text-2xl text-(--secondColor)' />
                </div>
                <h3 className='text-base sm:text-lg font-bold text-white'>
                  No &ldquo;{activeContentTab.toUpperCase()}&rdquo; content available yet
                </h3>
                <p className='text-xs sm:text-sm text-gray-400 max-w-md'>
                  This section is optional and hasn&apos;t been documented yet for &quot;{activeReference.title}&quot;. Switch between Why, What, and How above to view available sections.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation: Previous / Next Reference */}
      <div className='w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 mt-6'>
        {prevRef ? (
          <button
            onClick={() => onNavigateRef(prevRef._id || prevRef.id)}
            className='flex items-center gap-3 p-3.5 rounded-2xl bg-[#131b2e] hover:bg-white hover:text-slate-950 border border-white/10 text-gray-300 transition-all duration-200 cursor-pointer w-full sm:w-auto text-left group'
          >
            <LuChevronLeft className='w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform' />
            <div className='flex flex-col'>
              <span className='text-[10px] uppercase font-mono tracking-wider opacity-70'>
                Previous Topic
              </span>
              <span className='text-xs sm:text-sm font-bold truncate max-w-[200px]'>
                {prevRef.title}
              </span>
            </div>
          </button>
        ) : (
          <div className='hidden sm:block' />
        )}

        {nextRef && (
          <button
            onClick={() => onNavigateRef(nextRef._id || nextRef.id)}
            className='flex items-center justify-end gap-3 p-3.5 rounded-2xl bg-[#131b2e] hover:bg-white hover:text-slate-950 border border-white/10 text-gray-300 transition-all duration-200 cursor-pointer w-full sm:w-auto text-right group ml-auto'
          >
            <div className='flex flex-col items-end'>
              <span className='text-[10px] uppercase font-mono tracking-wider opacity-70'>
                Next Topic
              </span>
              <span className='text-xs sm:text-sm font-bold truncate max-w-[200px]'>
                {nextRef.title}
              </span>
            </div>
            <LuChevronRight className='w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform' />
          </button>
        )}
      </div>
    </div>
  )
}
