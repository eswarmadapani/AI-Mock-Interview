"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../utils/db'
import { MockInterview } from '../../utils/schema'
import { eq, desc } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { useUser } from '@clerk/nextjs'

function Interview() {
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      GetLatestInterview()
    }
  }, [user])

  const GetLatestInterview = async () => {
    try {
      setLoading(true)
      // Get the latest interview for the current user
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.createdAt))
        .limit(1)
      
      console.log('Latest interview:', result)
      setInterviewData(result[0] || null)
    } catch (error) {
      console.error('Error fetching latest interview:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300">Loading interview...</p>
        </div>
      </div>
    )
  }

  if (!interviewData) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-slate-100">No Interview Found</h2>
          <p className="text-gray-600 mb-4 dark:text-slate-300">Please create an interview first.</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="my-10 px-6 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center dark:text-slate-100">Let's Get Started</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Job Details */}
        <div className="bg-white rounded-lg border p-6 shadow-sm dark:bg-slate-800 dark:border-slate-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-100">Job Details</h2>
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-slate-300">Job Role/Job Position:</span>
              <p className="text-gray-900 mt-1 dark:text-slate-100">{interviewData?.jobPosition || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-slate-300">Job Description/Tech Stack:</span>
              <p className="text-gray-900 mt-1 dark:text-slate-100">{interviewData?.jobDesc || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-slate-300">Years of Experience:</span>
              <p className="text-gray-900 mt-1 dark:text-slate-100">{interviewData?.jobExperience || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Webcam Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm dark:bg-slate-800 dark:border-slate-600">
          <div className="flex flex-col items-center gap-6">
            {cameraEnabled ? (
              <Webcam 
                className="w-full max-w-md h-64 rounded-lg bg-gray-100 border-2 border-gray-200"
                audio={false}
                screenshotFormat="image/jpeg"
                mirrored={true}
              />
            ) : (
              <div className="w-full max-w-md h-64 rounded-lg bg-gray-100 border-2 border-gray-200 flex flex-col items-center justify-center gap-4 dark:bg-slate-700 dark:border-slate-600">
                <WebcamIcon className="w-24 h-24 text-gray-600 dark:text-slate-300" />
                <p className="text-gray-700 font-medium text-center dark:text-slate-200">Enable Web Cam and Microphone</p>
              </div>
            )}
            <Button 
              onClick={() => {
                setCameraEnabled(!cameraEnabled)
                console.log(cameraEnabled ? 'Disabling camera...' : 'Enabling camera...')
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              variant="default"
            >
              {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
            </Button>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 max-w-6xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 shadow-sm dark:bg-yellow-900/20 dark:border-yellow-600">
          <h2 className="flex gap-2 items-center text-lg font-semibold text-gray-800 mb-3 dark:text-slate-100">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <strong>Information</strong>
          </h2>
          <p className="text-gray-700 leading-relaxed dark:text-slate-300">
            Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview, It Has 5 question which you can answer and at the last you will get the report on the basis of your answer. NOTE: We never record your video, Web cam access you can disable at any time if you want.
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-6xl mx-auto flex justify-end">
        <Link href={`/dashboard/interview/${interviewData?.mockId}/start`}>
          <Button 
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
            onClick={() => {
              if (!cameraEnabled) {
                setCameraEnabled(true)
              }
              console.log('Starting interview...')
            }}
          >
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Interview
