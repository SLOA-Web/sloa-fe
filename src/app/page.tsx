"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, FileText, BarChart2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

const HomePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await api.post('/api/v1/auth/logout', {});
      logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
      // Still log out on the frontend even if the API call fails
      logout();
      router.push('/login');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container max-w-5xl px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <User className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">{user?.fullName}</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="container max-w-5xl p-4 mx-auto mt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/apply" className="block p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <FileText className="w-12 h-12 mx-auto text-blue-600" />
              <h3 className="mt-4 text-lg font-semibold">Apply for Membership</h3>
              <p className="mt-1 text-sm text-gray-600">Complete your application to become a member.</p>
          </Link>
          <Link href="/application-status" className="block p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <BarChart2 className="w-12 h-12 mx-auto text-blue-600" />
              <h3 className="mt-4 text-lg font-semibold">Check Status</h3>
              <p className="mt-1 text-sm text-gray-600">View the current status of your application.</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
