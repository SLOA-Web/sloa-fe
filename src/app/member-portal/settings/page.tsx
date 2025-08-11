'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Shield, 
  Bell, 
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
  Smartphone as Phone,
  Palette,
  Volume2,
  VolumeX
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

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
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    
    // Appearance settings
    theme: 'system',
    compactMode: false,
    showAvatars: true,
    
    // Privacy settings
    profileVisibility: 'members',
    showOnlineStatus: true,
    allowMessages: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'privacy', name: 'Privacy', icon: Eye }
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

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Preferences</h3>
          <p className="card-description">Customize your experience</p>
        </div>
        <div className="card-content space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="input mt-1"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="input mt-1"
            >
              <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
              <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
              <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
              <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
            </select>
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
          <div>
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Enter current password"
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
          <button className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Update Password
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Security Features</h3>
          <p className="card-description">Manage your account security settings</p>
        </div>
        <div className="card-content space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Login Notifications</h4>
              <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
            </div>
            <button
              onClick={() => handleSettingChange('loginNotifications', !settings.loginNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.loginNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Session Timeout</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              className="input mt-1"
            >
              <option value="1 hour">1 hour</option>
              <option value="8 hours">8 hours</option>
              <option value="24 hours">24 hours</option>
              <option value="7 days">7 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Notification Preferences</h3>
          <p className="card-description">Choose how you want to receive notifications</p>
        </div>
        <div className="card-content space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-foreground">SMS Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('smsNotifications', !settings.smsNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.smsNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Marketing Emails</h4>
                <p className="text-sm text-muted-foreground">Receive promotional and marketing emails</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('marketingEmails', !settings.marketingEmails)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.marketingEmails ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Theme Settings</h3>
          <p className="card-description">Customize the appearance of your interface</p>
        </div>
        <div className="card-content space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Theme</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor }
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange('theme', theme.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      settings.theme === theme.value
                        ? 'border-primary bg-blue-50'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Compact Mode</h4>
              <p className="text-sm text-muted-foreground">Use a more compact layout</p>
            </div>
            <button
              onClick={() => handleSettingChange('compactMode', !settings.compactMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.compactMode ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Show Avatars</h4>
              <p className="text-sm text-muted-foreground">Display user avatars throughout the interface</p>
            </div>
            <button
              onClick={() => handleSettingChange('showAvatars', !settings.showAvatars)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showAvatars ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showAvatars ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Privacy Settings</h3>
          <p className="card-description">Control who can see your information</p>
        </div>
        <div className="card-content space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Profile Visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="input mt-1"
            >
              <option value="public">Public</option>
              <option value="members">Members Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Show Online Status</h4>
              <p className="text-sm text-muted-foreground">Let others see when you're online</p>
            </div>
            <button
              onClick={() => handleSettingChange('showOnlineStatus', !settings.showOnlineStatus)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showOnlineStatus ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Allow Messages</h4>
              <p className="text-sm text-muted-foreground">Allow other members to send you messages</p>
            </div>
            <button
              onClick={() => handleSettingChange('allowMessages', !settings.allowMessages)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowMessages ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowMessages ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
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
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'privacy':
        return renderPrivacySettings();
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
