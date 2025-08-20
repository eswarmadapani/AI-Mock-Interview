"use client"
import React, { useEffect } from 'react'  
import { useState } from 'react';
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { desc, eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import Interviewitems from './Interviewitems';

function InterviewList() {

    const {user} = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() =>{
        user&&GetInterviewList()
    },[user])
    const GetInterviewList = async()=>{
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.createdAt));
            console.log(result);
            
            if (result.length === 0) {
                // Add mock data if no interviews exist (for testing purposes)
                const mockData = [
                    {
                        id: 1,
                        mockId: 'mock_demo_1',
                        jobPosition: 'Full Stack Angular Developer',
                        jobDesc: 'Angular, Node.js, MongoDB development',
                        jobExperience: '3',
                        createdAt: '2024-06-2024'
                    },
                    {
                        id: 2,
                        mockId: 'mock_demo_2',
                        jobPosition: 'Full Stack Developer',
                        jobDesc: 'React, Express.js, PostgreSQL development',
                        jobExperience: '4',
                        createdAt: '2024-06-2024'
                    }
                ];
                setInterviewList(mockData);
            } else {
                setInterviewList(result);
            }
        } catch (error) {
            console.error('Error fetching interview list:', error);
            // Show mock data on error for now
            const mockData = [
                {
                    id: 1,
                    mockId: 'mock_demo_1',
                    jobPosition: 'Full Stack Angular Developer',
                    jobDesc: 'Angular, Node.js, MongoDB development',
                    jobExperience: '3',
                    createdAt: '2024-06-2024'
                },
                {
                    id: 2,
                    mockId: 'mock_demo_2',
                    jobPosition: 'Full Stack Developer',
                    jobDesc: 'React, Express.js, PostgreSQL development',
                    jobExperience: '4',
                    createdAt: '2024-06-2024'
                }
            ];
            setInterviewList(mockData);
        }
    }

    const handleDeleteInterview = (mockId) => {
        setInterviewList(prev => prev.filter(interview => interview.mockId !== mockId));
    }
    return (

        <div>
            <h2 className='font-medium text-xl mb-5 dark:text-slate-100'>Previous Mock Interview</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {interviewList.map((interview,index)=>(
                    <Interviewitems 
                        key={interview.id} 
                        interview={interview}
                        onDelete={handleDeleteInterview}
                    />
                ))}
            </div>
        </div>
    );
}

export default InterviewList;

