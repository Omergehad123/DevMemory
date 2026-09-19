'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { IoClose } from 'react-icons/io5'
import { HiOutlineHome, HiOutlineBookOpen } from 'react-icons/hi'

const navLinks = [
    { name: 'Home', href: '/', icon: HiOutlineHome, exact: true },
    { name: 'References', href: '/references', icon: HiOutlineBookOpen },
]

function Navbar({ isOpen, onClose }) {
    const pathname = usePathname()

    return (
        <>
            {/* Overlay Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300 md:hidden ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Sidebar from Left */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[250px] bg-(--mainColor) shadow-2xl flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Sidebar Header with Brand & Close Button */}
                    <div className='flex items-center justify-between pb-4 border-b border-gray-100'>
                        <div className='flex items-center gap-2'>
                            <Image src="/logo.png" alt="logo" width={40} height={40} />
                            <span className='text-(--secondColor) text-lg font-bold'>DevMemory</span>
                        </div>
                        <button
                            onClick={onClose}
                            className='text-(--bgColor) hover:text-(--secondColor) p-1 rounded-lg transition-colors cursor-pointer'
                            aria-label="Close menu"
                        >
                            <IoClose className='text-2xl' />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className='mt-6'>
                        <ul className='flex flex-col gap-2'>
                            {navLinks.map((link) => {
                                const Icon = link.icon
                                const isActive = link.exact
                                    ? pathname === link.href
                                    : pathname.startsWith(link.href)

                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold transition-all duration-200 ${
                                                isActive
                                                    ? 'text-(--secondColor) bg-indigo-50/60'
                                                    : 'text-(--bgColor) hover:text-(--secondColor) hover:bg-gray-50'
                                            }`}
                                        >
                                            {Icon && <Icon className='text-xl' />}
                                            <span>{link.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className='pt-4 border-t border-gray-100 text-xs text-gray-400 text-center'>
                    DevMemory &copy; {new Date().getFullYear()}
                </div>
            </aside>
        </>
    )
}

export default Navbar
