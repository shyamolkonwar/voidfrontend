'use client';

import React from 'react';
import { UserInfo } from '../../types/api';
import { authStorage } from '../../lib/storage';

interface UserProfileProps {
  user: UserInfo;
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const handleLogout = () => {
    authStorage.clearAuth();
    onLogout();
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user.email}
          </p>
          <p className="text-xs text-gray-400">Logged in</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-3 w-full text-center text-sm text-red-400 hover:text-red-300 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}