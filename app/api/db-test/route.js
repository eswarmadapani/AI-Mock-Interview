import { NextResponse } from 'next/server';
import { db } from '../../../utils/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Check if database URL is available
    const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;
    console.log('Database URL available:', !!dbUrl);
    
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: 'Database URL not found',
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasPublicDbUrl: !!process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
        }
      });
    }

    // Try a simple query to test the connection
    const result = await db.execute('SELECT 1 as test');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      result: result,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasPublicDbUrl: !!process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasPublicDbUrl: !!process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
      }
    }, { status: 500 });
  }
}
