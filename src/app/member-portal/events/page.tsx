"use client";
import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  Search,
  Bookmark,
  Share2,
  Trash2
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

interface Registration {
  event: Event;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await api.get<{ registrations: Registration[] }>("/api/v1/events/user/registrations");
      setEvents(response.registrations);
    } catch (error) {
      toast.error("Failed to fetch your events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleUnregister = async (eventId: string) => {
    try {
      await api.delete(`/api/v1/events/${eventId}/register`);
      toast.success("Successfully unregistered from the event.");
      fetchEvents(); // Refresh the list of events
    } catch (error) {
      toast.error("Failed to unregister from the event.");
    }
  };

  const filteredEvents = events.filter(({ event }) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      </div>

      <div className="grid grid-cols-1">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your registered events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Events List */}
          {loading ? (
            <p>Loading your events...</p>
          ) : (
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(({ event }) => (
                  <div key={event.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{new Date(event.date).toLocaleDateString()}</span>
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
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <Share2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex gap-2">
                        {/* Tags can be added here if available in the API response */}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUnregister(event.id)}
                          className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Unregister
                        </button>
                        <button className="px-4 py-2 text-sm font-medium border border-border text-foreground rounded-lg hover:bg-accent transition-colors">
                          <ExternalLink className="h-4 w-4 mr-2 inline" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>You have not registered for any events yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
