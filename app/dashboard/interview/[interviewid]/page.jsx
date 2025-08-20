"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../../utils/db'
import { MockInterview } from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'


function InterviewPage({ params }) {
  // Unwrap params if it's a promise (Next.js 15+), otherwise use directly
  const realParams = typeof params.then === 'function' ? React.use(params) : params;
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (realParams?.interviewid) {
      console.log('Interview ID:', realParams.interviewid);
      GetInterviewDetails();
    } else {
      console.log('No interview ID found');
      setLoading(false);
      setError('No interview ID found in the URL.');
    }
    // eslint-disable-next-line
  }, [realParams?.interviewid]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!realParams?.interviewid) {
        console.error('No interviewid param found!');
        setInterviewData(null);
        setError('No interview ID found in the URL.');
        return;
      }
      console.log('Querying with interviewid:', realParams.interviewid);
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, realParams.interviewid));
      console.log('Database result:', result);
      if (!result || result.length === 0) {
        setInterviewData(null);
        setError('No interview found for this ID.');
      } else {
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setError('Error fetching interview details.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg bg-red-50 border border-red-200 p-6 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-10 flex justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Let's start the interview</h1>
      <div>
        {/* <Webcam /> */}
        <WebcamIcon className='w-14 h-14 p-2 rounded-full bg-gray-200'/>
      </div>
    </div>
  );
}

export default InterviewPage
