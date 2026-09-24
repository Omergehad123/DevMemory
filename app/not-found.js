import Link from 'next/link'
import { IoArrowBack, IoSearchOutline, IoHomeOutline } from 'react-icons/io5'

export const metadata = {
  title: 'Page Not Found — DevMemory',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className='w-full min-h-[calc(100vh-80px)] bg-(--bgColor) text-gray-100 flex items-center justify-center p-6 sm:p-10'>
      <div className='max-w-lg w-full bg-gradient-to-b from-[#131b2e] to-[#0d1322] border border-white/10 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-2xl'>
        {/* 404 Number Badge */}
        <div className='inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-(--secondColor)/15 border border-(--secondColor)/30 text-(--secondColor) text-3xl font-black font-mono shadow-lg shadow-(--secondColor)/20'>
          404
        </div>

        <div className='space-y-2'>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
            Page or Topic Not Found
          </h1>
          <p className='text-sm sm:text-base text-gray-400 leading-relaxed max-w-sm mx-auto'>
            The category or reference you are looking for does not exist, has been renamed, or was moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2'>
          <Link
            href='/references'
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-(--secondColor) hover:opacity-90 text-white font-bold text-sm transition-all shadow-lg shadow-(--secondColor)/25'
          >
            <IoArrowBack className='text-base' />
            <span>Browse Categories</span>
          </Link>

          <Link
            href='/search'
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-sm border border-white/10 transition-colors'
          >
            <IoSearchOutline className='text-base' />
            <span>Search Topics</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
