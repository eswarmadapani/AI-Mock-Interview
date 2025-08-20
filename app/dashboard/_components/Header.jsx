'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import ThemeToggle from '../../../components/ThemeToggle'

function Header() {
  const path= usePathname();
  useEffect(() => {
    console.log(path);
  }, [path]);
  
  return (
    <div className='flex justify-between items-center p-4 bg-secondary shadow-sm border-b dark:bg-gray-800 dark:border-gray-700'>
      <div className="flex items-center space-x-3 group cursor-pointer">
        <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-sm flex items-center justify-center transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
          <svg className="w-5 h-5 text-white dark:text-slate-900 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="relative overflow-hidden">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 transition-all duration-700 ease-out group-hover:tracking-wide">
            AI Mocker
          </h1>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out group-hover:w-full"></div>
        </div>
      </div>
      <ul className='hidden md:flex gap-4 dark:text-gray-300'>
          <li className={`hover:text-primary hover:font-bold transition-all duration-300 cursor-pointer
            ${path === '/dashboard' && 'text-primary font-bold'}
            `}>Dashboard</li>
          <li className={`hover:text-primary hover:font-bold transition-all duration-300 cursor-pointer
            ${path === '/dashboard/questions' && 'text-primary font-bold'}
            `}>Questions</li>
          <li className={`hover:text-primary hover:font-bold transition-all duration-300 cursor-pointer
            ${path === '/dashboard/upgrade' && 'text-primary font-bold'}
            `}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all duration-300 cursor-pointer
            ${path === '/dashboard/how-it-works' && 'text-primary font-bold'}
            `}>How it works</li>
      </ul>
      <div className='flex items-center gap-4'>
        <ThemeToggle />
        <UserButton/>
      </div>
    </div>
  )
}

export default Header
