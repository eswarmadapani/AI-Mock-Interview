"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db'
import { MockInterview } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import dynamic from "next/dynamic";

import QuestionsSections from './_components/QuestionsSections'
const RecordAns = dynamic(() => import('./_components/RecordAns'), { ssr: false });

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mockInterview, setMockInterview] = useState(null)
  // Unwrap params if it's a promise (Next.js 15+), otherwise use directly
  const unwrappedParams = typeof params.then === 'function' ? React.use(params) : params;
  
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get interviewId from route parameters
      const interviewId = unwrappedParams?.interviewid;
      console.log('🔍 Params object:', unwrappedParams);
      console.log('🔍 Interview ID from route:', interviewId);
      if (!interviewId) {
        setError('No interview ID found in the URL.');
        setLoading(false);
        return;
      }
      // Query by mockId (since [interviewid] is a string like mock_xxx)
      let result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
      console.log('📊 Query by mockId result:', result);
      if (!result || result.length === 0) {
        setError('No interview found with this ID.');
        setLoading(false);
        return;
      }
      setInterviewData(result[0]);
      // Parse the jsonMockResp to get the questions
      if (result[0].jsonMockResp) {
        try {
          let parsedQuestions = JSON.parse(result[0].jsonMockResp);
          if (Array.isArray(parsedQuestions)) {
            parsedQuestions = { questions: parsedQuestions };
          }
          setMockInterview(parsedQuestions);
        } catch (parseError) {
          setError('Error parsing questions for this interview.');
          console.error('❌ Error parsing questions:', parseError);
          console.error('❌ Raw jsonMockResp:', result[0].jsonMockResp);
        }
      } else {
        setError('No questions found for this interview.');
      }
    } catch (error) {
      setError('Error fetching interview details.');
      console.error('💥 Error fetching interview details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log('🚀 useEffect triggered')
    GetInterviewDetails()
  }, [unwrappedParams?.interviewid])
  
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="flex w-full max-w-5xl gap-8">
        {/* Left: Questions Section (card) */}
        <div className="flex-1 flex flex-col items-start">
          <div className="w-full">
            {/* Removed Start Interview heading as requested */}
            {loading && <p className="text-lg text-blue-600 dark:text-blue-400">Loading interview details...</p>}
            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-lg font-semibold my-6 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            {interviewData && !error && (
              <div className="space-y-6">
                {/* Questions Section */}
                {mockInterview && mockInterview.questions && (
                  <div className="bg-white p-6 rounded-lg shadow border dark:bg-slate-800 dark:border-slate-600">
                    <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Interview Questions</h2>
                    <QuestionsSections 
                      mockInterview={mockInterview} 
                      currentQuestionIndex={currentQuestionIndex}
                      setCurrentQuestionIndex={setCurrentQuestionIndex}
                      answeredQuestions={answeredQuestions}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Right: Recording component */}
        <div className="flex-1 flex flex-col items-center justify-start">
          <RecordAns 
            questions={mockInterview?.questions || []}
            mockId={interviewData?.mockId || "default-mock-id"}
            interviewId={unwrappedParams?.interviewid}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            answeredQuestions={answeredQuestions}
            setAnsweredQuestions={setAnsweredQuestions}
          />
        </div>
      </div>
    </div>
    
  );
}

export default StartInterview
