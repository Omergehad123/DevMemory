'use client'

import React from 'react'
import { motion } from 'framer-motion'

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

export default function SoonPlaceholder({ message, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full rounded-3xl py-20 sm:py-28 md:py-36 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden ${className}`}
    >
      <div className='flex items-center justify-center font-mono text-6xl sm:text-8xl md:text-9xl lg:text-[8rem] font-black tracking-wider select-none relative z-10'>
        {['s', 'o', 'o', 'n', '.', '.', '.', '.'].map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={soonLetterVariants}
            animate='animate'
            className='inline-block text-(--hoverColor)'
          >
            {char}
          </motion.span>
        ))}
      </div>
      {message && (
        <p className='text-gray-500 text-sm sm:text-base font-mono mt-6'>
          {message}
        </p>
      )}
    </motion.div>
  )
}
