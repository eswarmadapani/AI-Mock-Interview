import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'API routes are working',
    timestamp: new Date().toISOString(),
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasPublicDbUrl: !!process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
    }
  });
}
