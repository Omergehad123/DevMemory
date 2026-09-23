'use client'

import React, { useState } from 'react'
import { LuCopy, LuCheck, LuTerminal } from 'react-icons/lu'
import { HiArrowTopRightOnSquare } from 'react-icons/hi2'

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className='my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#0d1322] shadow-xl'>
      {/* Code block header */}
      <div className='flex items-center justify-between px-4 py-2.5 bg-[#141b2d] border-b border-white/10'>
        <div className='flex items-center gap-2'>
          <div className='flex gap-1.5 mr-2'>
            <span className='w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block' />
            <span className='w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block' />
            <span className='w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block' />
          </div>
          <LuTerminal className='w-4 h-4 text-(--secondColor)' />
          <span className='font-mono text-xs font-semibold uppercase tracking-wider text-gray-300'>
            {language || 'code'}
          </span>
        </div>
        <button
          type='button'
          onClick={handleCopy}
          className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all duration-150 cursor-pointer border border-white/5'
          title='Copy code snippet'
        >
          {copied ? (
            <>
              <LuCheck className='w-3.5 h-3.5 text-emerald-400' />
              <span className='text-emerald-400 text-xs font-medium'>Copied!</span>
            </>
          ) : (
            <>
              <LuCopy className='w-3.5 h-3.5' />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code block body */}
      <pre className='p-4 sm:p-5 overflow-x-auto text-sm font-mono leading-relaxed text-gray-200 selection:bg-(--secondColor)/30'>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function RenderInline({ inline }) {
  if (!inline) return null
  let element = <span>{inline.text}</span>

  if (inline.marks) {
    inline.marks.forEach((mark) => {
      if (mark.type === 'bold') {
        element = <strong className='font-bold text-white'>{element}</strong>
      } else if (mark.type === 'italic') {
        element = <em className='italic text-gray-200'>{element}</em>
      } else if (mark.type === 'underline') {
        element = <u className='underline decoration-(--secondColor) underline-offset-4'>{element}</u>
      } else if (mark.type === 'code') {
        element = (
          <code className='px-1.5 py-0.5 mx-0.5 rounded-md bg-white/10 text-(--secondColor) font-mono text-xs sm:text-sm border border-white/5'>
            {element}
          </code>
        )
      } else if (mark.type === 'link') {
        element = (
          <a
            href={mark.attrs?.href}
            target='_blank'
            rel='noopener noreferrer'
            className='text-(--hoverColor) hover:underline inline-flex items-center gap-1 font-medium transition-colors'
          >
            {element}
            <HiArrowTopRightOnSquare className='w-3.5 h-3.5 inline' />
          </a>
        )
      }
    })
  }

  return element
}

function RenderNode({ node, index }) {
  if (!node) return null

  switch (node.type) {
    case 'heading': {
      const level = node.attrs?.level || 2
      const text = node.content?.map((c) => c.text).join('') || ''
      if (level === 1) {
        return (
          <h1 key={index} className='text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight border-b border-white/10 pb-3'>
            {text}
          </h1>
        )
      }
      if (level === 2) {
        return (
          <h2 key={index} className='text-xl sm:text-2xl font-bold text-white mt-7 mb-3 tracking-tight flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-(--secondColor)' />
            {text}
          </h2>
        )
      }
      if (level === 3) {
        return (
          <h3 key={index} className='text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2.5'>
            {text}
          </h3>
        )
      }
      return (
        <h4 key={index} className='text-base font-semibold text-gray-200 mt-5 mb-2'>
          {text}
        </h4>
      )
    }

    case 'paragraph': {
      if (!node.content || node.content.length === 0) {
        return <div key={index} className='h-3' />
      }
      return (
        <p key={index} className='text-gray-300 text-sm sm:text-base leading-relaxed my-3 font-normal'>
          {node.content.map((child, idx) => (
            <RenderInline key={idx} inline={child} />
          ))}
        </p>
      )
    }

    case 'codeBlock': {
      const lang = node.attrs?.language || 'javascript'
      const code = node.content?.map((c) => c.text).join('') || ''
      return <CodeBlock key={index} code={code} language={lang} />
    }

    case 'blockquote': {
      return (
        <blockquote
          key={index}
          className='border-l-4 border-(--secondColor) bg-white/5 rounded-r-xl pl-4 pr-4 py-3 my-5 text-gray-300 italic'
        >
          {node.content?.map((child, idx) => (
            <RenderNode key={idx} node={child} index={idx} />
          ))}
        </blockquote>
      )
    }

    case 'bulletList': {
      return (
        <ul key={index} className='space-y-2 my-4 pl-5 list-disc marker:text-(--secondColor) text-gray-300 text-sm sm:text-base'>
          {node.content?.map((item, idx) => (
            <li key={idx} className='leading-relaxed'>
              {item.content?.map((child, cIdx) => (
                <RenderNode key={cIdx} node={child} index={cIdx} />
              ))}
            </li>
          ))}
        </ul>
      )
    }

    case 'orderedList': {
      return (
        <ol key={index} className='space-y-2 my-4 pl-5 list-decimal marker:text-(--secondColor) marker:font-semibold text-gray-300 text-sm sm:text-base'>
          {node.content?.map((item, idx) => (
            <li key={idx} className='leading-relaxed'>
              {item.content?.map((child, cIdx) => (
                <RenderNode key={cIdx} node={child} index={cIdx} />
              ))}
            </li>
          ))}
        </ol>
      )
    }

    case 'image': {
      return (
        <div key={index} className='my-6 rounded-2xl overflow-hidden border border-white/10 bg-black/20 p-2'>
          <img
            src={node.attrs?.src}
            alt={node.attrs?.alt || 'Reference illustration'}
            className='rounded-xl max-h-[460px] w-auto mx-auto object-contain shadow-lg'
          />
          {node.attrs?.alt && (
            <p className='text-center text-xs text-gray-400 mt-2 italic font-mono'>
              {node.attrs.alt}
            </p>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

export function hasValidContent(doc) {
  if (!doc || !doc.content || !Array.isArray(doc.content) || doc.content.length === 0) return false
  return doc.content.some((node) => {
    if (node.type === 'paragraph') {
      return node.content && node.content.some((c) => c.text && c.text.trim().length > 0)
    }
    return true
  })
}

export default function DocumentRenderer({ doc }) {
  if (!hasValidContent(doc)) {
    return (
      <div className='p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-400 text-sm italic'>
        No content written for this reference yet.
      </div>
    )
  }

  return (
    <div className='w-full'>
      {doc.content.map((node, index) => (
        <RenderNode key={index} node={node} index={index} />
      ))}
    </div>
  )
}
