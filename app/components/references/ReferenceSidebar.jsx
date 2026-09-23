'use client'

import React from 'react'
import Link from 'next/link'
import {
  IoSearch,
  IoChevronBack,
  IoClose,
  IoArrowBack
} from 'react-icons/io5'
import {
  LuPanelLeftClose,
  LuPanelLeftOpen
} from 'react-icons/lu'

export default function ReferenceSidebar({
  categoryName,
  categoryStack,
  references = [],
  filteredReferences = [],
  selectedRefId,
  onSelectRef,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className='fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fade-in'
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 md:top-0 h-full md:h-[calc(100vh-80px)] z-40 md:z-20
          bg-[#0d1322] border-r border-white/10 flex flex-col
          transition-all duration-300 ease-in-out shrink-0 select-none
          ${mobileSidebarOpen ? 'left-0 w-72' : '-left-72 md:left-0'}
          ${sidebarCollapsed ? 'md:w-16' : 'md:w-72 lg:w-80'}
        `}
      >
        {/* Sidebar Top Header */}
        <div className='p-4 border-b border-white/10 flex items-center justify-between gap-2 min-h-[64px]'>
          {!sidebarCollapsed ? (
            <div className='flex items-center gap-2.5 truncate flex-1'>
              <Link
                href='/references'
                className='p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0'
                title='Back to Categories'
              >
                <IoChevronBack className='text-sm' />
              </Link>
              <div className='flex flex-col truncate'>
                <div className='flex items-center gap-1.5'>
                  <h2 className='text-sm font-bold text-white tracking-tight truncate'>
                    {categoryName}
                  </h2>
                  <span className='text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-(--secondColor)/20 text-(--secondColor) border border-(--secondColor)/30'>
                    {categoryStack}
                  </span>
                </div>
                <span className='text-[11px] text-gray-400 font-mono'>
                  {references.length} {references.length === 1 ? 'topic' : 'topics'}
                </span>
              </div>
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              <Link
                href='/references'
                className='p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors'
                title='Back to Categories'
              >
                <IoChevronBack className='text-base' />
              </Link>
            </div>
          )}

          {/* Sidebar Collapse Toggle Button (Desktop) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className='hidden md:flex p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0'
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <LuPanelLeftOpen className='w-4 h-4 text-(--secondColor)' />
            ) : (
              <LuPanelLeftClose className='w-4 h-4' />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className='md:hidden p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors'
          >
            <IoClose className='text-lg' />
          </button>
        </div>

        {/* Search within Category References */}
        {!sidebarCollapsed && (
          <div className='px-3 pt-3 pb-1'>
            <div className='relative'>
              <IoSearch className='text-gray-400 text-xs absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search topics...'
                className='w-full pl-8 pr-3 py-1.5 bg-[#141c2e] text-xs text-white rounded-xl border border-white/5 focus:outline-none focus:border-(--secondColor) focus:ring-1 focus:ring-(--secondColor)/30 placeholder-gray-500'
              />
            </div>
          </div>
        )}

        {/* Reference Items List */}
        <div className='flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin'>
          {!sidebarCollapsed && (
            <div className='px-2.5 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-mono'>
              References
            </div>
          )}

          {filteredReferences.length > 0 ? (
            filteredReferences.map((ref, idx) => {
              const refId = ref._id || ref.id
              const isActive = selectedRefId === refId

              return (
                <button
                  key={refId}
                  onClick={() => onSelectRef(refId)}
                  title={sidebarCollapsed ? ref.title : undefined}
                  className={`
                    w-full text-left rounded-xl transition-all duration-200 cursor-pointer group flex items-center
                    ${sidebarCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'}
                    ${
                      isActive
                        ? 'bg-(--mainColor) text-slate-950 font-bold shadow-md shadow-white/10'
                        : 'text-gray-300 hover:bg-(--mainColor) hover:text-slate-950 font-medium'
                    }
                  `}
                >
                  {sidebarCollapsed ? (
                    <span
                      className={`
                        w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors
                        ${
                          isActive
                            ? 'bg-slate-950 text-white'
                            : 'bg-white/5 text-gray-300 group-hover:bg-slate-950 group-hover:text-white'
                        }
                      `}
                    >
                      {idx + 1}
                    </span>
                  ) : (
                    <div className='flex items-center gap-2.5 w-full overflow-hidden'>
                      <span
                        className={`
                          text-[11px] font-mono px-1.5 py-0.5 rounded transition-colors shrink-0
                          ${
                            isActive
                              ? 'bg-slate-900 text-white'
                              : 'bg-white/5 text-gray-400 group-hover:bg-slate-900 group-hover:text-white'
                          }
                        `}
                      >
                        {idx + 1}
                      </span>
                      <span className='text-xs sm:text-sm truncate leading-snug'>
                        {ref.title}
                      </span>
                    </div>
                  )}
                </button>
              )
            })
          ) : (
            <div className='p-4 text-center text-xs text-gray-400 italic'>
              {!sidebarCollapsed && (searchQuery ? 'No matching references' : 'No references in this category')}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className='p-3 border-t border-white/10 bg-[#0b0f19]/60'>
            <Link
              href='/references'
              className='flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-colors w-full border border-white/5'
            >
              <IoArrowBack className='text-xs' />
              <span>All Categories</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
