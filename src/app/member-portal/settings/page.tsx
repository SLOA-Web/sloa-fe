'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  User, 
  Shield, 
  Eye, 
  EyeOff,
  Lock,
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Save,
  Check,
  AlertTriangle,
  Key,
  Smartphone as Phone
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  
  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [settings, setSettings] = useState({
    // Account settings
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    language: 'English',
    timezone: 'UTC-8 (Pacific Time)',
    
    // Security settings
    twoFactorAuth: true,
    loginNotifications: true,
    sessionTimeout: '24 hours',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordUpdate = async () => {
    // Clear previous messages
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    if (!user?.email) {
      setPasswordError('User email not found. Please log in again.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Call the API to update password
      const requestBody = {
        currentPassword,
        newPassword
      };
      
      console.log('Sending password update request:', requestBody);
      
      await api.post('/api/v1/auth/change-password', requestBody);

      setPasswordSuccess('Password updated successfully!');
      
      // Clear the form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err: any) {
      // Handle specific error cases
      if (err.message.includes('404') || err.message.includes('Not Found')) {
        setPasswordError('Password update endpoint not available yet. Please contact support.');
      } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setPasswordError('Current password is incorrect. Please try again.');
      } else {
        setPasswordError(err.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const renderAccountSettings = () => (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Basic Information</h3>
          <p className="card-description">Update your account details</p>
        </div>
        <div className="card-content space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              className="input mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleSettingChange('phone', e.target.value)}
              className="input mt-1"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Change Password</h3>
          <p className="card-description">Update your password to keep your account secure</p>
        </div>
        <div className="card-content space-y-4">
          {/* Error and Success Messages */}
          {passwordError && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 text-sm text-center text-green-800 bg-green-100 border border-green-200 rounded-lg">
              {passwordSuccess}
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">New Password</label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Confirm New Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            className={`
              btn btn-primary
              flex items-center justify-center
              px-5 py-2
              rounded-lg
              font-semibold
              transition-colors
              duration-150
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-primary/50
              disabled:opacity-60 disabled:cursor-not-allowed
              mt-4
            `}
            onClick={handlePasswordUpdate}
            disabled={isUpdatingPassword}
            type="button"
          >
            {isUpdatingPassword ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="font-medium">Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span className="font-medium">Update Password</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );


  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-content p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
