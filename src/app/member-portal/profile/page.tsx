'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Save, 
  Edit3,
  X,
  Check,
  Shield,
  Briefcase,
  GraduationCap,
  Globe,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarEditing, setIsAvatarEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.user_metadata?.location || '',
    bio: 'Passionate member of SLOA with expertise in community development and leadership.', // This is a placeholder, as bio is not in the provided user data
    company: '', // Placeholder
    position: user?.user_metadata?.role || '',
    education: '', // Placeholder
    website: '', // Placeholder
    linkedin: '', // Placeholder
    twitter: '', // Placeholder
    github: '' // Placeholder
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/api/v1/auth/me');
        const fetchedUser = response.user; // Assuming the API returns { user: {...} }
        setFormData(prev => ({
          ...prev,
          fullName: fetchedUser?.user_metadata?.full_name || prev.fullName,
          email: fetchedUser?.email || prev.email,
          phone: fetchedUser?.phone || prev.phone,
          location: fetchedUser?.user_metadata?.location || prev.location,
          position: fetchedUser?.user_metadata?.role || prev.position,
          // Update other fields if they become available from the API
        }));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    if (user) { // Only fetch if user is logged in
      fetchUserProfile();
    }
  }, [user]); // Re-run when user object changes

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your API
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.user_metadata?.location || '',
      bio: 'Passionate member of SLOA with expertise in community development and leadership.',
      company: '',
      position: user?.user_metadata?.role || '',
      education: '',
      website: '',
      linkedin: '',
      twitter: '',
      github: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="btn btn-outline btn-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary btn-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-sm"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-content">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => setIsAvatarEditing(true)}
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary hover:opacity-90 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    {formData.fullName || 'Your Name'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{formData.position || 'N/A'}</p>
                  <div className="flex items-center justify-center mt-2">
                    <div className={`h-2 w-2 rounded-full ${user?.user_metadata?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                    <span className="text-xs text-muted-foreground">{user?.user_metadata?.status || 'N/A'} Member</span>
                  </div>
                </div>

                {/* Member Since */}
                <div className="w-full p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-medium ${user?.user_metadata?.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user?.user_metadata?.status || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Contact Information</h3>
            </div>
            <div className="card-content space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formData.email || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formData.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formData.location || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formData.website || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Personal Information</h3>
              <p className="card-description">Update your basic personal details</p>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={true}
                    className="input mt-1"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="input mt-1 resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Professional Information</h3>
              <p className="card-description">Your work and educational background</p>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="Enter your job title"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  disabled={!isEditing}
                  className="input mt-1"
                  placeholder="Enter your education background"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Social Links</h3>
              <p className="card-description">Connect your social media profiles</p>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                    className="input mt-1"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
