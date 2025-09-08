"use client";

import React, { useState, useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";

import { getRecentEvents } from "@/libs/sanity.api";
import type { SanityEvent } from "@/types/sanity";

import type { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import InfoSection from "./InfoSection";

import EventCard from "@/components/news-media/EventCard"; 

const RecentEvents: React.FC = () => {
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType | undefined>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isMdScreen, setIsMdScreen] = useState(false);
  
  const [events, setEvents] = useState<SanityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSanityEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const sanityEvents = await getRecentEvents();
        setEvents(Array.isArray(sanityEvents) ? sanityEvents : []);
      } catch (err: unknown) {
        console.error("Failed to fetch recent events from Sanity:", err);
        setError("Could not load recent events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSanityEvents();
  }, []); 

  const autoplay = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true, playOnInit: true })
  );

  useEffect(() => {
    const checkScreenSize = () => setIsMdScreen(typeof window !== "undefined" && window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const updateApiState = () => {
      setCount(carouselApi.scrollSnapList().length);
      setCurrent(carouselApi.selectedScrollSnap());
    };
    updateApiState();
    carouselApi.on("select", updateApiState);
    carouselApi.on("reInit", updateApiState);
    return () => {
      carouselApi?.off("select", updateApiState);
      carouselApi?.off("reInit", updateApiState);
    };
  }, [carouselApi]);

  return (
    <div className="bg-gradient-to-b from-[#fff] to-[#D47045]/10 py-12 lg:py-24 overflow-x-hidden">
      <SectionHeader text="recent events" />
      <div className="my-12">
        <div className="mx-4 md:mx-10 lg:mx-16">
          <h1 className="text-[24px] md:text-[32px] lg:text-[40px] font-roboto mb-8">
            Explore recent orthopaedic events in Sri Lanka.
          </h1>
          
          {loading && <LoadingSpinner text="Loading event details..." />}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          {!loading && !error && events.length === 0 && (
            <div className="text-center text-gray-500">No recent events found.</div>
          )}

          {!loading && !error && events.length > 0 && (
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "start", loop: events.length > 1 }}
              plugins={isMdScreen ? [autoplay.current] : []}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6 lg:-ml-8">
                {events.map((event) => (
                  <CarouselItem
                    key={event._id}
                    className="pl-4 md:pl-6 lg:pl-8 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
                  >
                    <EventCard event={event} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>

        {/* Progress Bar */}
        {count > 1 && (
          <div className="mx-4 md:mx-10 lg:mx-16 mt-8">
            <div className="h-[2px] bg-primary/25 rounded relative w-full">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((current + 1) / count) * 100}%` }}
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