import React from 'react'
import Link from 'next/link'

function PrimaryButton({ children, href, onClick, className = '', icon: Icon, ...props }) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-(--secondColor) hover:bg-(--hoverColor) text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98'

    if (href) {
        return (
            <Link href={href} className={`${baseStyles} ${className}`} {...props}>
                {children}
                {Icon && <Icon className='text-lg' />}
            </Link>
        )
    }

    return (
        <button onClick={onClick} className={`${baseStyles} ${className}`} {...props}>
            {children}
            {Icon && <Icon className='text-lg' />}
        </button>
    )
}

export default PrimaryButton
