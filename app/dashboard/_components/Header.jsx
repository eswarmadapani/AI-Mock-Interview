'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

function Header() {
  const path= usePathname();
  useEffect(() => {
    console.log(path);
  }, [path]);
  
  return (
    <div className='flex justify-between items-center p-4  bg-secondary shadow-sm border-b'>
      <Image 
        src={'/logo.svg'}  
        width={160} 
        height={100} 
        alt='logo' 
        className="h-8 w-auto"
        priority
      />
      <ul className='hidden md:flex gap-4 '>
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
      <UserButton/>
    </div>
  )
}

export default Header
