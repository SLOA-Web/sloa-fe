"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hourglass, CheckCircle, XCircle, HelpCircle, RefreshCw, Mail } from 'lucide-react';
import api from '@/utils/api';
import { handleApiError } from '@/utils/errorHandler';

const ApplicationStatusPage = () => {
  type StatusType = {
    status: string;
    fullName: string;
    role: string;
    createdAt: string;
  } | null;

  const [status, setStatus] = useState<StatusType>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.get('/api/v1/membership/status');
        setStatus(data as StatusType);
      } catch (err: unknown) {
        const errorMessage = handleApiError(err, router);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [router]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Hourglass className="w-16 h-16 text-yellow-500" />,
          title: 'Application Pending',
          message: 'Your application is currently under review. We will notify you once a decision has been made.',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
        };
      case 'active':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Membership Active',
          message: 'Congratulations! Your membership is active. Welcome to the community.',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
        };
      case 'expired':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Membership Expired',
          message: 'Your membership has expired. Please renew to regain access to member benefits.',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Application Rejected',
          message: 'We regret to inform you that your application was not approved at this time.',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
        };
      default:
        return {
          icon: <HelpCircle className="w-16 h-16 text-gray-500" />,
          title: 'No Application Found',
          message: "We couldn't find a membership application associated with your account.",
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
        };
    }
  };

  const renderStatus = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading Status...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      );
    }

    const statusInfo = getStatusInfo(status?.status ?? "");

    return (
      <div className={`p-8 text-center rounded-2xl ${statusInfo.bgColor} ${statusInfo.textColor}`}>
        <div className="flex justify-center mb-6">{statusInfo.icon}</div>
        <h3 className="text-2xl font-bold">{statusInfo.title}</h3>
        <p className="mt-2">{statusInfo.message}</p>
        
        {status && (
          <div className="mt-6 text-left border-t border-gray-300 pt-6">
            <p><strong>Full Name:</strong> {status.fullName}</p>
            <p><strong>Role:</strong> {status.role}</p>
            <p><strong>Application Date:</strong> {new Date(status.createdAt).toLocaleDateString()}</p>
          </div>
        )}

        <div className="mt-8 space-x-4">
          {status?.status === 'active' && (
            <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Renew Membership
            </button>
          )}
          {status?.status === 'rejected' && (
            <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">Your Membership Status</h2>
        <div className="mt-8">
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusPage;
