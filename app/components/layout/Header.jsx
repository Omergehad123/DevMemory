'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { IoSearch, IoMenu, IoClose } from 'react-icons/io5'
import Navbar from './Navbar'
import HeaderSearchModal from './HeaderSearchModal'
import { searchAll } from '@/lib/api/search.api'

const navLinks = [
  { name: 'Home', href: '/', exact: true },
  { name: 'References', href: '/references' },
]

function HeaderSearchInput() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState({ categories: [], references: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const router = useRouter()

  // Debounced search without synchronous setState in effect
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    let isSubscribed = true
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        const data = await searchAll(trimmed, { limit: 4 })
        if (isSubscribed) {
          setResults(data)
        }
      } catch (err) {
        if (isSubscribed) {
          console.error('Header search error:', err)
          setResults({ categories: [], references: [] })
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }, 280)

    return () => {
      isSubscribed = false
      clearTimeout(timer)
    }
  }, [searchQuery])

  // Keyboard & click outside handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setIsOpen(false)
    setResults({ categories: [], references: [] })
  }

  return (
    <>
      <div ref={inputRef} className='relative flex items-center'>
        <IoSearch className='text-gray-400 text-lg absolute left-3 pointer-events-none' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => {
            const val = e.target.value
            setSearchQuery(val)
            if (val.trim()) {
              setIsOpen(true)
            } else {
              setIsOpen(false)
              setResults({ categories: [], references: [] })
            }
          }}
          onFocus={() => {
            if (searchQuery.trim().length > 0) setIsOpen(true)
          }}
          onKeyDown={handleSearchSubmit}
          placeholder='Search anything...'
          className='pl-9 pr-8 py-1.5 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-full border border-gray-200 focus:outline-none focus:border-(--secondColor) focus:bg-white focus:ring-2 focus:ring-(--secondColor)/20 transition-all duration-200 w-36 sm:w-44 md:w-60'
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className='absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer'
            aria-label='Clear search'
          >
            <IoClose className='text-sm' />
          </button>
        )}
      </div>

      <HeaderSearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        results={results}
        isLoading={isLoading}
        dropdownRef={dropdownRef}
      />
    </>
  )
}

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const pathname = usePathname()

  return (
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

        {/* Search Bar - Keyed to pathname to automatically reset on navigation */}
        <HeaderSearchInput key={pathname} />
      </div>

      {/* Mobile Navigation Drawer */}
      <Navbar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </header>
  )
}