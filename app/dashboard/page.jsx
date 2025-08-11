import React from 'react'
import AddNewinterview from './_components/AddNewInterview'

function Dashboard({children}) {
  return (
    <div>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewinterview></AddNewinterview>
      </div>
    </div>
  )
}

export default Dashboard
