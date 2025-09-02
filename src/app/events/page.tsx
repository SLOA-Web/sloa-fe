"use client"

import CommonBanner from "@/components/CommonBanner"; 
import EventCard from "@/components/home/EventCard";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { api } from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { EventApiType } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function EventPage() {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [events, setEvents] = useState<EventApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data: { events?: EventApiType[] } | EventApiType[] = await api.get('/api/v1/events');
        if (data && typeof data === "object" && "events" in data && Array.isArray(data.events)) {
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
    fetchEvents();
  }, [router]);

  // Group events by month (handle ISO date string)
  const grouped = events.reduce((acc: Record<string, EventApiType[]>, event) => {
    const dateObj = new Date(event.date);
    if (isNaN(dateObj.getTime())) return acc; // skip invalid dates
    const monthName = dateObj.toLocaleString("default", { month: "long" });
    const yearNum = dateObj.getFullYear();
    const key = `${monthName} ${yearNum}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, EventApiType[]>);

  // Refs for month headings
  const monthRefs = useRef<Record<string, HTMLHeadingElement | null>>({});

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    Object.values(monthRefs.current).forEach((el) => {
      if (el) {
        const anim = gsap.fromTo(
          el,
          { autoAlpha: 0, x: 80 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
  if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
      }
    });
    return () => {
      triggers.forEach(trigger => trigger && trigger.kill());
    };
  }, [loading, error, grouped]);

  return (
    <main>
      <CommonBanner imageUrl="assets/images/membership.svg" text="Events" />
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-24">
        {loading && <LoadingSpinner text="Loading event details..." />}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {!loading && !error && Object.entries(grouped).map(([month, events]) => (
          <div key={month} className="mb-12">
            <h2
              className="text-2xl font-bold mb-6 capitalize opacity-0"
              ref={el => { monthRefs.current[month] = el; }}
            >
              {month}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: EventApiType) => {
                const eventId = event.id;
                // Format date for display (e.g., 14 Sep 2023)
                const dateObj = new Date(event.date);
                const dateStr = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                  : event.date;
                // Use posterUrl or fallback image
                const image = event.posterUrl || "/assets/images/cta.svg";
                // Use description as summary
                const summary = event.description || "";
                // Use first agenda speaker as doctor (if available)
                const doctor = event.agenda && event.agenda.length > 0 ? event.agenda[0].speaker : "";
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
                    onReadMore={() => {
                      setLoadingSlug(eventId);
                      setTimeout(() => {
                        router.push(`/event/${eventId}`);
                      }, 500);
                    }}
                    loading={loadingSlug === eventId}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
