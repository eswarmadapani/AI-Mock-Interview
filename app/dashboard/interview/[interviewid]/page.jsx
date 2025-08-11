"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../../utils/db'
import { MockInterview } from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'

function InterviewPage({ params }) {
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.interviewid) {
      console.log('Interview ID:', params.interviewid)
      GetInterviewDetails()
    } else {
      console.log('No interview ID found')
      setLoading(false)
    }
  }, [params?.interviewid])

  const GetInterviewDetails = async () => {
    try {
      setLoading(true)
      const result = await db.select().from(MockInterview).where(eq(MockInterview.id, params.interviewid))
      console.log('Database result:', result)
      setInterviewData(result[0] || null)
    } catch (error) {
      console.error('Error fetching interview details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="my-10 flex justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Let's start the interview</h1>
      <div>
        {/* <Webcam /> */}
        <WebcamIcon className='w-14 h-14 p-2 rounded-full bg-gray-200'/>
      </div>
    </div>
  )
}

export default InterviewPage
