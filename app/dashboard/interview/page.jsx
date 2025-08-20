"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../utils/db'
import { MockInterview } from '../../../utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { UserButton } from '@clerk/nextjs'


function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(false)

  useEffect(() => {
    if (params?.interviewId) {
      console.log('Interview ID:', params.interviewId)
      GetInterviewDetails()
    } else {
      console.log('No interview ID found')
      setLoading(false)
    }
  }, [params?.interviewId])

  const GetInterviewDetails = async () => {
    try {
      setLoading(true)
      // Query by mockId instead of id since we're passing mockId in the URL
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
      console.log('Interview data:', result)
      setInterviewData(result[0] || null)
    } catch (error) {
      console.error('Error fetching interview details:', error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="my-10 px-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Let's Get Started</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Job Details */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Details</h2>
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700">Job Role/Job Position:</span>
              <p className="text-gray-900 mt-1">{interviewData?.jobPosition || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Job Description/Tech Stack:</span>
              <p className="text-gray-900 mt-1">{interviewData?.jobDesc || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Years of Experience:</span>
              <p className="text-gray-900 mt-1">{interviewData?.jobExperience || 'Not specified'}</p>
            </div>
          </div>
        </div>
        {/* Right Column - Webcam Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6">
            {cameraEnabled ? (
              <Webcam 
                className="w-full max-w-md h-64 rounded-lg bg-gray-100 border-2 border-gray-200"
                audio={false}
                screenshotFormat="image/jpeg"
                mirrored={true}
              />
            ) : (
              <div className="w-full max-w-md h-64 rounded-lg bg-gray-100 border-2 border-gray-200 flex flex-col items-center justify-center gap-4">
                <WebcamIcon className="w-24 h-24 text-gray-600" />
                <p className="text-gray-700 font-medium text-center">Enable Web Cam and Microphone</p>
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
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 shadow-sm">
          <h2 className="flex gap-2 items-center text-lg font-semibold text-gray-800 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <strong>Information</strong>
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview, It Has 5 question which you can answer and at the last you will get the report on the basis of your answer. NOTE: We never record your video, Web cam access you can disable at any time if you want.
          </p>
        </div>
      </div>
      <div className="mt-8 max-w-6xl mx-auto flex justify-end">
        <Link href={`/dashboard/interview/${params?.interviewId}/start`}>
          <Button 
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
            onClick={() => {
              if (!cameraEnabled) {
                setCameraEnabled(true)
              }
              // Add your start interview logic here
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
