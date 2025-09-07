"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { api } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Attendee, EventApiType } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatTime } from "@/utils/helper";
// Removed react-icons dependency

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EventDetailPage({
  params,
}: {
  readonly params: { readonly id: string };
}) {
  const { user } = useAuth();
  const [event, setEvent] = useState<EventApiType | null | undefined>(
    undefined
  );
  const [registerLoading, setRegisterLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true); // <-- new state
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
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

  useEffect(() => {
    // Check if user already registered for this event
    const fetchUserRegistrations = async () => {
      setCheckingRegistration(true); // <-- start loading
      if (!user) {
        console.log("No user found, skipping registration check.");
        setCheckingRegistration(false); // <-- stop loading
        return;
      }
      try {
        console.log(
          `Fetching registrations for event ${params.id} and user ${user.id}`
        );
        const data = await api.get(`/api/v1/events/${params.id}/attendees`);
        console.log("Fetched attendee data:", data);
        // Use proper type for attendees
        const attendees =
          typeof data === "object" && data !== null && "attendees" in data
            ? (data as { attendees?: Attendee[] }).attendees
            : undefined;
        const registered = Array.isArray(attendees)
          ? attendees.some((r) => r.userId === user.id)
          : false;
        console.log("Is user registered?", registered);
        setIsRegistered(registered);
      } catch (err) {
        console.error("Error fetching user registrations:", err);
      } finally {
        setCheckingRegistration(false); // <-- stop loading
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
    setRegisterSuccess(null);
    try {
      await api.post(`/api/v1/events/${params.id}/register`, {
        userId: user.id,
        eventId: params.id,
      });
      setIsRegistered(true);
      setRegisterSuccess("Registered successfully!");
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
    setRegisterSuccess(null);
    try {
      await api.delete(`/api/v1/events/${params.id}/register`);
      setIsRegistered(false);
      setRegisterSuccess("Unregistered successfully!");
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
  if (event === undefined)
    return <LoadingSpinner text="Loading event details..." />;
  // Only show notFound if event is null after fetch
  if (event === null) return notFound();

  return (
    <div ref={containerRef}>
      <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen pb-10 md:pb-20 relative overflow-hidden">
        {/* Hero Banner Section */}
        <section
          ref={heroRef}
          className="relative w-full h-[220px] md:h-[320px] lg:h-[400px] flex items-end justify-center overflow-hidden shadow-lg"
          style={{
            backgroundImage: event.coverImage 
              ? `url(${event.coverImage})` 
              : 'linear-gradient(135deg, #587565 0%, #4a6b5a 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent z-10" />
          <div className="relative z-20 w-full px-4 sm:px-8 lg:px-16 pb-6 sm:pb-10 md:pb-14">
            <div className="flex items-center gap-3 mb-2">
              {/* Back Icon Button */}
              <button
                onClick={() => (window.location.href = "/events")}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition shadow focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Back"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow font-roboto">
                {event.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3 text-white/95 text-sm sm:text-base font-medium mt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V7m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h1m5-10V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2h2v-6" />
                </svg>
                <span>{event.date ? formatDate(event.date) : "-"}</span>
              </div>
              {event.time && event.time !== "1970-01-01T00:00:00.000Z" && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(event.time)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              )}
              {typeof event.maxCapacity === "number" && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{event.maxCapacity} attendees</span>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Main Content Section */}
        {event.posterUrl ? (
          <section className="mx-auto mt-6 sm:mt-10 md:mt-12 px-2 sm:px-4 md:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Image Column: 1/3 on large screens */}
            <div className="w-full flex justify-center lg:justify-start mb-8 lg:mb-0 col-span-1">
              <div
                ref={imageRef}
                className="w-full max-w-md aspect-[4/5] overflow-hidden shadow-lg bg-white flex items-center justify-center"
              >
                <Image
                  src={event.posterUrl as string}
                  alt={event.title || "Event poster"}
                  width={400}
                  height={500}
                  className="object-cover object-center w-full h-full"
                  style={{ width: "100%", height: "100%" }}
                  priority
                />
              </div>
            </div>
            {/* Main Content Column: 2/3 on large screens */}
            <div
              ref={contentRef}
              className="space-y-6 sm:space-y-8 md:space-y-10 lg:col-span-2"
            >
              {/* Additional Info */}
              {(typeof event._count?.registrations === "number" ||
                event.registrationDeadline) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {typeof event._count?.registrations === "number" && (
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-xl shadow-sm">
                        <div className="p-3 bg-green-100 rounded-full">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                      <div>
                        <p className="text-green-800 font-semibold text-sm uppercase tracking-wide">
                          Total Registrations
                        </p>
                        <p className="text-green-700 text-2xl font-bold">
                          {event._count.registrations}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Featured Speaker: use first agenda speaker if available */}
                  {event.agenda &&
                    event.agenda.length > 0 &&
                    event.agenda[0].speaker && (
                      <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl shadow-sm">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide">
                            Featured Speaker
                          </p>
                          <p className="text-blue-700 text-lg font-bold">
                            {event.agenda[0].speaker}
                          </p>
                        </div>
                      </div>
                    )}
                  {event.registrationDeadline && (
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 rounded-xl shadow-sm">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      <div>
                        <p className="text-orange-800 font-semibold text-sm uppercase tracking-wide">
                          Registration Deadline
                        </p>
                        <p className="text-orange-700 text-lg font-bold">
                          {formatDate(event.registrationDeadline)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="detail-item">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">About This Event</h3>
                  </div>
                  <div className="prose prose-base sm:prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-poppins m-0">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Agenda Section */}
              {event.agenda && event.agenda.length > 0 && (
                <div ref={agendaRef} className="detail-item">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Event Agenda
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div
                          key={item.time + item.topic}
                          className="agenda-item group relative">
                          <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 min-w-fit">
                              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="bg-primary/5 text-primary font-semibold px-3 py-2 rounded-lg text-sm border border-primary/10">
                                {item.time}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg leading-tight">
                                {item.topic}
                              </h4>
                              {item.speaker && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span className="font-medium text-gray-700">
                                    {item.speaker}
                                  </span>
                                </div>
                              )}
                            </div>
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
                  let isBtnLoading = registerLoading || checkingRegistration;
                  if (checkingRegistration) {
                    buttonText = "Loading...";
                  } else if (registerLoading) {
                    buttonText = isRegistered
                      ? "Unregistering..."
                      : "Registering...";
                  } else {
                    buttonText = isRegistered ? "Unregister" : "Register Now";
                    isBtnLoading = false;
                  }
                  return (
                    <button
                      className="group relative overflow-hidden bg-primary text-white px-8 py-4 w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex-1 hover:scale-[1.02] active:scale-[0.98] rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                      onClick={handleRegisterClick}
                      disabled={isBtnLoading}
                    >
                      <span className="relative z-10">{buttonText}</span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </button>
                  );
                })()}
                {/* Success Message */}
                {registerSuccess && (
                  <div className="w-full mt-2 flex justify-center">
                    <span className="bg-green-100 text-green-700 px-2 sm:px-4 py-1 sm:py-2 rounded shadow text-xs sm:text-sm font-medium border border-green-200">
                      {registerSuccess}
                    </span>
                  </div>
                )}
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
        ) : (
          <section className="mx-auto mt-6 sm:mt-10 md:mt-12 px-2 sm:px-4 md:px-6 lg:px-12 w-full flex justify-center">
            <div
              ref={contentRef}
              className="space-y-6 sm:space-y-8 md:space-y-10 w-full"
            >
              {/* Additional Info */}
              {(typeof event._count?.registrations === "number" ||
                event.registrationDeadline) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {typeof event._count?.registrations === "number" && (
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-xl shadow-sm">
                        <div className="p-3 bg-green-100 rounded-full">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                      <div>
                        <p className="text-green-800 font-semibold text-sm uppercase tracking-wide">
                          Total Registrations
                        </p>
                        <p className="text-green-700 text-2xl font-bold">
                          {event._count.registrations}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Featured Speaker: use first agenda speaker if available */}
                  {event.agenda &&
                    event.agenda.length > 0 &&
                    event.agenda[0].speaker && (
                      <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl shadow-sm">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-blue-800 font-semibold text-sm uppercase tracking-wide">
                            Featured Speaker
                          </p>
                          <p className="text-blue-700 text-lg font-bold">
                            {event.agenda[0].speaker}
                          </p>
                        </div>
                      </div>
                    )}
                  {event.registrationDeadline && (
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 rounded-xl shadow-sm">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      <div>
                        <p className="text-orange-800 font-semibold text-sm uppercase tracking-wide">
                          Registration Deadline
                        </p>
                        <p className="text-orange-700 text-lg font-bold">
                          {formatDate(event.registrationDeadline)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="detail-item">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">About This Event</h3>
                  </div>
                  <div className="prose prose-base sm:prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-poppins m-0">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Agenda Section */}
              {event.agenda && event.agenda.length > 0 && (
                <div ref={agendaRef} className="detail-item">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Event Agenda
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div
                          key={item.time + item.topic}
                          className="agenda-item group relative">
                          <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 min-w-fit">
                              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="bg-primary/5 text-primary font-semibold px-3 py-2 rounded-lg text-sm border border-primary/10">
                                {item.time}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg leading-tight">
                                {item.topic}
                              </h4>
                              {item.speaker && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span className="font-medium text-gray-700">
                                    {item.speaker}
                                  </span>
                                </div>
                              )}
                            </div>
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
                  let isBtnLoading = registerLoading || checkingRegistration;
                  if (checkingRegistration) {
                    buttonText = "Loading...";
                  } else if (registerLoading) {
                    buttonText = isRegistered
                      ? "Unregistering..."
                      : "Registering...";
                  } else {
                    buttonText = isRegistered ? "Unregister" : "Register Now";
                    isBtnLoading = false;
                  }
                  return (
                    <button
                      className="group relative overflow-hidden bg-primary text-white px-8 py-4 w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex-1 hover:scale-[1.02] active:scale-[0.98] rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                      onClick={handleRegisterClick}
                      disabled={isBtnLoading}
                    >
                      <span className="relative z-10">{buttonText}</span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </button>
                  );
                })()}
                {/* Success Message */}
                {registerSuccess && (
                  <div className="w-full mt-2 flex justify-center">
                    <span className="bg-green-100 text-green-700 px-2 sm:px-4 py-1 sm:py-2 rounded shadow text-xs sm:text-sm font-medium border border-green-200">
                      {registerSuccess}
                    </span>
                  </div>
                )}
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
        )}
      </main>
    </div>
  );
}

export const runtime = "edge";
