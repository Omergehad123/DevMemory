'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HiOutlineLightBulb, HiOutlineSwitchVertical, HiOutlineSearch } from 'react-icons/hi'
import { IoSparkles } from 'react-icons/io5'

const cards = [
    {
        title: 'Learned',
        quote: '"I remember seeing this before."',
        description: 'You watched the video or read the docs, before but forget about it and have to search for it again from different sources.',
        icon: HiOutlineLightBulb,
        rotateClass: 'md:-rotate-3 md:translate-y-2',
    },
    {
        title: 'Forgotten',
        quote: '"How did that work again?"',
        description: 'Weeks later, when you actually need to write the code, the syntax and logic completely vanish.',
        icon: HiOutlineSwitchVertical,
        rotateClass: 'md:rotate-0 md:-translate-y-2 z-10',
    },
    {
        title: 'Searching',
        quote: '"Let me Google it again."',
        description: 'You get stuck in a loop of 10 open tabs, outdated StackOverflow answers, and lost momentum.',
        icon: HiOutlineSearch,
        rotateClass: 'md:rotate-3 md:translate-y-2',
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.35,
            delayChildren: 0.2,
        },
    },
}

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

function Problem() {
    return (
        <section className='w-full bg-[#eee] py-14 px-4 sm:px-8 overflow-hidden'>
            <div className='max-w-6xl mx-auto flex flex-col items-center'>
                {/* Header Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className='text-center max-w-2xl mx-auto mb-16'
                >
                    <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight'>
                        You learned it before.{' '}
                        <span className='text-(--secondColor)'>So why did you forget it?</span>
                    </h2>
                    <p className='text-gray-600 text-base sm:text-lg font-medium mt-3'>
                        The recurring frustration that kills developer productivity.
                    </p>
                </motion.div>

                {/* Cards Container (One-by-one animation + Fanned-out image deck styling) */}
                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-60px' }}
                    className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl items-stretch justify-center'
                >
                    {cards.map((card) => {
                        const Icon = card.icon
                        return (
                            <motion.div
                                key={card.title}
                                variants={cardVariants}
                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                className={`bg-(--bgColor) rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl shadow-black/25 border border-white/5 transform-gpu [backface-visibility:hidden] [transform-style:preserve-3d] ${card.rotateClass}`}
                            >
                                {/* Top Vibrant Icon */}
                                <div className='mb-6 text-(--hoverColor) text-4xl sm:text-5xl p-3 bg-white/5 rounded-2xl'>
                                    <Icon />
                                </div>

                                {/* Main Title */}
                                <h3 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3'>
                                    {card.title}
                                </h3>

                                {/* Subtitle Quote */}
                                <p className='text-(--hoverColor) font-bold text-base sm:text-lg mb-4 italic'>
                                    {card.quote}
                                </p>

                                {/* Description */}
                                <p className='text-gray-400 text-sm sm:text-base leading-relaxed max-w-xs'>
                                    {card.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Bottom Quote / Resolution */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className='mt-16 flex items-center justify-center gap-3 px-6 py-3.5 bg-white rounded-full shadow-lg border border-gray-200 text-gray-900'
                >
                    <span className='text-base sm:text-lg font-bold'>
                        DevMemory is built to break this loop.
                    </span>
                </motion.div>
            </div>
        </section>
    )
}

export default Problem
