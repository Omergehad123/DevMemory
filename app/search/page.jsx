'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearch, IoClose } from 'react-icons/io5'

function SearchContent() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q') || ''
    const [query, setQuery] = useState(initialQuery)

    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery)
        }
    }, [initialQuery])

    const isTyping = query.trim().length > 0

    return (
        <div className='w-full min-h-[calc(100vh-140px)] bg-(--bgColor) text-white flex flex-col items-center py-12 px-4 sm:px-8 relative overflow-hidden'>
            {/* Background ambient lighting */}
            <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-(--hoverColor)/5 blur-[140px] rounded-full pointer-events-none' />

            <div className='w-full max-w-4xl mx-auto flex flex-col items-center flex-1 justify-between z-10'>
                {/* Top Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='w-full max-w-2xl relative flex items-center mb-8'
                >
                    <IoSearch className='text-gray-400 text-xl sm:text-2xl absolute left-5 pointer-events-none' />
                    <input
                        type='text'
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search concepts, syntax, languages, tools...'
                        className='w-full pl-14 pr-12 py-4 bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] text-white placeholder-gray-500 text-base sm:text-lg rounded-2xl border border-white/10 focus:border-(--hoverColor) focus:outline-none focus:ring-4 focus:ring-(--hoverColor)/20 transition-all duration-200 shadow-2xl backdrop-blur-md'
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className='absolute right-4 text-gray-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors'
                            aria-label='Clear search'
                        >
                            <IoClose className='text-xl' />
                        </button>
                    )}
                </motion.div>

                {/* Center Content Area */}
                <div className='w-full flex-1 flex flex-col items-center justify-center min-h-[350px]'>
                    <AnimatePresence mode='wait'>
                        {!isTyping && (
                            /* Center Statement: Vanishes within typing */
                            <motion.div
                                key='center-statement'
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.94, y: -15 }}
                                transition={{ duration: 0.35 }}
                                className='flex flex-col items-center justify-center text-center max-w-2xl px-4'
                            >
                                <h1 className='text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight'>
                                    You don&apos;t need to remember everything.{' '}
                                    <span className='text-(--hoverColor)'>You just need to find it fast.</span>
                                </h1>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className='min-h-screen bg-(--bgColor)' />}>
            <SearchContent />
        </Suspense>
    )
}
