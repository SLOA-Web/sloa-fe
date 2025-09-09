'use client';
import Link from 'next/link';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full h-fit bg-white rounded-xl shadow-lg p-8 mt-12 text-center animate-fade-in">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-yellow-400" />
          </div>
          <div className="text-6xl font-extrabold text-primary mb-2 tracking-tight drop-shadow">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="space-y-4">
          <Link 
            href="/"
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-base font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-outline w-full flex items-center justify-center gap-2 py-3 text-base font-medium rounded-lg border border-gray-300 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
