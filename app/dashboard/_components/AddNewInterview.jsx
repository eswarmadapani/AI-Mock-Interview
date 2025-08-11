"use client"
import React, { useState } from 'react'

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog"
import { Button } from '../../../components/ui/button'
import { generateInterviewQuestions } from '../../../utils/GeminiAi'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDailog, setopenDaoilog] = useState(false)
    const [JobPosition,setJobPosition] = useState()  
    const [JobDescription,setJobDescription] = useState()
    const [Jobexperience,setJobexperience] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const user = useUser()
    const router = useRouter()    
    const onSubmit = async (e)=>{
      e.preventDefault()
      setIsLoading(true)
      
      console.log('Form submitted with values:', { JobPosition, JobDescription, Jobexperience })
      
      const InputPrompt = `
      You are a helpful assistant that can help me with my job interviewing.
      I am interviewing for a ${JobPosition} position.
      The job description is ${JobDescription}.
      I have ${Jobexperience} years of experience.
      `
      try {
        const response = await generateInterviewQuestions(InputPrompt)
        
        // Log the response to console only
        console.log('Generated interview questions:', response);
        
        // Save to database via API route
        if (response && user.user?.primaryEmailAddress?.emailAddress) {
          try {
            const fetchResponse = await fetch('/api/interviews', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                interviewQuestions: response,
                jobPosition: JobPosition,
                jobDescription: JobDescription,
                jobExperience: Jobexperience,
                userEmail: user.user.primaryEmailAddress.emailAddress,
              }),
            });
            
            if (!fetchResponse.ok) {
              // Try to read server error for better diagnostics
              const errorText = await fetchResponse.text();
              console.error(`Save failed (${fetchResponse.status}): ${errorText || fetchResponse.statusText}`);
            } else {
              const result = await fetchResponse.json();
              if (result.success && result.data && result.data.id) {
                console.log('Interview saved successfully:', result.data);
                // No redirect - just close the dialog
              } else {
                console.error('Failed to save interview:', result.error || 'No interview ID returned');
              }
            }
          } catch (dbError) {
            console.error('Error saving to database:', dbError);
          }
        }
        
        setopenDaoilog(false)
      } catch (error) {
        console.error('Error generating interview questions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    return (
      <div>
          <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
          onClick={() => setopenDaoilog(true)}>
              <h2 className='text-lg  text-center'>+ Add New</h2>
          </div>
          <Dialog open={openDailog} onOpenChange={setopenDaoilog}>
            <DialogContent className="border border-indigo-400 bg-indigo-50 text-indigo-800 p-8 rounded-2xl shadow-2xl max-w-xl w-full relative">
              <DialogClose asChild>
                <button className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600 text-xl font-bold" aria-label="Close">
                  <span aria-hidden>×</span>
                </button>
              </DialogClose>
              <form onSubmit={onSubmit}>
              <div>
                <DialogTitle className="font-bold text-2xl mb-1 text-indigo-800">Tell us more about your job interviewing</DialogTitle>
                <DialogDescription className="text-indigo-700 mb-6">
                  Add Details about your job position/role, Job description and years of experience
                </DialogDescription>
                <div className='mb-4'>
                  <label className="block mb-1 font-medium text-indigo-800">Job Role/Job Position</label>
                  <input 
                    className="border border-indigo-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-indigo-100 text-indigo-900 placeholder-indigo-400" 
                    placeholder="Ex. Full Stack Developer" 
                    required 
                    value={JobPosition || ''}
                    onChange={(event)=>setJobPosition(event.target.value)}
                  />
                </div>
                <div className='mb-4'>
                  <label className="block mb-1 font-medium text-indigo-800">Job Description/Tech Stack (in Short)</label>
                  <textarea 
                    className="border border-indigo-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-indigo-100 text-indigo-900 placeholder-indigo-400" 
                    placeholder="Ex. React, Angular, NodeJs, MySql etc"
                    required 
                    value={JobDescription || ''}
                    onChange={(event)=>setJobDescription(event.target.value)}
                  />
                </div>
                <div className='mb-6'>
                  <label className="block mb-1 font-medium text-indigo-800">Years of experience</label>
                  <input 
                    className="border border-indigo-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-indigo-100 text-indigo-900 placeholder-indigo-400" 
                    placeholder="Ex.2" 
                    type="number" 
                    max="50" 
                    required 
                    value={Jobexperience || ''}
                    onChange={(event)=>setJobexperience(event.target.value)}
                  />
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button variant="ghost" className="text-indigo-700 border-indigo-300 hover:bg-indigo-100" type = "button" onClick={() => setopenDaoilog(false)} disabled={isLoading}>Cancel</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" type = "submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Start Interview'}
                  </Button>
                </div>
              </div>
              </form>
            </DialogContent>
          </Dialog>
      </div>
    )
}
export default AddNewInterview
