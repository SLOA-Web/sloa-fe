"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

const ApplicationStatusPage = () => {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      try {
        const data = await api.get('/api/v1/membership/status', accessToken);
        setStatus(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [router]);

  const renderStatus = () => {
    if (loading) {
      return <p>Loading your application status...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (!status) {
      return <p>Could not retrieve application status.</p>;
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Application Status: <span className="font-bold text-blue-600">{status.status}</span></h3>
        <p><strong>Full Name:</strong> {status.fullName}</p>
        <p><strong>Role:</strong> {status.role}</p>
        <p><strong>Application Date:</strong> {new Date(status.appliedAt).toLocaleDateString()}</p>
        {status.status === 'approved' && (
          <div className="p-4 mt-4 text-green-700 bg-green-100 border-l-4 border-green-500">
            <p className="font-bold">Congratulations!</p>
            <p>Your membership has been approved. Please proceed to payment to activate your account.</p>
            {/* Add a payment button here */}
          </div>
        )}
        {status.status === 'rejected' && (
          <div className="p-4 mt-4 text-red-700 bg-red-100 border-l-4 border-red-500">
            <p className="font-bold">We're sorry</p>
            <p>Your application has been rejected. Please contact support for more information.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Application Status</h2>
        {renderStatus()}
      </div>
    </div>
  );
};

export default ApplicationStatusPage;
