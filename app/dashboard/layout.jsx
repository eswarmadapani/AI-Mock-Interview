import React from 'react'
import Header from './_components/Header'

function Dashboardlayout({children}) {
  return (
    <div className='dark:bg-gray-900 min-h-screen'>
      <Header/>
      <div className='mx-5 md:mx-20 lg:mx-36'>
        {children}
      </div>
    </div>
  )
}

export default Dashboardlayout
