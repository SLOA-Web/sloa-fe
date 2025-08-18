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
import { handleApiError, isAuthError } from '@/utils/errorHandler';

interface UserProfile {
  id: string;
  userId: string;
  nic: string;
  specialization: string;
  hospital: string;
  cv?: string;
  guestReason?: string;
  documents: string[];
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  location: 'local' | 'foreign';
  membershipId?: string;
  profile: UserProfile;
}

interface Application {
  id: string;
  userId: string;
  role: 'consultant' | 'trainee';
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  expiryDate?: string;
  lastRenewalReminderAt?: string;
  user: User;
}

const ApplicationsPage = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchApplication = async () => {
    try {
      const response = await api.get('/api/v1/membership/my-application');
      setApplication(response.application);
      setError(null);
    } catch (err: any) {
      const errorMessage = handleApiError(err, router);
      setError(errorMessage);
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Loading Application</h2>
            <p className="text-muted-foreground">Please wait while we fetch your application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card p-8 bg-red-50 border-red-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Application</h2>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-md"
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="card p-8 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-900 mb-2">No Application Found</h2>
              <p className="text-blue-800">
                You haven't submitted a membership application yet. 
                Click the button below to start your application process.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/apply')}
            className="btn btn-primary btn-lg"
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
          
          {application.user.membershipId && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Membership ID:</span>
              <span className="font-medium font-mono">{application.user.membershipId}</span>
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


      </div>

      {/* Personal Information */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{application.user.fullName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">NIC Number</p>
              <p className="font-medium font-mono">{application.user.profile.nic}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Specialization</p>
              <p className="font-medium">{application.user.profile.specialization}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Hospital</p>
              <p className="font-medium">{application.user.profile.hospital}</p>
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
              <p className="font-medium capitalize">{application.user.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CV Section */}
      {application.user.profile.cv && (
        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-6">Curriculum Vitae</h2>
          <div className="bg-muted/30 rounded-lg p-6">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{application.user.profile.cv}</p>
          </div>
        </div>
      )}

      {/* Documents Section */}
      {application.documents && application.documents.length > 0 && (
        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-6">Supporting Documents</h2>
          <div className="space-y-4">
            {application.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium">
                    Document {index + 1}
                  </span>
                </div>
                <button
                  onClick={() => downloadDocument(doc, `document-${index + 1}.pdf`)}
                  className="btn btn-outline btn-md"
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
      <div className="space-y-6">
        {application.status === 'rejected' && (
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Application Rejected</h3>
                <p className="text-muted-foreground">Your application was not approved. You can reapply for membership.</p>
              </div>
              <button
                onClick={() => router.push('/apply')}
                className="btn btn-primary btn-lg"
              >
                Reapply for Membership
              </button>
            </div>
          </div>
        )}
        
        {application.status === 'pending' && (
          <div className="card p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Application Under Review</h3>
                <p className="text-blue-800">
                  Your application is currently being reviewed by our team. 
                  You will be notified once a decision has been made.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
