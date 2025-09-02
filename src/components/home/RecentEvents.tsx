"use client";

import React, { useState, useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";

import type { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { api } from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { UpcomingEvent, UpcomingEventsResponse } from "@/types";
import EventCard from "./EventCard";
import { useRouter } from "next/navigation";
import InfoSection from "./InfoSection";

gsap.registerPlugin(ScrollTrigger);

const RecentEvents: React.FC = () => {
  const [carouselApi, setCarouselApi] = useState<
    EmblaCarouselType | undefined
  >();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
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

  // Ref for autoplay plugin
  const autoplay = useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: true,
      playOnInit: true, // Plugin plays if active
    })
  );

  useEffect(() => {
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      if (typeof window !== "undefined") {
        setIsMdScreen(window.innerWidth >= 768); // Tailwind's md breakpoint
      }
    };
    checkScreenSize(); // Initial check
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, []); // Runs once on mount

  useEffect(() => {
    if (!carouselApi) return;

    // Set count and current on mount and reInit
    const updateCountAndCurrent = () => {
      setCount(carouselApi.scrollSnapList().length);
      setCurrent(carouselApi.selectedScrollSnap());
      console.log("[Embla] updateCountAndCurrent", {
        count: carouselApi.scrollSnapList().length,
        current: carouselApi.selectedScrollSnap(),
      });
    };
    updateCountAndCurrent();

    const onSelectCallback = (emblaApi: EmblaCarouselType) => {
      setCurrent(emblaApi.selectedScrollSnap());
      console.log("[Embla] onSelect", emblaApi.selectedScrollSnap());
    };
    const onReInitCallback = (emblaApi: EmblaCarouselType) => {
      updateCountAndCurrent();
      console.log("[Embla] onReInit", emblaApi.scrollSnapList().length);
    };

    carouselApi.on("select", onSelectCallback);
    carouselApi.on("reInit", onReInitCallback);

    // Defensive: update on resize (in case Embla doesn't reInit)
    const handleResize = () => {
      updateCountAndCurrent();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      carouselApi?.off("select", onSelectCallback);
      carouselApi?.off("reInit", onReInitCallback);
      window.removeEventListener("resize", handleResize);
    };
  }, [carouselApi]);

  return (
    <div className="bg-gradient-to-b from-[#fff] to-[#D47045]/10 py-12 lg:py-24 overflow-x-hidden">
      <SectionHeader text="recent events" />

      <div className="my-12">
        <Carousel
          setApi={setCarouselApi}
          opts={{ align: "start", loop: true }}
          plugins={isMdScreen ? [autoplay.current] : []} // Conditionally add autoplay plugin
          className="w-full mx-4 lg:ml-16"
        >
          <h1 className="text-[32px] md:text-[40px] lg:text-[55px] lg:w-[50%] font-roboto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h1>
          
          {loading && <LoadingSpinner text="Loading event details..." />}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {!loading && !error && events.length === 0 && (
            <div className="text-center text-gray-500">No events found.</div>
          )}


          <CarouselContent className="my-8 ml-0 gap-x-12">
            {!loading &&
              !error &&
              events.map((event) => {
                const eventId = event.id;
                const dateObj = new Date(event.date);
                const dateStr = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : event.date;
                
                return (
                  <CarouselItem
                    key={event.id}
                    className="basis-[100%] md:basis-1/3 lg:basis-1/3"
                  >
                    <EventCard
                      image={event.image}
                      date={dateStr}
                      title={event.title}
                      summary={event.shortDesc}
                      doctor={event.speaker}
                      state="upcoming"
                      onReadMore={() => {
                        setLoadingSlug(eventId);
                        setTimeout(() => {
                          router.push(`/event/${eventId}`);
                        }, 500);
                      }}
                      loading={loadingSlug === eventId}
                    />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
        </Carousel>
        {/* Progress Bar */}
        {count > 0 && (
          <div className="m-4 mx-16">
            <div className="h-[2px] bg-primary/25 rounded relative overflow-hidden w-full">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width:
                    count > 1 ? `${((current + 1) / count) * 100}%` : "100%",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <InfoSection headerText="about" />
    </div>
  );
};

export default RecentEvents;
