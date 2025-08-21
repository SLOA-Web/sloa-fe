"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  ChevronRight,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

const MemberPortalPage = () => {
  const { user } = useAuth();

  // Mock data - replace with real data from your API
  const stats = [
    {
      title: "Applications",
      value: "3",
      change: "+12%",
      changeType: "positive",
      icon: Crown,
      description: "Total applications submitted",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Status",
      value: "Active",
      change: "Current",
      changeType: "neutral",
      icon: CheckCircle,
      description: "Your membership status",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Days Remaining",
      value: "245",
      change: "-5 days",
      changeType: "negative",
      icon: Calendar,
      description: "Until next renewal",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Last Login",
      value: "2 hours ago",
      change: "Online",
      changeType: "positive",
      icon: Clock,
      description: "Your recent activity",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "application",
      title: "Application submitted",
      description: "Your application for membership has been submitted successfully",
      time: "2 hours ago",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      type: "profile",
      title: "Profile updated",
      description: "You updated your contact information",
      time: "1 day ago",
      status: "completed",
      priority: "medium",
    },
    {
      id: 3,
      type: "notification",
      title: "New notification",
      description: "You have a new message from the admin team",
      time: "3 days ago",
      status: "unread",
      priority: "high",
    },
    {
      id: 4,
      type: "payment",
      title: "Payment received",
      description: "Your membership renewal payment has been processed",
      time: "1 week ago",
      status: "completed",
      priority: "low",
    },
  ];

  const quickActions = [
    {
      title: "View Profile",
      description: "Update your personal information",
      icon: Crown,
      href: "/member-portal/profile",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      title: "My Applications",
      description: "Check your application status",
      icon: Crown,
      href: "/member-portal/applications",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      title: "Settings",
      description: "Manage your account settings",
      icon: ChevronRight,
      href: "/member-portal/settings",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      title: "Support",
      description: "Get help and contact support",
      icon: ChevronRight,
      href: "/member-portal/support",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Conference 2024",
      date: "Dec 15, 2024",
      time: "9:00 AM",
      type: "Conference",
      status: "Registered",
    },
    {
      id: 2,
      title: "Membership Renewal Deadline",
      date: "Dec 31, 2024",
      time: "11:59 PM",
      type: "Deadline",
      status: "Due Soon",
    },
    {
      id: 3,
      title: "Webinar: Latest Research",
      date: "Jan 10, 2025",
      time: "2:00 PM",
      type: "Webinar",
      status: "Open",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "unread":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.user_metadata?.full_name || user?.email || "Member"}! 👋
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Here&apos;s what&apos;s happening with your account today. Stay updated with your membership status, 
                recent activities, and upcoming events.
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Last login</div>
                <div className="text-sm font-medium">2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="relative p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.description}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === "positive" ? "bg-green-100 text-green-700" :
                  stat.changeType === "negative" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
              <p className="card-description">Access frequently used features</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className={`block p-4 rounded-lg border border-border hover:shadow-md transition-all duration-200 ${action.hoverColor}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title">Upcoming Events</h3>
              <p className="card-description">Stay informed about important dates</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{event.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                          <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        event.status === "Registered" ? "bg-green-100 text-green-700" :
                        event.status === "Due Soon" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="card-title">Recent Activity</h3>
                  <p className="card-description">Your latest actions and updates</p>
                </div>
                <Link 
                  href="/member-portal/activity" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="group flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-accent/50 hover:border-border/60 transition-all duration-200"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === "application" ? "bg-blue-100 text-blue-600" :
                      activity.type === "profile" ? "bg-green-100 text-green-600" :
                      activity.type === "notification" ? "bg-purple-100 text-purple-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {activity.type === "application" && <Crown className="h-4 w-4" />}
                      {activity.type === "profile" && <Users className="h-4 w-4" />}
                      {activity.type === "notification" && <ChevronRight className="h-4 w-4" />}
                      {activity.type === "payment" && <CreditCard className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{activity.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                            {activity.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Status Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Membership Status</h3>
          <p className="card-description">Your current membership details and benefits</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="flex items-center text-sm font-medium text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-blue-700">January 2024</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-sm text-muted-foreground">Next Renewal</span>
                <span className="text-sm font-medium text-orange-700">December 2024</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm font-medium text-purple-700 capitalize">
                  {user?.userRole || "Member"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <span className="text-sm text-muted-foreground">Membership Level</span>
                <span className="text-sm font-medium text-indigo-700">Professional</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-200">
                <span className="text-sm text-muted-foreground">Benefits</span>
                <span className="text-sm font-medium text-teal-700">Full Access</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="text-sm text-muted-foreground">Days Remaining</span>
                <span className="text-sm font-medium text-rose-700">245</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm text-muted-foreground">Last Payment</span>
                <span className="text-sm font-medium text-amber-700">1 month ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPortalPage;
