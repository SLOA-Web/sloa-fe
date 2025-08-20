"use client";
import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  Search,
  Plus,
  Bookmark,
  Share2,
  Download,
  CheckCircle
} from "lucide-react";

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', count: 12 },
    { id: 'conference', name: 'Conferences', count: 4 },
    { id: 'webinar', name: 'Webinars', count: 3 },
    { id: 'workshop', name: 'Workshops', count: 2 },
    { id: 'seminar', name: 'Seminars', count: 2 },
    { id: 'deadline', name: 'Deadlines', count: 1 },
  ];

  const statuses = [
    { id: 'all', name: 'All Status', count: 12 },
    { id: 'registered', name: 'Registered', count: 3 },
    { id: 'open', name: 'Open', count: 6 },
    { id: 'closed', name: 'Closed', count: 2 },
    { id: 'due-soon', name: 'Due Soon', count: 1 },
  ];

  const events = [
    {
      id: 1,
      title: "Annual Conference 2024",
      description: "Join us for the biggest orthopaedic conference of the year featuring keynote speakers, workshops, and networking opportunities.",
      date: "Dec 15, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Colombo Convention Center",
      category: "conference",
      status: "registered",
      attendees: 250,
      maxAttendees: 300,
      price: "Free for Members",
      image: "/api/placeholder/400/200",
      tags: ["Networking", "CE Credits", "Workshop"],
      isBookmarked: true,
    },
    {
      id: 2,
      title: "Membership Renewal Deadline",
      description: "Last day to renew your membership for 2025. Don't miss out on member benefits and access to resources.",
      date: "Dec 31, 2024",
      time: "11:59 PM",
      location: "Online",
      category: "deadline",
      status: "due-soon",
      attendees: null,
      maxAttendees: null,
      price: "N/A",
      image: "/api/placeholder/400/200",
      tags: ["Important", "Deadline"],
      isBookmarked: false,
    },
    {
      id: 3,
      title: "Webinar: Latest Research in Orthopaedics",
      description: "Discover the latest research findings and innovations in orthopaedic medicine from leading experts.",
      date: "Jan 10, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual",
      category: "webinar",
      status: "open",
      attendees: 45,
      maxAttendees: 100,
      price: "Free for Members",
      image: "/api/placeholder/400/200",
      tags: ["Research", "Virtual", "CE Credits"],
      isBookmarked: false,
    },
    {
      id: 4,
      title: "Hands-on Workshop: Advanced Techniques",
      description: "Learn advanced surgical techniques through hands-on practice with expert guidance.",
      date: "Jan 25, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Medical Training Center",
      category: "workshop",
      status: "open",
      attendees: 18,
      maxAttendees: 25,
      price: "$150 for Members",
      image: "/api/placeholder/400/200",
      tags: ["Hands-on", "Advanced", "Limited Seats"],
      isBookmarked: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Events</h2>
          <p className="text-muted-foreground mt-1">
            View upcoming events and manage your registrations
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Browse Events
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Registered</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">6</p>
              <p className="text-sm text-muted-foreground">Open</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Due Soon</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Filters and Search */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name} ({status.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.category === 'conference' ? 'bg-blue-100 text-blue-800' :
                        event.category === 'webinar' ? 'bg-green-100 text-green-800' :
                        event.category === 'workshop' ? 'bg-purple-100 text-purple-800' :
                        event.category === 'seminar' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'registered' ? 'bg-green-100 text-green-800' :
                        event.status === 'open' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {event.attendees !== null && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {event.attendees}/{event.maxAttendees} attendees
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-primary">{event.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Bookmark className={`h-4 w-4 ${event.isBookmarked ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {event.status === 'open' && (
                      <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        Register
                      </button>
                    )}
                    {event.status === 'registered' && (
                      <button className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground rounded-lg hover:bg-accent transition-colors">
                        View Details
                      </button>
                    )}
                    <button className="px-4 py-2 text-sm font-medium border border-border text-foreground rounded-lg hover:bg-accent transition-colors">
                      <ExternalLink className="h-4 w-4 mr-2 inline" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                Browse All Events
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Bookmark className="h-4 w-4" />
                My Bookmarks
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Download Calendar
              </button>
            </div>
          </div>

          {/* Event Categories */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Event Categories</h3>
            <div className="space-y-3">
              {categories.slice(1).map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Event Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium text-foreground">2 events</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next Month</span>
                <span className="text-sm font-medium text-foreground">3 events</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Attended</span>
                <span className="text-sm font-medium text-foreground">15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

