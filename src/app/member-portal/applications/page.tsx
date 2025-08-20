"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

const MembershipsPage = () => {
  const router = useRouter();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMembership = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/membership/my-application') as { application: Membership };
      setMembership(response.application);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = handleApiError(err, router);
      setError(errorMessage);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Memberships</h2>
          <p className="text-muted-foreground mt-1">
            View your membership status and application details
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
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
      ) : membership ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Membership Status Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Membership Status</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(membership.status)}
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    membership.status === 'approved' ? 'bg-green-100 text-green-800' :
                    membership.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {membership.status === 'approved' ? 'Active' : 
                     membership.status === 'pending' ? 'Pending' : 'Rejected'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <p className="text-foreground font-medium capitalize">{membership.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                  <p className="text-foreground font-medium">
                    {new Date(membership.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                {membership.approvedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Approved Date</label>
                    <p className="text-foreground font-medium">
                      {new Date(membership.approvedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {membership.expiryDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                    <p className="text-foreground font-medium">
                      {new Date(membership.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-foreground font-medium">{membership.user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground font-medium">{membership.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NIC</label>
                  <p className="text-foreground font-medium">{membership.user.profile.nic}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p className="text-foreground font-medium">{membership.user.profile.specialization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hospital</label>
                  <p className="text-foreground font-medium">{membership.user.profile.hospital}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-foreground font-medium capitalize">{membership.user.location}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Documents</h3>
              <div className="space-y-3">
                {membership.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Document {index + 1}</span>
                    </div>
                    <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                      Download
                    </button>
                  </div>
                ))}
                {membership.documents.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Renew Membership
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <FileText className="h-4 w-4" />
                  Update Documents
                </button>
              </div>
            </div>

            {/* Membership Benefits */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Membership Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Access to exclusive events</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Professional development resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Networking opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Research collaboration</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Continuing education credits</span>
                </div>
              </div>
            </div>

            {/* Membership Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Membership Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(membership.appliedAt).getFullYear()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    membership.status === 'approved' ? 'bg-green-100 text-green-800' :
                    membership.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {membership.status === 'approved' ? 'Active' : 
                     membership.status === 'pending' ? 'Pending' : 'Rejected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documents</span>
                  <span className="text-sm font-medium text-foreground">{membership.documents.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Membership Found</h3>
          <p className="text-muted-foreground mb-4">You haven&apos;t applied for membership yet.</p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MembershipsPage;
