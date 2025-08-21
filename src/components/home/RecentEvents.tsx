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
import { eventCards } from "@/data";
import EventCard from "./EventCard";
import InfoSection from "./InfoSection";

gsap.registerPlugin(ScrollTrigger);

const RecentEvents: React.FC = () => {
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isMdScreen, setIsMdScreen] = useState(false);

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
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelectCallback = (emblaApi: EmblaCarouselType) => {
      setCurrent(emblaApi.selectedScrollSnap());
    };

    api.on("select", onSelectCallback);
    api.on("reInit", onSelectCallback);

    return () => {
      api?.off("select", onSelectCallback);
      api?.off("reInit", onSelectCallback);
    };
  }, [api]);

  return (
    <div className="bg-gradient-to-b from-[#fff] to-[#D47045]/10 py-12 lg:py-24">
      <SectionHeader text="recent events" />

      <div className="my-12">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={isMdScreen ? [autoplay.current] : []} // Conditionally add autoplay plugin
          className="w-full mx-4 lg:ml-16"
        >
          <h1 className="text-[32px] md:text-[40px] lg:text-[55px] lg:w-[50%] font-roboto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h1>
          <CarouselContent className="my-8">
            {eventCards.map((event) => (
              <CarouselItem
                key={event.title + event.date}
                className="pl-2 md:pl-2 basis-[85%] md:basis-1/3 lg:basis-1/4"
              >
                <EventCard
                  image={event.image || "/assets/images/about_us.svg"}
                  date={event.date || ""}
                  title={event.title}
                  summary={event.summary || ""}
                  onReadMore={() => {}}
                />
              </CarouselItem>
            ))}
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
