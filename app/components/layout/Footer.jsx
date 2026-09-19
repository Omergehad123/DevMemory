'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className='w-full bg-(--bgColor) text-white border-t border-white/10 py-12 px-4 sm:px-8 md:px-20'>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-8 text-center md:text-left'>
                {/* Left Section: Logo & Name underneath */}
                <div className='flex flex-col items-center md:items-start gap-2'>
                    <Link href='/' className='flex flex-col items-center md:items-start gap-2 group'>
                        <Image
                            src='/logo.png'
                            alt='DevMemory Logo'
                            width={54}
                            height={54}
                            className='transition-transform duration-200 group-hover:scale-105'
                        />
                        <span className='text-(--secondColor) text-xl sm:text-2xl font-bold tracking-tight'>
                            DevMemory
                        </span>
                    </Link>
                </div>

                {/* Middle Section: Direct links to Home and References */}
                <div className='flex flex-col items-center gap-3'>
                    <span className='text-xs font-mono uppercase tracking-widest text-gray-500 font-semibold'>
                        Navigation
                    </span>
                    <ul className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-medium text-sm sm:text-base'>
                        <li>
                            <Link
                                href='/'
                                className='text-gray-300 hover:text-(--hoverColor) transition-colors duration-200'
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/references'
                                className='text-gray-300 hover:text-(--hoverColor) transition-colors duration-200'
                            >
                                References
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right / End Section: Quote related to the project */}
                <div className='flex flex-col items-center md:items-end max-w-xs'>
                    <p className='text-gray-400 text-sm sm:text-base italic font-normal leading-relaxed text-center md:text-right'>
                        &ldquo;Understand concepts, practice them, and actually remember what you learned.&rdquo;
                    </p>
                </div>
            </div>

            {/* Bottom Copyright bar */}
            <div className='max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3'>
                <p>&copy; {new Date().getFullYear()} <a className='text-(--secondColor)' href="https://portfolio-ivory-one-27.vercel.app/">Omar Gehad</a>. All rights reserved.</p>
                <p className='font-mono'>Built for developers</p>
            </div>
        </footer>
    )
}
