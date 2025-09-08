import { QueryRequest, QueryResponse, SessionCreateResponse, SessionListResponse, SessionHistoryResponse, ApiError, SignUpRequest, LoginRequest, AuthResponse, UserInfo } from '../types/api';

const API_BASE = '/api';

export class ApiClient {
  static async sendQuery(request: QueryRequest, token?: string): Promise<QueryResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (response.status === 403) {
      throw new Error('Please log in to continue chatting');
    }

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to send query');
    }

    return response.json();
  }

  static async createSession(token?: string): Promise<SessionCreateResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/chat/sessions`, {
      method: 'POST',
      headers,
    });

    if (response.status === 403) {
      throw new Error('Please log in to create a new chat session');
    }

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to create session');
    }

    return response.json();
  }

  static async getSessions(token?: string): Promise<SessionListResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/chat/sessions`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to fetch sessions');
    }

    return response.json();
  }

  static async getSessionHistory(sessionId: string, token?: string): Promise<SessionHistoryResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}/history`, {
      method: 'GET',
      headers,
    });

    if (response.status === 403) {
      throw new Error('Please log in to view chat history');
    }

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to fetch session history');
    }

    return response.json();
  }

  static async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://13.49.148.204:8001'}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  static async signup(request: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://13.49.148.204:8001'}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to sign up');
    }

    return response.json();
  }

  static async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://13.49.148.204:8001'}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    return response.json();
  }

  static async getCurrentUser(token: string): Promise<UserInfo> {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://13.49.148.204:8001'}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to get user info');
    }

    return response.json();
  }

  static async logout(token: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://13.49.148.204:8001'}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to logout');
    }

    return response.json();
  }
}