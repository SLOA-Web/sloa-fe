'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Activity,
  Award,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Share2
} from 'lucide-react';

const MemberPortalPage = () => {
  const { user } = useAuth();

  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Applications',
      value: '3',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      description: 'Total applications submitted'
    },
    {
      title: 'Active Status',
      value: 'Active',
      change: 'Current',
      changeType: 'neutral',
      icon: CheckCircle,
      description: 'Your membership status'
    },
    {
      title: 'Days Remaining',
      value: '245',
      change: '-5 days',
      changeType: 'negative',
      icon: Calendar,
      description: 'Until next renewal'
    },
    {
      title: 'Last Login',
      value: '2 hours ago',
      change: 'Online',
      changeType: 'positive',
      icon: Clock,
      description: 'Your recent activity'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      title: 'Application submitted',
      description: 'Your application for membership has been submitted successfully',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'profile',
      title: 'Profile updated',
      description: 'You updated your contact information',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'notification',
      title: 'New notification',
      description: 'You have a new message from the admin team',
      time: '3 days ago',
      status: 'unread'
    }
  ];

  const quickActions = [
    {
      title: 'View Profile',
      description: 'Update your personal information',
      icon: User,
      href: '/member-portal/profile',
      color: 'bg-blue-500'
    },
    {
      title: 'My Applications',
      description: 'Check your application status',
      icon: FileText,
      href: '/member-portal/applications',
      color: 'bg-green-500'
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: Activity,
      href: '/member-portal/settings',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Welcome Section */}
      <div className="card">
        <div className="card-header pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="card-title">Welcome back, {user?.fullName || 'Member'}! 👋</h1>
              <p className="card-description">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Membership Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Membership Status</h3>
            <p className="card-description">Your current membership details</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">January 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next Renewal</span>
                <span className="text-sm font-medium">December 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm font-medium">{user?.role || 'Member'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">


        {/* Recent Activity */}
        <div className="lg:col-span-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <p className="card-description">Your latest actions and updates</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors duration-200">
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'application' && <FileText className="h-4 w-4" />}
                      {activity.type === 'profile' && <User className="h-4 w-4" />}
                      {activity.type === 'notification' && <AlertCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      

    </div>
  );
};

export default MemberPortalPage;
