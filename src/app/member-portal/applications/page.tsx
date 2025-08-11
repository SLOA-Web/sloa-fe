"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Calendar,
  User,
  Building,
  GraduationCap,
  MapPin,
  RefreshCw
} from 'lucide-react';
import api from '@/utils/api';

interface Application {
  id: string;
  userId: string;
  fullName: string;
  nic: string;
  specialization: string;
  hospital: string;
  role: 'consultant' | 'trainee';
  location: 'local' | 'foreign';
  cv?: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  membershipId?: string;
  expiryDate?: string;
  rejectionReason?: string;
}

const ApplicationsPage = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchApplication = async () => {
    try {
      const data = await api.get('/api/v1/membership/my-application');
      setApplication(data);
      setError(null);
    } catch (err: any) {
      if (err.message.includes('401')) {
        router.push('/login');
        return;
      }
      setError(err.message || 'Failed to fetch application details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [router]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplication();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadDocument = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-semibold text-red-800">Error Loading Application</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-blue-800">No Application Found</h2>
          </div>
          <p className="text-blue-700 mb-4">
            You haven't submitted a membership application yet. 
            Click the button below to start your application process.
          </p>
          <button
            onClick={() => router.push('/apply')}
            className="btn btn-primary"
          >
            Apply for Membership
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Application</h1>
          <p className="text-muted-foreground">View your membership application details and status</p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn btn-outline btn-sm"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status Card */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Application Status</h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)}
            <span className="text-sm font-medium">{getStatusText(application.status)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Applied:</span>
            <span className="font-medium">{formatDate(application.appliedAt)}</span>
          </div>
          
          {application.approvedAt && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Approved:</span>
              <span className="font-medium">{formatDate(application.approvedAt)}</span>
            </div>
          )}
          
          {application.rejectedAt && (
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-muted-foreground">Rejected:</span>
              <span className="font-medium">{formatDate(application.rejectedAt)}</span>
            </div>
          )}
          
          {application.membershipId && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Membership ID:</span>
              <span className="font-medium font-mono">{application.membershipId}</span>
            </div>
          )}
          
          {application.expiryDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground">Expires:</span>
              <span className="font-medium">{formatDate(application.expiryDate)}</span>
            </div>
          )}
        </div>

        {application.rejectionReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Rejection Reason</h3>
            <p className="text-red-700 text-sm">{application.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{application.fullName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">NIC Number</p>
              <p className="font-medium font-mono">{application.nic}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Specialization</p>
              <p className="font-medium">{application.specialization}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Hospital</p>
              <p className="font-medium">{application.hospital}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{application.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium capitalize">{application.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CV Section */}
      {application.cv && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Curriculum Vitae</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm whitespace-pre-wrap">{application.cv}</p>
          </div>
        </div>
      )}

      {/* Documents Section */}
      {application.documents && application.documents.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Supporting Documents</h2>
          <div className="space-y-2">
            {application.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Document {index + 1}
                  </span>
                </div>
                <button
                  onClick={() => downloadDocument(doc, `document-${index + 1}.pdf`)}
                  className="btn btn-outline btn-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {application.status === 'rejected' && (
          <button
            onClick={() => router.push('/apply')}
            className="btn btn-primary"
          >
            Reapply for Membership
          </button>
        )}
        
        {application.status === 'pending' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-800">Application Under Review</span>
            </div>
            <p className="text-sm text-blue-700">
              Your application is currently being reviewed by our team. 
              You will be notified once a decision has been made.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
