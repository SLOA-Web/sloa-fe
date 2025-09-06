"use client";
import EventCard from "@/components/home/EventCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { EventApiType } from "@/types";
import { useRef, useEffect, useLayoutEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api } from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
gsap.registerPlugin(ScrollTrigger);

const EventsSection: React.FC = () => {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [events, setEvents] = useState<EventApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  // Get unique months from events
  const monthsList = useMemo(() => {
    const monthsSet = new Set<string>();
    events.forEach((event) => {
      let dateObj: Date;
      if (event.date.includes('/')) {
        const [day, month, year] = event.date.split('/').map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(event.date);
      }
      if (!isNaN(dateObj.getTime())) {
        const monthName = dateObj.toLocaleString("default", { month: "long" });
        const yearNum = dateObj.getFullYear();
        monthsSet.add(`${monthName} ${yearNum}`);
      }
    });
    return Array.from(monthsSet).sort((a, b) => {
      // Sort by year then month
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      if (yearA !== yearB) return Number(yearB) - Number(yearA);
      // Month order
      const monthOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthOrder.indexOf(monthB) - monthOrder.indexOf(monthA);
    });
  }, [events]);


  // Fetch events
  const fetchEvents = async () => {
    try {
      const data: { events?: EventApiType[] } | EventApiType[] = await api.get(
        "/api/v1/events?upcoming=true&page=1&limit=30"
      );
      if (
        data &&
        typeof data === "object" &&
        "events" in data &&
        Array.isArray(data.events)
      ) {
        setEvents(data.events);
      } else if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (err: unknown) {
      const errorMessage = handleApiError(err, router);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // Group events by month, filtered by search (text/date only) and selectedMonth
  const getGroupedEvents = (events: EventApiType[]) => {
    const filtered = events.filter((event) => {
      const searchValue = search.trim().toLowerCase();
      // Check title/description
      const matchesText =
        searchValue === "" ||
        event.title.toLowerCase().includes(searchValue) ||
        (event.description && event.description.toLowerCase().includes(searchValue));

      // Check date (YYYY-MM-DD, DD/MM/YYYY, MM/YYYY)
      let matchesDate = false;
      if (searchValue) {
        // Try to match YYYY-MM-DD
        if (event.date && event.date.toLowerCase().includes(searchValue)) {
          matchesDate = true;
        } else {
          // Try DD/MM/YYYY or MM/YYYY
          let dateObj: Date;
          if (event.date.includes('/')) {
            const [day, month, year] = event.date.split('/').map(Number);
            dateObj = new Date(year, month - 1, day);
          } else {
            dateObj = new Date(event.date);
          }
          if (!isNaN(dateObj.getTime())) {
            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();
            const dayStr = String(day).padStart(2, '0');
            const monthStr = String(month).padStart(2, '0');
            const yearStr = year.toString();
            const ddmmyyyy = `${dayStr}/${monthStr}/${yearStr}`;
            const mmyyyy = `${monthStr}/${yearStr}`;
            if (ddmmyyyy.includes(searchValue) || mmyyyy.includes(searchValue)) {
              matchesDate = true;
            }
          }
        }
      }

      // If search is empty, match all; otherwise, match text or date
      const matchesSearch =
        searchValue === "" ? true : (matchesText || matchesDate);

      // Filter by selectedMonth if not 'all'
      let matchesMonth = true;
      if (selectedMonth !== "all") {
        let dateObj: Date;
        if (event.date.includes('/')) {
          const [day, month, year] = event.date.split('/').map(Number);
          dateObj = new Date(year, month - 1, day);
        } else {
          dateObj = new Date(event.date);
        }
        if (!isNaN(dateObj.getTime())) {
          const monthName = dateObj.toLocaleString("default", { month: "long" });
          const yearNum = dateObj.getFullYear();
          const eventMonth = `${monthName} ${yearNum}`;
          matchesMonth = eventMonth === selectedMonth;
        } else {
          matchesMonth = false;
        }
      }

      return matchesSearch && matchesMonth;
    });

    return filtered.reduce((acc: Record<string, EventApiType[]>, event) => {
      let dateObj: Date;
      if (event.date.includes('/')) {
        const [day, month, year] = event.date.split('/').map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(event.date);
      }
      if (isNaN(dateObj.getTime())) return acc;
      const monthName = dateObj.toLocaleString("default", { month: "long" });
      const yearNum = dateObj.getFullYear();
      const key = `${monthName} ${yearNum}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {} as Record<string, EventApiType[]>);
  };

  // Handle read more
  const handleReadMore = (eventId: string) => {
    setLoadingSlug(eventId);
    setTimeout(() => {
      router.push(`/events/${eventId}`);
    }, 500);
  };

  // Refs for month headings and lines
  const monthRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const lineRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Compute grouped events before using in effects
  const grouped = getGroupedEvents(events);

  // Reset refs when months change (prevents stale refs after filtering)
  useEffect(() => {
    monthRefs.current = {};
    lineRefs.current = {};
  }, [grouped]);

  // Animate month headings and lines (optimized, reliable on filter)
  useLayoutEffect(() => {
    const triggers: ScrollTrigger[] = [];
    Object.entries(monthRefs.current).forEach(([month, el]) => {
      if (el) {
        // Animate heading
        gsap.set(el, { autoAlpha: 0, x: 80 });
        const anim = gsap.to(el, {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          ease: "power2.out",
          // Removed ScrollTrigger to animate immediately on render/filter
        });
        // Keep ScrollTrigger for re-animation on scroll (optional fallback)
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);

        // Animate the line next to the heading
        const lineEl = lineRefs.current[month];
        if (lineEl) {
          gsap.set(lineEl, { scaleX: 0, transformOrigin: "left" });
          gsap.to(lineEl, {
            scaleX: 1,
            duration: 0.7,
            ease: "power2.out",
            // Removed ScrollTrigger to animate immediately on render/filter
          });
        }
      }
    });
    return () => {
      triggers.forEach((trigger) => trigger?.kill());
      // Clean up GSAP effects
      Object.values(monthRefs.current).forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
      Object.values(lineRefs.current).forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [grouped]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover and register for our latest medical conferences, workshops, and educational events
          </p>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events by title, description, or date..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 text-gray-700 placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Month Filter */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 text-gray-700 min-w-[180px]"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                {monthsList.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Results Counter */}
            <div className="text-sm text-gray-500 font-medium">
              {Object.values(grouped).reduce((total, events) => total + events.length, 0)} events found
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner text="Loading events..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Events Content */}
        {!loading && !error && (
          <>
            {Object.keys(grouped).length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/60 rounded-2xl p-12 max-w-md mx-auto">
                  <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V7m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h1m5-10V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2h2v-6" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or check back later for new events.</p>
                </div>
              </div>
            ) : (
              Object.entries(grouped).map(([month, events]) => (
                <div key={month} className="mb-16">
                  {/* Month Header */}
                  <div className="flex items-center mb-10 w-full">
                    <h2
                      className="text-3xl lg:text-4xl font-bold tracking-tight capitalize text-gray-900"
                      ref={(el) => {
                        monthRefs.current[month] = el;
                      }}
                    >
                      {month}
                    </h2>
                    <div className="flex-1 ml-6 h-px bg-gradient-to-r from-primary/30 to-transparent">
                      <hr
                        className="h-full border-none bg-gradient-to-r from-primary to-primary/30"
                        ref={(el) => {
                          lineRefs.current[month] = el as HTMLSpanElement;
                        }}
                        style={{ display: "block" }}
                      />
                    </div>
                    <div className="ml-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {events.length} event{events.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Events Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {events.map((event: EventApiType) => {
                      const eventId = event.id;
                      // Format date for display (e.g., 14 Sep 2023)
                      let dateObj: Date;
                      if (event.date.includes('/')) {
                        const [day, month, year] = event.date.split('/').map(Number);
                        dateObj = new Date(year, month - 1, day);
                      } else {
                        dateObj = new Date(event.date);
                      }
                      const dateStr = !isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : event.date;
                      // Use posterUrl or fallback image
                      const image =
                        event.posterUrl || "/assets/images/backup_card.png";
                      // Use description as summary
                      const summary = event.description || "";
                      // Use first agenda speaker as doctor (if available)
                      const doctor =
                        event.agenda && event.agenda.length > 0
                          ? event.agenda[0].speaker
                          : "";
                      // Determine if event is upcoming
                      const now = new Date();
                      const isUpcoming = event.isRegistrationOpen && dateObj > now;
                      return (
                        <EventCard
                          key={event.id}
                          image={image}
                          date={dateStr}
                          title={event.title}
                          summary={summary}
                          doctor={doctor}
                          state={isUpcoming ? "upcoming" : undefined}
                          onReadMore={() => handleReadMore(eventId)}
                          loading={loadingSlug === eventId}
                          disableAnimations={true}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSection;