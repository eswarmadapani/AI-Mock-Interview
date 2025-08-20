import { NextResponse } from 'next/server';
import { db } from '../../../../utils/db';
import { MockInterview, UserAnswers } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request, { params }) {
  try {
    const mockId = params.mockId;
    
    if (!mockId) {
      return NextResponse.json(
        { success: false, error: 'Mock ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting interview with mockId:', mockId);

    // First delete all user answers associated with this mock interview
    await db.delete(UserAnswers).where(eq(UserAnswers.mockIdRef, mockId));
    
    // Then delete the mock interview itself
    const result = await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));
    
    console.log('Delete result:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
