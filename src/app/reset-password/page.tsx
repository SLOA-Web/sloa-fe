"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import api from '@/utils/api';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await api.post('/api/v1/auth/reset-password', { email });
      setMessage(response.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String((err as { message?: unknown }).message));
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Reset Your Password</h2>
          <p className="mt-4 text-base text-gray-600">
            Enter your email address below and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 text-sm text-center text-red-700 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 text-sm text-center text-green-700 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              {message}
            </div>
          )}
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 -translate-y-1/2" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          Remember your password?{' '}
          <Link href="/login" passHref className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
