import { NextRequest, NextResponse } from 'next/server';
import { SessionCreateResponse, SessionListResponse, ApiError } from '../../../../types/api';

const BACKEND_URL = process.env.BACKEND_URL || 'https://void.fusionfocus.icu';

export async function POST(request: NextRequest) {
  try {
    // Create new session in backend
    const response = await fetch(`${BACKEND_URL}/api/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Backend Error', 
          message: errorData.detail || 'Failed to create session', 
          statusCode: response.status 
        },
        { status: response.status }
      );
    }

    const data: SessionCreateResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create session', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    
    // Get all sessions from backend
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/v1/sessions`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Backend Error', 
          message: errorData.detail || 'Failed to fetch sessions', 
          statusCode: response.status 
        },
        { status: response.status }
      );
    }

    const data: SessionListResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch sessions', statusCode: 500 },
      { status: 500 }
    );
  }
}