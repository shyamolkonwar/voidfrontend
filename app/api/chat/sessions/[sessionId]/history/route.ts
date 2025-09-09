import { NextRequest, NextResponse } from 'next/server';
import { SessionHistoryResponse, ApiError } from '../../../../../../types/api';

const BACKEND_URL = process.env.BACKEND_URL || 'https://void.fusionfocus.icu';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  try {

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Session ID is required', statusCode: 400 },
        { status: 400 }
      );
    }

    // Check authentication
    const authHeader = request.headers.get('authorization');
    
    // Get session history from backend with authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/sessions/${sessionId}/history`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Backend Error', 
          message: errorData.detail || 'Failed to fetch session history', 
          statusCode: response.status 
        },
        { status: response.status }
      );
    }

    const data: SessionHistoryResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching session history:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch session history', statusCode: 500 },
      { status: 500 }
    );
  }
}