'use client'

import React from 'react'

export default function HighlightMatch({ text, query, className = '' }) {
    if (!text) return null
    if (!query || !query.trim()) return <span className={className}>{text}</span>

    const trimmed = query.trim()
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const parts = String(text).split(regex)
    const lowerQuery = trimmed.toLowerCase()

    return (
        <span className={className}>
            {parts.map((part, i) =>
                part.toLowerCase() === lowerQuery ? (
                    <mark
                        key={i}
                        className='bg-amber-400/25 text-amber-300 font-semibold px-0.5 rounded not-italic'
                    >
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </span>
    )
}
