'use client'

import React from 'react'
import { motion } from 'framer-motion'
import PrimaryButton from './ui/PrimaryButton'
import OutlineButton from './ui/OutlineButton'
import { HiArrowRight } from 'react-icons/hi'
import { IoSearch } from 'react-icons/io5'

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
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
}

function Hero() {
    return (
        <section className='relative w-full py-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center overflow-hidden h-[90vh]'>
            <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='max-w-3xl mx-auto flex flex-col items-center gap-6'
            >
                {/* Main Headline */}
                <motion.h1
                    variants={itemVariants}
                    className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight'
                >
                    <span className='text-(--hoverColor)'>Learn</span> it. <span className='text-(--hoverColor)'>Use</span> it. <span className='text-(--hoverColor)'>Remember </span>it.
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className='text-[#777] text-lg sm:text-xl md:text-2xl font-normal max-w-2xl leading-relaxed'
                >
                    A developer reference built to help you understand concepts, practice them, and actually remember what you learned.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className='flex flex-wrap items-center justify-center gap-4 mt-4'
                >
                    <PrimaryButton href='/references' icon={HiArrowRight}>
                        Start Learning
                    </PrimaryButton>

                    <OutlineButton href='/search' icon={IoSearch}>
                        Search Anything
                    </OutlineButton>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Hero
