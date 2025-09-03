"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { api } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Attendee, EventApiType } from "@/types";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from "@/context/AuthContext";
import { formatDeadline } from "@/utils/helper";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EventDetailPage({
  params,
}: {
  readonly params: { readonly id: string };
}) {
  const { user } = useAuth();
  const [event, setEvent] = useState<EventApiType | null | undefined>(undefined);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const agendaRef = useRef(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  console.log("user - ", user);

  useEffect(() => {
    console.log("Fetching event with id:", params.id);
    const fetchEvent = async () => {
      try {
        // Fetch event by id
        const data = await api.get(`/api/v1/events/${params.id}`);
        console.log("Fetched event data:", data);
        setEvent(data as EventApiType);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setEvent(null);
      }
    };
    fetchEvent();
  }, [params]);
  // Attendee type


  useEffect(() => {
    // Check if user already registered for this event
    const fetchUserRegistrations = async () => {
      if (!user) {
        console.log("No user found, skipping registration check.");
        return;
      }
      try {
        console.log(`Fetching registrations for event ${params.id} and user ${user.id}`);
        const data = await api.get(`/api/v1/events/${params.id}/attendees`);
        console.log("Fetched attendee data:", data);
        // Use proper type for attendees
        const attendees = (typeof data === "object" && data !== null && "attendees" in data)
          ? (data as { attendees?: Attendee[] }).attendees
          : undefined;
        const registered = Array.isArray(attendees)
          ? attendees.some(
              (r) => r.userId === user.id
            )
          : false;
        console.log("Is user registered?", registered);
        setIsRegistered(registered);
      } catch (err) {
        console.error("Error fetching user registrations:", err);
      }
    };
    fetchUserRegistrations();
  }, [user, params.id]);

  // FloatingDiv type for animation
  interface FloatingDiv extends HTMLDivElement {
    _floatingApplied?: boolean;
  }

  useEffect(() => {
    if (!event) return;
    const ctx = gsap.context(() => {
      gsap.set([heroRef.current, contentRef.current], { opacity: 0, y: 16 });
      gsap.to(heroRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.2)",
      });
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay: 0.15,
        ease: "back.out(1.2)",
      });
      gsap.set(imageRef.current, { scale: 1.04, opacity: 0 });
      gsap.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });
      ScrollTrigger.batch(".detail-item", {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "back.out(1.2)",
            }
          );
        },
        start: "top 85%",
      });
      if (agendaRef.current) {
        ScrollTrigger.batch(".agenda-item", {
          onEnter: (elements) => {
            gsap.fromTo(
              elements,
              { opacity: 0, x: -14 },
              {
                opacity: 1,
                x: 0,
                duration: 0.55,
                stagger: 0.08,
                ease: "back.out(1.2)",
              }
            );
          },
          start: "top 90%",
        });
      }
      ScrollTrigger.create({
        trigger: buttonsRef.current,
        start: "top 90%",
        onEnter: () => {
          if (buttonsRef.current) {
            gsap.fromTo(
              buttonsRef.current.children,
              { opacity: 0, y: 14, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.2)",
              }
            );
          }
        },
      });
      const contentEl = contentRef.current as FloatingDiv | null;
      if (contentEl && !contentEl._floatingApplied) {
        gsap.to(contentEl, {
          y: "-=6",
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        contentEl._floatingApplied = true;
      }
      const imageEl = imageRef.current;
      if (imageEl) {
        imageEl.addEventListener("mouseenter", () => {
          gsap.to(imageEl, {
            scale: 1.015,
            duration: 0.28,
            ease: "back.out(1.2)",
          });
        });
        imageEl.addEventListener("mouseleave", () => {
          gsap.to(imageEl, { scale: 1, duration: 0.28, ease: "power2.out" });
        });
      }
    }, containerRef);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [event]);

  const handleRegister = async () => {
    if (!user) return;
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      await api.post(`/api/v1/events/${params.id}/register`, {
        userId: user.id,
        eventId: params.id,
      });
      setIsRegistered(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRegisterError(err.message);
      } else {
        setRegisterError("An unexpected error occurred.");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!user) return;
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      await api.delete(`/api/v1/events/${params.id}/register`);
      setIsRegistered(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRegisterError(err.message);
      } else {
        setRegisterError("An unexpected error occurred.");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (isRegistered) {
      handleUnregister();
    } else {
      handleRegister();
    }
  };

  // Only show notFound if event is null after fetch
  // Show loading while fetching
  if (event === undefined) return <LoadingSpinner text="Loading event details..." />;
  // Only show notFound if event is null after fetch
  if (event === null) return notFound();

  return (
    <div ref={containerRef}>
      <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen pb-10 md:pb-20 relative overflow-hidden">
        {/* Hero Banner Section */}
        <section
          ref={heroRef}
          className="relative w-full h-[220px] sm:h-[300px] md:h-[340px] lg:h-[420px] flex items-end justify-center overflow-hidden"
        >
          <Image
            ref={imageRef}
            src={event.posterUrl ?? ""}
            alt={event.title}
            fill
            className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
          <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 pb-6 sm:pb-10 md:pb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg font-roboto mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-white/90 text-base sm:text-lg font-medium">
              <div className="flex items-center gap-2">
                  <span>📅</span> {event.date ? new Date(event.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
              </div>
                {event.time && event.time !== "1970-01-01T00:00:00.000Z" && (
                  <div className="flex items-center gap-2">
                    <span>⏰</span> {(() => {
                      // Try to parse time as ISO and format as HH:mm or h:mm A
                      const d = new Date(event.time);
                      if (!isNaN(d.getTime())) {
                        // If time is 1970-01-01T09:00:00.000Z, show 09:00 AM
                        return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                      }
                      // fallback: show as is
                      return event.time;
                    })()}
                  </div>
                )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <span>📍</span> {event.location}
                </div>
              )}
              {typeof event.maxCapacity === "number" && (
                <div className="flex items-center gap-2">
                  <span>👥</span> {event.maxCapacity}
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Main Content Section */}
        <section className="mx-auto mt-6 sm:mt-10 md:mt-12 px-2 sm:px-4 md:px-6 lg:px-12">
          <div ref={contentRef} className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Additional Info */}
            {(typeof event._count?.registrations === "number" ||
              event.registrationDeadline) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {typeof event._count?.registrations === "number" && (
                  <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-200">
                    <span className="text-2xl">📝</span>
                    <div>
                      <p className="text-green-800 font-semibold">
                        Total Registrations
                      </p>
                      <p className="text-green-700 text-lg font-bold">
                        {event._count.registrations}
                      </p>
                    </div>
                  </div>
                )}
                {/* Featured Speaker: use first agenda speaker if available */}
                {event.agenda &&
                  event.agenda.length > 0 &&
                  event.agenda[0].speaker && (
                    <div className="flex items-center gap-3 p-5 bg-blue-50 border border-blue-200">
                      <span className="text-2xl">🧑‍⚕️</span>
                      <div>
                        <p className="text-blue-800 font-semibold">
                          Featured Speaker
                        </p>
                        <p className="text-blue-700 text-lg font-bold">
                          {event.agenda[0].speaker}
                        </p>
                      </div>
                    </div>
                  )}
                {event.registrationDeadline && (
                  <div className="flex items-center gap-3 p-5 bg-orange-50 border border-orange-200">
                    <span className="text-2xl">⏳</span>
                    <div>
                      <p className="text-orange-800 font-semibold">
                        Registration Deadline
                      </p>
                      <p className="text-orange-700 text-lg font-bold">
                        {formatDeadline(event.registrationDeadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="detail-item">
              <div className="prose prose-base sm:prose-lg max-w-none bg-white/80 p-4 sm:p-6 md:p-8 shadow-sm">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-poppins">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Agenda Section */}
            {event.agenda && event.agenda.length > 0 && (
              <div ref={agendaRef} className="detail-item">
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 flex items-center justify-center">
                      📋
                    </span>{" "}
                    Event Agenda
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {event.agenda.map((item) => (
                      <div
                        key={item.time + item.topic}
                        className="agenda-item flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="bg-primary/10 text-primary font-bold px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm min-w-fit">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">
                            {item.topic}
                          </h4>
                          {item.speaker && (
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Speaker:{" "}
                              <span className="font-medium">
                                {item.speaker}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              ref={buttonsRef}
              className="pt-6 sm:pt-8 flex flex-col gap-3 sm:gap-4 justify-center items-center"
            >
              {/* Extracted button text logic to a variable */}
              {(() => {
                let buttonText = "";
                if (registerLoading) {
                  buttonText = isRegistered ? "Unregistering..." : "Registering...";
                } else {
                  buttonText = isRegistered ? "Unregister" : "Register Now";
                }
                return (
                  <button
                    className="group relative overflow-hidden bg-primary text-white px-8 py-4 w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex-1 hover:scale-[1.02] active:scale-[0.98] rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onClick={handleRegisterClick}
                    disabled={registerLoading}
                  >
                    <span className="relative z-10">
                      {buttonText}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                );
              })()}
              {/* Error Message */}
              {registerError && (
                <div className="w-full mt-2 flex justify-center">
                  <span className="bg-red-100 text-red-700 px-2 sm:px-4 py-1 sm:py-2 rounded shadow text-xs sm:text-sm font-medium border border-red-200">
                    {registerError}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export const runtime = "edge";
