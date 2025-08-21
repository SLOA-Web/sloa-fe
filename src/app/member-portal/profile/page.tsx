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
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  Briefcase,
  Globe2,
  Smartphone,
  MapPin,
  UserCheck, // Added
  Award, // Added
  Star, // Added
  Zap, // Added
  Shield, // Added
  Bell, // Added
  CreditCard, // Added
  Users, // Added
  BarChart3, // Added
  BookOpen, // Added
} from "lucide-react";

interface UserProfile {
  id?: string;
  nic?: string;
  specialization?: string;
  hospital?: string;
  cv?: string;
}

interface ApiResponse {
  user: {
    id?: string;
    email?: string;
    phone?: string;
    fullName?: string;
    role?: string;
    status?: string;
    location?: string;
    membershipId?: string;
    profile?: UserProfile;
  };
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    birthDate: "", // Not from API
    phone: "",
    email: "",
    location: "",
    position: "", // Maps to user.role
    company: "", // Maps to profile.hospital
    education: "", // Maps to profile.specialization (closest fit)
    website: "", // Not from API
    linkedin: "", // Not from API
    twitter: "", // Not from API
    github: "", // Not from API
    bio: "", // Maps to profile.cv
    nic: "", // Maps to profile.nic
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/v1/auth/me") as ApiResponse;
        const fetchedUser = response.user;
        const fullName = fetchedUser?.fullName || "";
        const nameParts = fullName.split(' ');
        
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          secondName: nameParts.slice(1).join(' ') || "",
          email: fetchedUser?.email || "",
          phone: fetchedUser?.phone || "",
          location: fetchedUser?.location || "",
          position: fetchedUser?.role || "",
          company: fetchedUser?.profile?.hospital || "",
          education: fetchedUser?.profile?.specialization || "",
          bio: fetchedUser?.profile?.cv || "",
          nic: fetchedUser?.profile?.nic || "",
        }));
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
      setError("User not authenticated.");
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        fullName: `${formData.firstName} ${formData.secondName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        role: formData.position,
        profile: {
          specialization: formData.education,
          hospital: formData.company,
          cv: formData.bio,
          nic: formData.nic,
        },
      };
      await api.patch("/api/v1/auth/me", payload);
      setIsEditing(false);
      // Re-fetch profile to ensure data consistency after save
      // This also updates the local state with any server-side transformations
      const response = await api.get("/api/v1/auth/me") as ApiResponse;
      const fetchedUser = response.user;
      const fullName = fetchedUser?.fullName || "";
      const nameParts = fullName.split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        secondName: nameParts.slice(1).join(' ') || "",
        email: fetchedUser?.email || "",
        phone: fetchedUser?.phone || "",
        location: fetchedUser?.location || "",
        position: fetchedUser?.role || "",
        company: fetchedUser?.profile?.hospital || "",
        education: fetchedUser?.profile?.specialization || "",
        bio: fetchedUser?.profile?.cv || "",
        nic: fetchedUser?.profile?.nic || "",
      }));
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Failed to save profile data. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Re-fetch to revert changes to the last saved state
    if (user) {
      const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get("/api/v1/auth/me") as ApiResponse;
          const fetchedUser = response.user;
          const fullName = fetchedUser?.fullName || "";
          const nameParts = fullName.split(' ');
          setFormData((prev) => ({
            ...prev,
            firstName: nameParts[0] || "",
            secondName: nameParts.slice(1).join(' ') || "",
            email: fetchedUser?.email || "",
            phone: fetchedUser?.phone || "",
            location: fetchedUser?.location || "",
            position: fetchedUser?.role || "",
            company: fetchedUser?.profile?.hospital || "",
            education: fetchedUser?.profile?.specialization || "",
            bio: fetchedUser?.profile?.cv || "",
            nic: fetchedUser?.profile?.nic || "",
          }));
        } catch (err) {
          console.error("Failed to fetch user profile on cancel:", err);
          setError("Failed to revert changes. Please refresh the page.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
    setIsEditing(false);
  };

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
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Personal Information Section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Personal Information
              </h3>
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
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                  onChange={(e) => handleInputChange("secondName", e.target.value)}
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
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
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
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Enter phone number"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Keep 9-digit format with no spaces and dashes
                </p>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <User className="h-4 w-4 text-primary" />
                  NIC
                </label>
                <input
                  type="text"
                  value={formData.nic}
                  onChange={(e) => handleInputChange("nic", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Enter NIC"
                />
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
              <h3 className="text-xl font-semibold text-foreground">
                Email Address
              </h3>
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
                onChange={(e) => handleInputChange("email", e.target.value)}
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
              <h3 className="text-xl font-semibold text-foreground">
                Professional Information
              </h3>
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
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  POSITION
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your position"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  SPECIALIZATION
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your specialization"
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
                  onChange={(e) => handleInputChange("location", e.target.value)}
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
                onChange={(e) => handleInputChange("bio", e.target.value)}
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
    </div>
  );
};

export default ProfilePage;
