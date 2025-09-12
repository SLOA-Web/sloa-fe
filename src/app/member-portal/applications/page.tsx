"use client";
import React, { useState, useEffect, useCallback, JSX } from 'react';
import { useRouter } from 'next/navigation';
import MembershipApplicationForm from '@/components/MembershipApplicationForm';
import {
  Crown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  RefreshCw,
  FileText,
  CreditCard,
  ArrowRight
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
  documents: string[] | null;
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
  role?: 'consultant' | 'trainee';
  membershipType?: 'consultant' | 'trainee';
  documents: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  expiryDate?: string | null;
  lastRenewalReminderAt?: string | null;
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

const InfoField: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <p className="text-foreground font-medium capitalize">{value ?? '—'}</p>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const key = (status || '').toLowerCase();
  const statusConfig: Record<string, { icon: JSX.Element; text: string; bg: string; textColor: string }> = {
    approved: { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: 'Active', bg: 'bg-green-100', textColor: 'text-green-800' },
    active:   { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: 'Active', bg: 'bg-green-100', textColor: 'text-green-800' },
    pending:  { icon: <Clock className="h-4 w-4 text-yellow-600" />, text: 'Pending', bg: 'bg-yellow-100', textColor: 'text-yellow-800' },
    rejected: { icon: <XCircle className="h-4 w-4 text-red-600" />, text: 'Rejected', bg: 'bg-red-100', textColor: 'text-red-800' },
    inactive: { icon: <AlertCircle className="h-4 w-4 text-gray-600" />, text: 'Inactive', bg: 'bg-gray-100', textColor: 'text-gray-800' },
    suspended:{ icon: <XCircle className="h-4 w-4 text-red-600" />, text: 'Suspended', bg: 'bg-red-100', textColor: 'text-red-800' },
  };
  const config = statusConfig[key] || { icon: <AlertCircle className="h-4 w-4 text-gray-600" />, text: 'Unknown', bg: 'bg-gray-100', textColor: 'text-gray-800' };

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
  const [showForm, setShowForm] = useState(false);
  const [showReapply, setShowReapply] = useState(false);

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
    <div className="py-6">
      <div className="text-center py-10 bg-card border border-border rounded-lg mb-6">
        <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Membership Journey</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          It looks like you haven&apos;t applied for a membership yet. Join our community to unlock exclusive benefits.
        </p>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          {showForm ? 'Continue Below' : 'Start Application'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <MembershipApplicationForm 
            onSubmitted={() => {
              // Hide form and refresh membership details
              setShowForm(false);
              setLoading(true);
              fetchMembership();
            }}
          />
        </div>
      )}
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
              <StatusBadge status={membership.user?.status || membership.status} />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Membership Type" value={membership.membershipType || '—'} />
              <InfoField label="Applied Date" value={new Date(membership.appliedAt).toLocaleDateString()} />
              {membership.approvedAt && <InfoField label="Approved Date" value={new Date(membership.approvedAt).toLocaleDateString()} />}
              {membership.expiryDate && <InfoField label="Expiry Date" value={new Date(membership.expiryDate).toLocaleDateString()} />}
            </div>
          </InfoCard>

          {/* Payment Required Tile */}
          {membership.status === 'approved' && membership.user?.status === 'pending' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Required</h3>
                  <p className="text-blue-700 mb-4">
                    Congratulations! Your membership application has been approved. To complete your registration and activate your membership, please proceed with the payment.
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      onClick={() => router.push('/member-portal/payments')}
                    >
                      <CreditCard className="h-4 w-4" />
                      Make Payment
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <InfoCard title="Profile Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Full Name" value={membership.user?.fullName ?? null} />
              <InfoField label="Email" value={membership.user?.email ?? null} />
              <InfoField label="NIC" value={membership.user?.profile?.nic ?? null} />
              <InfoField label="Specialization" value={membership.user?.profile?.specialization ?? null} />
              <InfoField label="Hospital" value={membership.user?.profile?.hospital ?? null} />
              <InfoField label="Location" value={membership.user?.location ?? null} />
            </div>
          </InfoCard>

          <InfoCard title="Documents">
            <div className="space-y-3">
              {(() => { const docs = Array.isArray(membership.documents) ? membership.documents : []; return docs.length > 0 ? (
                docs.map((doc, index) => (
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
              ); })()}
            </div>
          </InfoCard>
          {membership.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-red-800 font-semibold mb-1">Application Rejected</h4>
                  <p className="text-red-700 text-sm">Rejection Reason : {membership.rejectionReason || 'Your application was rejected. Please review and submit again.'}</p>
                  <div className="mt-3">
                    <button
                      onClick={() => setShowReapply(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Reapply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {membership.status === 'rejected' && showReapply && (
          <div className="bg-card border border-border rounded-lg p-6">
            <MembershipApplicationForm 
              onSubmitted={() => {
                setShowReapply(false);
                setLoading(true);
                fetchMembership();
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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
