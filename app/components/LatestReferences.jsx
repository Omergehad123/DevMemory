'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    SiReact,
    SiJavascript,
    SiNodedotjs,
    SiNextdotjs,
} from 'react-icons/si'
import { HiArrowRight } from 'react-icons/hi2'

// Empty array as requested
const references = []

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

const soonLetterVariants = {
    animate: (i) => ({
        opacity: [0.3, 1, 0.3],
        y: [0, -6, 0],
        transition: {
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.14,
            ease: 'easeInOut',
        },
    }),
}

export default function LatestReferences() {
    const hasReferences = references.length > 0
    const featuredRef = hasReferences ? references[0] : null
    const otherRefs = hasReferences ? references.slice(1) : []
    const FeaturedIcon = featuredRef?.icon

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

                {/* Conditional Content */}
                {hasReferences ? (
                    /* Cards Grid */
                    <motion.div
                        variants={containerVariants}
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true, margin: '-60px' }}
                        className='flex flex-col gap-6'
                    >
                        {/* 1. LARGE FEATURED CARD */}
                        <motion.div
                            variants={cardVariants}
                            className='group relative rounded-3xl bg-(--bgColor) text-white border border-white/10 hover:border-(--secondColor)/50 p-7 sm:p-10 transition-all duration-300 shadow-2xl shadow-black/20 overflow-hidden'
                        >
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-8'>
                                <div className='flex flex-col flex-1'>
                                    {/* Top Meta Row: Category & Topics */}
                                    <div className='flex items-center gap-3 mb-6'>
                                        <span className='px-3 py-1 rounded-full bg-(--hoverColor)/15 border border-(--hoverColor)/30 text-(--hoverColor) font-mono text-xs font-semibold uppercase tracking-wider'>
                                            {featuredRef.category}
                                        </span>
                                        <span className='text-xs font-mono text-gray-400 font-semibold'>
                                            {featuredRef.topicsCount}
                                        </span>
                                    </div>

                                    {/* Icon + Title */}
                                    <div className='flex items-center gap-5 mb-4'>
                                        <div
                                            className='w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-black/50 border border-(--secondColor)/40 flex items-center justify-center shadow-[0_0_24px_var(--secondColor)] group-hover:scale-105 transition-all duration-300 p-3'
                                        >
                                            <FeaturedIcon className={`w-9 h-9 sm:w-10 sm:h-10 ${featuredRef.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-(--hoverColor) transition-colors duration-200'>
                                                {featuredRef.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className='text-gray-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl'>
                                        {featuredRef.description}
                                    </p>
                                </div>

                                {/* Explore Action Arrow */}
                                <div className='flex md:self-end'>
                                    <Link
                                        href={featuredRef.href}
                                        className='inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-(--secondColor) hover:bg-(--hoverColor) text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-(--secondColor)/30'
                                    >
                                        <span>Explore</span>
                                        <HiArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1' />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. SMALLER CARDS */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {otherRefs.map((card) => {
                                const Icon = card.icon
                                return (
                                    <motion.div
                                        key={card.id}
                                        variants={cardVariants}
                                        className='group relative rounded-2xl bg-(--bgColor) text-white border border-white/10 hover:border-(--secondColor)/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/20'
                                    >
                                        <div>
                                            {/* Card Top: Icon & Topics Count */}
                                            <div className='flex items-center justify-between mb-5'>
                                                <div
                                                    className='w-13 h-13 rounded-xl bg-black/50 border border-(--secondColor)/40 flex items-center justify-center shadow-[0_0_22px_var(--secondColor)] group-hover:scale-105 transition-all duration-300 p-3'
                                                >
                                                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                                                </div>

                                                <span className='text-xs font-mono font-bold text-(--secondColor)'>
                                                    {card.topicsCount}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className='text-2xl font-bold text-white tracking-tight mb-1 group-hover:text-(--hoverColor) transition-colors duration-200'>
                                                {card.name}
                                            </h3>

                                            {/* Category Pill */}
                                            <div className='mb-3.5'>
                                                <span className='inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-(--hoverColor)/15 text-(--hoverColor) border border-(--hoverColor)/30 uppercase tracking-wider'>
                                                    {card.category}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className='text-gray-400 text-sm leading-relaxed mb-6 font-normal'>
                                                {card.description}
                                            </p>
                                        </div>

                                        {/* Bottom: Arrow Navigation */}
                                        <div className='pt-4 border-t border-white/5 flex items-center justify-end'>
                                            <Link
                                                href={card.href}
                                                className='inline-flex items-center gap-1.5 text-gray-300 group-hover:text-(--secondColor) font-mono text-xs sm:text-sm font-semibold transition-colors duration-200'
                                            >
                                                <span>Explore</span>
                                                <HiArrowRight className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                ) : (
                    /* Animated "soon...." State (Large, Bold, Clean) */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className='w-full rounded-3xl text-white py-20 sm:py-28 md:py-36 px-6 flex items-center justify-center text-center relative overflow-hidden'
                    >
                        {/* Ambient background glow */}
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full pointer-events-none' />

                        {/* Very Large, Bold Animated "soon...." text */}
                        <div className='flex items-center justify-center font-mono text-6xl sm:text-8xl md:text-9xl lg:text-[8rem] font-black tracking-wider text-(--secondColor) select-none relative z-10'>
                            {['s', 'o', 'o', 'n', '.', '.', '.', '.'].map((char, index) => (
                                <motion.span
                                    key={index}
                                    custom={index}
                                    variants={soonLetterVariants}
                                    animate='animate'
                                    className={`inline-block text-(--hoverColor)`}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Bottom Link (only shown when references exist) */}
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
            </div>
        </section>
    )
}
