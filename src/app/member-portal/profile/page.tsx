"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import {
  User,
  Mail,
  Save,
  Edit3,
  X,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Calendar,
  Shield,
  Award,
  Star,
  Bell,
  CreditCard,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  Briefcase,
  Globe2,
  Smartphone,
  MapPin,
  UserCheck,
  Zap,
  BarChart3
} from "lucide-react";

interface ApiResponse {
  user: {
    user_metadata?: {
      full_name?: string;
      location?: string;
      role?: string;
    };
    email?: string;
    phone?: string;
  };
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.full_name?.split(' ')[0] || "",
    secondName: user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
    birthDate: "",
    phone: user?.phone || "",
    email: user?.email || "",
    location: user?.user_metadata?.location || "",
    position: user?.user_metadata?.role || "",
    company: "",
    education: "",
    website: "",
    linkedin: "",
    twitter: "",
    github: "",
    bio: "Passionate member of SLOA with expertise in community development and leadership.",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/v1/auth/me") as ApiResponse;
        const fetchedUser = response.user;
        const fullName = fetchedUser?.user_metadata?.full_name || "";
        const nameParts = fullName.split(' ');
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || prev.firstName,
          secondName: nameParts.slice(1).join(' ') || prev.secondName,
          email: fetchedUser?.email || prev.email,
          phone: fetchedUser?.phone || prev.phone,
          location: fetchedUser?.user_metadata?.location || prev.location,
          position: fetchedUser?.user_metadata?.role || prev.position,
        }));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const fullName = user?.user_metadata?.full_name || "";
    const nameParts = fullName.split(' ');
    setFormData({
      firstName: nameParts[0] || "",
      secondName: nameParts.slice(1).join(' ') || "",
      birthDate: "",
      phone: user?.phone || "",
      email: user?.email || "",
      location: user?.user_metadata?.location || "",
      position: user?.user_metadata?.role || "",
      company: "",
      education: "",
      website: "",
      linkedin: "",
      twitter: "",
      github: "",
      bio: "Passionate member of SLOA with expertise in community development and leadership.",
    });
    setIsEditing(false);
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = ['firstName', 'secondName', 'email', 'phone', 'location', 'position', 'company', 'education', 'bio'];
    const filledFields = fields.filter(field => formData[field as keyof typeof formData] && formData[field as keyof typeof formData].trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="space-y-8">
      {/* Enhanced Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">My Details</h2>
                  <p className="text-muted-foreground mt-1">
                    Manage your personal information and account details
                  </p>
                </div>
              </div>
              
              {/* Profile Completion Bar */}
              <div className="mt-6 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Profile Completion</span>
                  <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {profileCompletion < 100 ? `${9 - Math.floor(profileCompletion / 11.11)} more fields to complete your profile` : 'Profile complete! 🎉'}
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-xl">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{profileCompletion}%</p>
              <p className="text-sm text-blue-700">Complete</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-xl">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">Premium</p>
              <p className="text-sm text-green-700">Member</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">2</p>
              <p className="text-sm text-purple-700">Years</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-900">15</p>
              <p className="text-sm text-orange-700">Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Personal Information */}
        <div className="xl:col-span-2 space-y-8">
          {/* Personal Information Section */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your basic personal details and contact information
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    SECOND NAME
                  </label>
                  <input
                    type="text"
                    value={formData.secondName}
                    onChange={(e) => handleInputChange('secondName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="Enter second name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    BIRTH DATE
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 pr-10 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="dd/mm/yy"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Smartphone className="h-4 w-4 text-primary" />
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="Enter phone number"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Keep 9-digit format with no spaces and dashes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Address Section */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-10 to-blue-5 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Email Address</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your primary email for communications and account access
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-blue-600" />
                  E-MAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter email address"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Email verified and active
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-10 to-green-5 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Professional Information</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your work experience and professional background
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Building className="h-4 w-4 text-green-600" />
                    COMPANY
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Award className="h-4 w-4 text-green-600" />
                    POSITION
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter your position"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    EDUCATION
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter your education"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPin className="h-4 w-4 text-green-600" />
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-10 to-purple-5 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">About Me</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tell us about yourself and your professional interests
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  BIOGRAPHY
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center gap-4 justify-end">
              <button
                onClick={handleCancel}
                className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 border border-border rounded-xl hover:bg-accent flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {formData.firstName} {formData.secondName}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">{formData.position || 'Member'}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-semibold text-primary">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors">
                <Shield className="h-4 w-4" />
                Security Settings
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors">
                <Bell className="h-4 w-4" />
                Notification Preferences
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors">
                <CreditCard className="h-4 w-4" />
                Billing & Payments
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors">
                <Users className="h-4 w-4" />
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Profile Stats
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">2023</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Events Attended</span>
                <span className="text-sm font-medium text-foreground">15</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium text-foreground">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-primary" />
              Social Links
            </h4>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-muted-foreground hover:bg-accent rounded-xl transition-colors">
                <Linkedin className="h-4 w-4" />
                Add LinkedIn
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-muted-foreground hover:bg-accent rounded-xl transition-colors">
                <Twitter className="h-4 w-4" />
                Add Twitter
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-muted-foreground hover:bg-accent rounded-xl transition-colors">
                <Github className="h-4 w-4" />
                Add GitHub
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-muted-foreground hover:bg-accent rounded-xl transition-colors">
                <Globe className="h-4 w-4" />
                Add Website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
