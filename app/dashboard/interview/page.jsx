"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../utils/db'
import { MockInterview } from '../../../utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'
import { Button } from '../../../components/ui/button'

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(false)

  useEffect(() => {
    if (params?.interviewId) {
      console.log(params.interviewId)
      GetInterviewDetails()
    } else {
      console.log('No interview ID found')
      setLoading(false)
    }
  }, [params?.interviewId])

  const GetInterviewDetails = async () => {
    try {
      setLoading(true)
      const result = await db.select().from(MockInterview).where(eq(MockInterview.id, params.interviewId))
      console.log(result)
      setInterviewData(result[0] || null)
    } catch (error) {
      console.error('Error fetching interview details:', error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="my-10 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Let's Get Started</h1>
      <div className="flex flex-col items-center gap-4">
        {cameraEnabled ? (
          <Webcam 
            className="w-48 h-48 rounded-lg bg-gray-200"
            audio={false}
            screenshotFormat="image/jpeg"
            width={192}
            height={192}
          />
        ) : (
          <div className="w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center">
            <WebcamIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <Button 
          onClick={() => {
            setCameraEnabled(!cameraEnabled)
            console.log(cameraEnabled ? 'Disabling camera...' : 'Enabling camera...')
            
          }}
          className="px-6 py-2"
          variant={cameraEnabled ? "destructive" : "default"}
        >
          {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
        </Button>
      </div>
    </div>
  )
}

export default Interview   
