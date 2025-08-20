import { NextResponse } from 'next/server';
import GmailService from '../../../utils/gmailService';
import { google } from 'googleapis';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'has:attachment filename:mp3 OR filename:wav OR filename:webm';
    
    // For demo purposes, we'll use mock data
    // In production, you would implement OAuth2 flow for Gmail API
    const mockRecordings = [
      {
        id: 'msg_123456789',
        threadId: 'thread_123456789',
        subject: 'Interview Recording - Senior React Developer',
        date: '2024-01-15T10:30:00Z',
        attachments: [
          {
            filename: 'interview_recording.webm',
            mimeType: 'audio/webm',
            size: 2048576
          }
        ]
      },
      {
        id: 'msg_987654321',
        threadId: 'thread_987654321',
        subject: 'Technical Interview - Backend Developer',
        date: '2024-01-14T14:45:00Z',
        attachments: [
          {
            filename: 'technical_interview.mp3',
            mimeType: 'audio/mpeg',
            size: 3145728
          }
        ]
      }
    ];

    console.log('=== GMAIL RECORDINGS JSON ===');
    console.log(JSON.stringify(mockRecordings, null, 2));

    return NextResponse.json({ 
      success: true,
      data: mockRecordings,
      message: 'Gmail recordings retrieved successfully',
      note: 'This is mock data. Implement OAuth2 flow for real Gmail API access.'
    });
  } catch (error) {
    console.error('Error fetching Gmail recordings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messageId, attachmentId } = body;

    console.log('=== DOWNLOADING GMAIL ATTACHMENT ===');
    console.log(JSON.stringify({ messageId, attachmentId }, null, 2));

    // Mock download response
    const mockDownload = {
      data: 'base64_encoded_audio_data',
      filename: 'downloaded_recording.webm',
      size: 2048576
    };

    console.log('=== DOWNLOADED ATTACHMENT JSON ===');
    console.log(JSON.stringify(mockDownload, null, 2));

    return NextResponse.json({ 
      success: true,
      data: mockDownload,
      message: 'Attachment downloaded successfully'
    });
  } catch (error) {
    console.error('Error downloading attachment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
