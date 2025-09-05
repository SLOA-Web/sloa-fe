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
        "/api/v1/events"
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
    <section className="max-w-7xl mx-auto px-4 py-12 lg:py-24">
      {/* Top bar: search and month filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/500 md:ml-auto"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">All Months</option>
          {monthsList.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      
      {loading && <LoadingSpinner text="Loading event details..." />}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading &&
        !error &&
        Object.entries(grouped).map(([month, events]) => (
          <div key={month} className="mb-12">
            <div className="flex items-center mb-8 w-full">
              <h2
                className="text-3xl lg:text-4xl font-extrabold tracking-tight capitalize text-black"
                ref={(el) => {
                  monthRefs.current[month] = el;
                }}
              >
                {month}
              </h2>
              <hr
                className="flex-1 h-[2px] mt-1 bg-black rounded-full border-none ml-4"
                ref={(el) => {
                  lineRefs.current[month] = el as HTMLSpanElement;
                }}
                style={{ display: "block" }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  />
                );
              })}
            </div>
          </div>
        ))}
    </section>
  );
};

export default EventsSection;