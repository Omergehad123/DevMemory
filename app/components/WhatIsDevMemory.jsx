'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Code2, Brain, ArrowRight } from 'lucide-react'

const features = [
    {
        icon: BookOpen,
        title: 'Learn',
        description: 'Understand concepts through simple explanations.',
    },
    {
        icon: Code2,
        title: 'Practice',
        description:
            'Use what you learned with real examples and small challenges.',
    },
    {
        icon: Brain,
        title: 'Remember',
        description: 'Come back to concepts before you forget them.',
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
}

const itemVariants = {
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

function WhatIsDevMemory() {
    return (
        <section className='w-full bg-(--bgColor) text-white py-14 sm:py-16 px-4 sm:px-8 relative overflow-hidden border-t border-white/5'>
            {/* Subtle background glow */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-(--hoverColor)/5 blur-[120px] rounded-full pointer-events-none' />

            <div className='max-w-6xl mx-auto flex flex-col items-start'>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className='mb-14 sm:mb-16'
                >
                    {/* Monospace Kicker */}
                    <span className='font-mono text-sm sm:text-base text-(--hoverColor) tracking-wider inline-block mb-3 font-semibold'>
                        What is DevMemory?
                    </span>

                    {/* Main Title */}
                    <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]'>
                        Your developer memory, in one place.
                    </h2>
                </motion.div>

                {/* 3 Main Feature Cards (matching reference image style) */}
                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-60px' }}
                    className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch'
                >
                    {features.map((item) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={item.title}
                                variants={itemVariants}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                className='group relative bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl p-7 sm:p-9 flex flex-col justify-between border border-white/10 hover:border-(--hoverColor)/50 transition-all duration-300 shadow-xl shadow-black/30'
                            >
                                <div>
                                    {/* Icon with hoverColor stroke styling */}
                                    <div className='w-12 h-12 rounded-xl flex items-center justify-center text-(--hoverColor) mb-8 bg-(--hoverColor)/10 border border-(--hoverColor)/20 group-hover:scale-105 group-hover:bg-(--hoverColor)/15 transition-all duration-300'>
                                        <Icon className='w-6 h-6 stroke-[1.75]' />
                                    </div>

                                    {/* Card Title */}
                                    <h3 className='text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3'>
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className='text-gray-400 text-sm sm:text-base leading-relaxed font-normal'>
                                        {item.description}
                                    </p>
                                </div>

                                {/* Learn more CTA link */}
                                <div className='mt-8 pt-4 flex items-center gap-2 text-sm sm:text-base font-medium text-gray-400 group-hover:text-(--hoverColor) transition-colors duration-200 cursor-pointer'>
                                    <span>Learn more</span>
                                    <ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5' />
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}

export default WhatIsDevMemory
