import { NextResponse } from 'next/server';
import { db } from '../../../utils/db';
import { UserAnswers } from '../../../utils/schema';

export async function GET() {
  try {
    // Demo endpoint to show all functionality
    const demoData = {
      gmailRecordings: [
        {
          id: 'msg_123456789',
          subject: 'Interview Recording - Senior React Developer',
          date: '2024-01-15T10:30:00Z',
          attachments: [
            {
              filename: 'interview_recording.webm',
              size: '2.0 MB'
            }
          ]
        }
      ],
      userAnswers: await db.select().from(UserAnswers),
      geminiResponses: [
        {
          question: "Describe your experience with React.js",
          userAnswer: "I have 3 years of experience building React applications...",
          feedback: {
            rating: 8.5,
            feedback: "Good answer! You demonstrated solid understanding...",
            suggestions: ["Add more specific examples", "Mention performance optimizations"]
          }
        }
      ]
    };

    console.log('=== DEMO DATA JSON ===');
    console.log(JSON.stringify(demoData, null, 2));

    return NextResponse.json({
      success: true,
      data: demoData,
      message: 'Demo data retrieved successfully',
      endpoints: {
        gmailRecordings: '/api/gmail-recordings',
        userAnswers: '/api/user-answers',
        interviews: '/api/interviews'
      }
    });
  } catch (error) {
    console.error('Error in demo endpoint:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
