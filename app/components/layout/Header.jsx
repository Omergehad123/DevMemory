'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { IoSearch, IoMenu, IoClose } from 'react-icons/io5'
import { HiArrowRight } from 'react-icons/hi2'
import Navbar from './Navbar'

const navLinks = [
    { name: 'Home', href: '/', exact: true },
    { name: 'References', href: '/references' },
]

function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const pathname = usePathname()
    const router = useRouter()

    // Close search dropdown on route change
    useEffect(() => {
        setSearchQuery('')
    }, [pathname])

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    const isSearchOpen = searchQuery.trim().length > 0

    return (
        <>
            <header className='bg-(--mainColor) py-2 px-4 sm:px-8 md:px-20 flex justify-between items-center shadow-lg relative z-30'>
                {/* Left Section: Logo & Brand + Mobile Menu Button */}
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => setIsNavOpen(true)}
                        className='text-(--bgColor) hover:text-(--secondColor) text-2xl p-1 rounded-md md:hidden cursor-pointer transition-colors'
                        aria-label="Open navigation menu"
                    >
                        <IoMenu />
                    </button>

                    <Link href="/" className='flex items-center gap-2 sm:gap-3'>
                        <Image
                            src="/logo.png"
                            alt='DevMemory Logo'
                            width={70}
                            height={70}
                            priority
                            className='w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] object-contain'
                        />
                        <h1 className='text-(--secondColor) text-xl sm:text-2xl font-bold'>DevMemory</h1>
                    </Link>
                </div>

                {/* Right Section: Desktop Navigation & Search Bar */}
                <div className='flex items-center gap-4 sm:gap-6'>
                    {/* Desktop Navigation Links */}
                    <ul className='hidden md:flex items-center gap-6 font-medium text-sm md:text-base'>
                        {navLinks.map((link) => {
                            const isActive = link.exact
                                ? pathname === link.href
                                : pathname.startsWith(link.href)

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`font-bold transition-colors duration-200 ${
                                            isActive ? 'text-(--secondColor)' : 'text-(--bgColor) hover:text-(--secondColor)'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Search Bar */}
                    <div className='relative flex items-center'>
                        <IoSearch className='text-gray-400 text-lg absolute left-3 pointer-events-none' />
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            placeholder='Search...'
                            className='pl-9 pr-8 py-1.5 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-full border border-gray-200 focus:outline-none focus:border-(--secondColor) focus:bg-white focus:ring-2 focus:ring-(--secondColor)/20 transition-all duration-200 w-36 sm:w-44 md:w-60'
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className='absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer'
                                aria-label='Clear search'
                            >
                                <IoClose className='text-sm' />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Drawer & Overlay */}
                <Navbar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
            </header>

            {/* Overlay Backdrop when header search is active (same overlay as mobile menu) */}
            <div
                onClick={() => setSearchQuery('')}
                className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-30 transition-opacity duration-300 ${
                    isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Live Search Popup Div directly under header (70% width, bg bgColor) */}
            {isSearchOpen && (
                <div className='fixed top-[68px] sm:top-[78px] md:top-[86px] left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] max-w-4xl z-40 bg-(--bgColor) text-white rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between gap-6 animate-in fade-in zoom-in-95 duration-200'>
                    <div className='flex items-center justify-between border-b border-white/10 pb-4'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 rounded-xl bg-white/5 border border-white/10 text-(--hoverColor)'>
                                <IoSearch className='text-xl' />
                            </div>
                            <div>
                                <span className='text-xs font-mono uppercase tracking-widest text-gray-400 block'>
                                    Search Query
                                </span>
                                <h3 className='text-lg sm:text-xl font-bold text-white'>
                                    &ldquo;{searchQuery}&rdquo;
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={() => setSearchQuery('')}
                            className='text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer'
                        >
                            <IoClose className='text-xl' />
                        </button>
                    </div>

                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-2'>
                        <span className='text-xs sm:text-sm font-mono text-gray-400'>
                            Press <kbd className='px-2 py-1 rounded bg-white/10 text-white font-bold'>Enter</kbd> to search
                        </span>

                        <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            onClick={() => setSearchQuery('')}
                            className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-(--hoverColor) hover:opacity-90 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-(--hoverColor)/25'
                        >
                            <span>Search DevMemory</span>
                            <HiArrowRight className='w-4 h-4' />
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header