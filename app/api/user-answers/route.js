import { NextResponse } from 'next/server';
import { db } from '../../../utils/db';
import { UserAnswers } from '../../../utils/schema';
import { getAnswerFeedback } from '../../../utils/GeminiAi';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mockId = searchParams.get('mockId');
    
    let query = db.select().from(UserAnswers);
    
    if (mockId) {
      query = query.where(eq(UserAnswers.mockIdRef, mockId));
    }
    
    const answers = await query;
    
    // Log JSON response to console
    console.log('=== USER ANSWERS JSON ===');
    console.log(JSON.stringify(answers, null, 2));
    
    return NextResponse.json({ 
      success: true,
      data: answers,
      message: 'User answers retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user answers:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('=== RECEIVED USER ANSWER ===');
    console.log(JSON.stringify(body, null, 2));

    const { mockIdRef, question, userAnswer, audioUrl, videoUrl, gmailRecordingId } = body;

    console.log('=== VALIDATION CHECK ===');
    console.log('mockIdRef:', mockIdRef, 'type:', typeof mockIdRef);
    console.log('question:', question, 'type:', typeof question);
    console.log('userAnswer:', userAnswer, 'type:', typeof userAnswer);
    console.log('userAnswer length:', userAnswer?.length);

    // Validate required fields
    if (!mockIdRef || !question || !userAnswer || userAnswer.trim() === '') {
      return NextResponse.json(
        { success: false, error: `Missing required fields: mockIdRef=${!!mockIdRef}, question=${!!question}, userAnswer=${!!userAnswer && userAnswer.trim() !== ''}` },
        { status: 400 }
      );
    }

    // Get Gemini feedback
    console.log('=== GETTING GEMINI FEEDBACK ===');
    const feedback = await getAnswerFeedback(question, userAnswer);
    console.log('=== GEMINI RESPONSE JSON ===');
    console.log(JSON.stringify(feedback, null, 2));

    // Save to database
    const newAnswer = await db.insert(UserAnswers).values({
      mockIdRef,
      question,
      userAnswer,
      geminiFeedback: feedback.feedback,
      rating: feedback.rating,
      audioUrl,
      videoUrl,
      gmailRecordingId
    }).returning();

    console.log('=== SAVED USER ANSWER ===');
    console.log(JSON.stringify(newAnswer[0], null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'User answer saved successfully',
      data: newAnswer[0],
      feedback: feedback
    });
  } catch (error) {
    console.error('Error saving user answer:', error);
    return NextResponse.json(
      { success: false, error: error.message, details: error.stack },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Answer ID is required' },
        { status: 400 }
      );
    }

    const updatedAnswer = await db.update(UserAnswers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(UserAnswers.id.eq(id))
      .returning();

    console.log('=== UPDATED USER ANSWER ===');
    console.log(JSON.stringify(updatedAnswer[0], null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'User answer updated successfully',
      data: updatedAnswer[0]
    });
  } catch (error) {
    console.error('Error updating user answer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
