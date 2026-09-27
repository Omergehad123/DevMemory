import React from 'react'
import PrimaryButton from './ui/PrimaryButton'
import OutlineButton from './ui/OutlineButton'
import { HiArrowRight } from 'react-icons/hi'
import { IoSearch } from 'react-icons/io5'

export default function Hero() {
    return (
        <section className='relative w-full py-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center overflow-hidden h-[90vh]'>
            <div className='max-w-3xl mx-auto flex flex-col items-center gap-6'>
                {/* Main Headline — Renders immediately for sub-second LCP */}
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight'>
                    <span className='text-(--hoverColor)'>Learn</span> it. <span className='text-(--hoverColor)'>Use</span> it. <span className='text-(--hoverColor)'>Remember </span>it.
                </h1>

                {/* Description */}
                <p className='text-[#777] text-lg sm:text-xl md:text-2xl font-normal max-w-2xl leading-relaxed'>
                    A developer reference built to help you understand concepts, and remember what you learned.
                </p>

                {/* CTA Buttons */}
                <div className='flex flex-wrap items-center justify-center gap-4 mt-4'>
                    <PrimaryButton href='/references' icon={HiArrowRight}>
                        Start Learning
                    </PrimaryButton>

                    <OutlineButton href='/search' icon={IoSearch}>
                        Search Anything
                    </OutlineButton>
                </div>
            </div>
        </section>
    )
}
