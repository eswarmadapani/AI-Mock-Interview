import React from 'react'
import AddNewinterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <h2 className='font-bold text-2xl dark:text-gray-100'>Dashboard</h2>
      <h2 className='text-gray-500 dark:text-gray-400'>Create and Start your AI Mockup Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewinterview></AddNewinterview>
      </div>
      {/* Previous Interview List */}
      <InterviewList></InterviewList>
    </div>
  )
}

export default Dashboard
