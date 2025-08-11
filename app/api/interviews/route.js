import { NextResponse } from 'next/server';
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';

export async function GET() {
  try {
    const allInterviews = await db.select().from(MockInterview);
    return NextResponse.json({ 
      success: true,
      data: allInterviews,
      message: 'Interviews retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('API route called - saving interview');
    
    const body = await request.json();
    console.log('Request body received:', body);

    // Validate required fields
    if (!body.jobPosition || !body.jobDescription || !body.jobExperience || !body.userEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const newInterview = await db.insert(MockInterview).values({
      mockId: `mock_${Date.now()}`, // Generate a unique mock ID
      jsonMockResp: JSON.stringify(body.interviewQuestions),
      jobPosition: body.jobPosition,
      jobDesc: body.jobDescription,
      jobExperience: body.jobExperience,
      createdBy: body.userEmail,
      createdAt: new Date().toISOString()
    }).returning();

    console.log('Interview saved successfully:', newInterview);

    return NextResponse.json({ 
      success: true, 
      message: 'Interview saved successfully',
      data: newInterview[0] // Return the saved interview with its ID
    });
  } catch (error) {
    console.error('Error in API route:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message, details: error.stack },
      { status: 500 }
    );
  }
}
