"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MembershipApplicationModal from '@/components/MembershipApplicationModal';
import { 
  Crown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  User,
  RefreshCw,
  FileText
} from 'lucide-react';
import api from '@/utils/api';
import { handleApiError } from '@/utils/errorHandler';

// --- Type Definitions ---
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

interface Membership {
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

interface ApiResponse {
  application: Membership;
}

// --- Helper Components ---
const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-card border border-border rounded-lg p-6">
    <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <p className="text-foreground font-medium capitalize">{value}</p>
  </div>
);

const StatusBadge: React.FC<{ status: Membership['status'] }> = ({ status }) => {
  const statusConfig = {
    approved: { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: 'Active', bg: 'bg-green-100', textColor: 'text-green-800' },
    pending: { icon: <Clock className="h-4 w-4 text-yellow-600" />, text: 'Pending', bg: 'bg-yellow-100', textColor: 'text-yellow-800' },
    rejected: { icon: <XCircle className="h-4 w-4 text-red-600" />, text: 'Rejected', bg: 'bg-red-100', textColor: 'text-red-800' },
  };
  const config = statusConfig[status] || { icon: <AlertCircle className="h-4 w-4 text-gray-600" />, text: 'Unknown', bg: 'bg-gray-100', textColor: 'text-gray-800' };

  return (
    <div className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${config.bg} ${config.textColor}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

// --- Main Page Component ---
const MembershipsPage = () => {
  const router = useRouter();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMembership = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse>('/api/v1/membership/my-application');
      setMembership(response.application);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = handleApiError(err, router);
      // If no application is found, API might return 404, which handleApiError might interpret as an error.
      // We'll specifically check for "not found" cases if the API behaves that way.
      if (errorMessage.toLowerCase().includes('not found')) {
        setMembership(null);
        setError(null);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMembership();
  };

  // --- Render Methods ---
  const renderLoading = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const renderError = () => (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Membership</h3>
      <p className="text-destructive/80 mb-4">{error}</p>
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderNoMembership = () => (
    <div className="text-center py-12 bg-card border border-border rounded-lg">
      <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Membership Journey</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        It looks like you haven't applied for a membership yet. Join our community to unlock exclusive benefits.
      </p>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
      >
        Apply for Membership
      </button>
    </div>
  );

  const renderMembershipDetails = () => {
    if (!membership) return null;
    return (
      <div className="space-y-6">
        <div className="space-y-6">
          <InfoCard title="Membership Status">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Current Status</h4>
              <StatusBadge status={membership.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Role" value={membership.role} />
              <InfoField label="Applied Date" value={new Date(membership.appliedAt).toLocaleDateString()} />
              {membership.approvedAt && <InfoField label="Approved Date" value={new Date(membership.approvedAt).toLocaleDateString()} />}
              {membership.expiryDate && <InfoField label="Expiry Date" value={new Date(membership.expiryDate).toLocaleDateString()} />}
            </div>
          </InfoCard>

          <InfoCard title="Profile Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Full Name" value={membership.user.fullName} />
              <InfoField label="Email" value={membership.user.email} />
              <InfoField label="NIC" value={membership.user.profile.nic} />
              <InfoField label="Specialization" value={membership.user.profile.specialization} />
              <InfoField label="Hospital" value={membership.user.profile.hospital} />
              <InfoField label="Location" value={membership.user.location} />
            </div>
          </InfoCard>

          <InfoCard title="Documents">
            <div className="space-y-3">
              {membership.documents.length > 0 ? (
                membership.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Document {index + 1}</span>
                    </div>
                    <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                      Download
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No documents uploaded</p>
              )}
            </div>
          </InfoCard>
        </div>
      </div>
    );
  };

  return (
    <>
      <MembershipApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Membership</h2>
          <p className="text-muted-foreground mt-1">
            View your membership status and application details.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? renderLoading() : error ? renderError() : membership ? renderMembershipDetails() : renderNoMembership()}
      </div>
    </>
  );
};

export default MembershipsPage;
