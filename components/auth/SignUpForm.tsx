'use client';

import React, { useState } from 'react';
import { ApiClient } from '../../lib/api';
import { authStorage } from '../../lib/storage';

interface SignUpFormProps {
  onSuccess: () => void;
  onToggleMode: () => void;
}

export default function SignUpForm({ onSuccess, onToggleMode }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await ApiClient.signup({ email, password });
      
      if (response.success && response.session && response.user) {
        authStorage.setToken(response.session.access_token);
        authStorage.setUser(response.user);
        onSuccess();
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-signup" className="block text-sm font-medium text-white">
            Email
          </label>
          <input
            id="email-signup"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password-signup" className="block text-sm font-medium text-white">
            Password
          </label>
          <input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40"
            placeholder="Enter your password"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40"
            placeholder="Confirm your password"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-white/20 rounded-md text-sm font-medium text-white bg-black hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}