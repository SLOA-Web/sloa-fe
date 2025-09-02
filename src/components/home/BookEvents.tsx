"use client";
import SectionHeader from "../SectionHeader";
import Image from "next/image";
import CustomButton from "../ui/CustomButton";
import { useRef, useEffect, useState } from "react";
import { UpcomingEvent, UpcomingEventsResponse } from "@/types";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper function to format date for display
const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return { day, month };
};

// Helper function to generate consistent colors for events
const getEventColor = (index: number) => {
  const colors = ['#39604B', '#587565', '#122D1E', '#D47045'];
  return colors[index % colors.length];
};

const BookEvents: React.FC = () => {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLLIElement | null)[]>([]);
  const imageAsideRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data: UpcomingEventsResponse = await api.get("/api/v1/events/upcoming/brief");
        setEvents(data.events || []);
      } catch (err: unknown) {
        const errorMessage = handleApiError(err, router);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [router]);

  useEffect(() => {
    if (sectionRef.current) {
      // Animate heading
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { autoAlpha: 0, y: 80 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Animate cards after heading
      if (cardsRef.current.length) {
        gsap.fromTo(
          cardsRef.current,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
            delay: 0.2,
          }
        );
      }

      // Animate image aside from right to left
      if (imageAsideRef.current) {
        gsap.fromTo(
          imageAsideRef.current,
          { autoAlpha: 0, x: 120 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
            delay: 0.4,
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="min-h-screen py-12 lg:py-24" ref={sectionRef}>
      <header>
        <SectionHeader text="Upcoming Events" />
      </header>
      <main className="mx-4 md:mx-10 lg:mx-16">
        <h1
          ref={headingRef}
          className="text-[32px] md:text-[40px] lg:text-[55px] lg:w-[50%] font-roboto"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h1>
        <div className="flex flex-col-reverse lg:flex-row w-full mt-8">
          <section className="lg:w-[55%] p-6 rounded-lg mr-4">
            {loading ? (
              <div className="flex flex-col gap-8">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-custom p-4 gap-4 animate-pulse">
                    <div className="w-36 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="w-44 h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">Failed to load events</div>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No upcoming events found.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-8">
                {events.map((event, idx) => {
                  const { day, month } = formatEventDate(event.date);
                  const backgroundColor = getEventColor(idx);
                  
                  return (
                    <li
                      key={event.id}
                      ref={(el) => {
                        cardsRef.current[idx] = el;
                      }}
                      className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-custom p-4 gap-4"
                    >
                      <aside className="flex items-center justify-center h-full mr-2 w-36">
                        <div
                          className="flex flex-col items-center justify-center text-[32px] text-white font-semibold rounded px-4 py-2 pb-3 w-full"
                          style={{ backgroundColor }}
                        >
                          <time dateTime={event.date} className="text-center">
                            <div>{day}</div>
                            <div>{month}</div>
                          </time>
                        </div>
                      </aside>
                      <article className="flex flex-1 flex-col lg:flex-row min-w-0 justify-between items-center gap-4">
                        <div className="flex flex-col min-w-0">
                          <p className="text-[24px] font-roboto">{event.title}</p>
                          <p className="text-[16px] font-thin font-poppins text-[#39604B] mb-4">
                            by {event.speaker}
                          </p>
                          <p className="text-[12px] font-poppins mb-3">
                            {event.shortDesc}
                          </p>
                        </div>
                        <div className="w-full lg:w-44 flex-shrink-0">
                          <CustomButton 
                            text={loadingEventId === event.id ? "Loading..." : "Book Now"}
                            onClick={() => {
                              setLoadingEventId(event.id);
                              setTimeout(() => {
                                router.push(`/event/${event.id}`);
                              }, 500);
                            }}
                          />
                        </div>
                      </article>
                    </li>
                  );
                })}
                <CustomButton
                  text="view more events"
                  className="w-fit mx-auto my-12"
                  onClick={() => router.push('/event')}
                />
              </ul>
            )}
          </section>
          <aside
            className="lg:w-[45%] rounded-[8px] relative min-h-[300px]"
            ref={imageAsideRef}
          >
            <Image
              src="/assets/images/book_events.svg"
              alt="Book Events"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain"
            />
          </aside>
        </div>
      </main>
    </section>
  );
};

export default BookEvents;
