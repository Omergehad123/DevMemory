'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'

export default function CTA() {
    return (
        <section className='w-full bg-(--bgColor) text-white py-20 sm:py-28 px-4 sm:px-8 relative overflow-hidden border-t border-white/5'>
            {/* Subtle background glow */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-(--hoverColor)/10 blur-[120px] rounded-full pointer-events-none' />

            <div className='max-w-4xl mx-auto flex flex-col items-center text-center relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className='flex flex-col items-center gap-6'
                >
                    {/* Small text / Question */}
                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl'>
                        Ready to remember what you learn?
                    </h2>

                    {/* Button under it navigating to Explore References */}
                    <Link
                        href='/references'
                        className='inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-(--hoverColor) hover:opacity-90 text-white font-bold text-base sm:text-lg transition-all duration-200 shadow-xl shadow-(--hoverColor)/25 hover:shadow-(--hoverColor)/40 hover:scale-[1.02] cursor-pointer'
                    >
                        <span>Explore References</span>
                        <HiArrowRight className='w-5 h-5 transition-transform duration-200 group-hover:translate-x-1' />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
