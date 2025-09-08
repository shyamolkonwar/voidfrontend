// Storage utility for Next.js compatibility
import { UserInfo } from '../types/api';
export const sessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(key);
    }
  },
};

// Authentication storage
export const authStorage = {
  getToken: (): string | null => {
    return sessionStorage.getItem('auth_token');
  },
  
  setToken: (token: string): void => {
    sessionStorage.setItem('auth_token', token);
  },
  
  removeToken: (): void => {
    sessionStorage.removeItem('auth_token');
  },
  
  getUser: (): UserInfo | null => {
    const userStr = sessionStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },
  
  setUser: (user: UserInfo): void => {
    sessionStorage.setItem('auth_user', JSON.stringify(user));
  },
  
  removeUser: (): void => {
    sessionStorage.removeItem('auth_user');
  },
  
  isAuthenticated: (): boolean => {
    return !!authStorage.getToken();
  },
  
  clearAuth: (): void => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};