'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong!</h1>
          <p className="text-gray-600 mb-8">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={reset}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          
          <Link 
            href="/"
            className="btn btn-outline w-full flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
