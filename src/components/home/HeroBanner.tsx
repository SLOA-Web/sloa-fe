"use client";
import Image from "next/image";
import EventCard from "./EventCard";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { heroSlides, eventCards } from "@/data";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (leftColRef.current && rightColRef.current) {
      // Initial animation - stagger the entrance
      const tl = gsap.timeline();

      tl.fromTo(
        leftColRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        }
      ).fromTo(
        rightColRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.8" // Start 0.8s before the previous animation ends
      );
    }
  }, []);

  useEffect(() => {
    // Smooth content transition animation
    if (leftColRef.current && rightColRef.current && !isAnimatingRef.current) {
      isAnimatingRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      // Fade out with subtle movement
      tl.to([leftColRef.current, rightColRef.current], {
        opacity: 0,
        y: -30,
        scale: 0.98,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0.1,
      })
        // Brief pause for content change
        .set({}, {}, "+=0.1")
        // Fade in with smooth entrance
        .fromTo(
          [leftColRef.current, rightColRef.current],
          {
            opacity: 0,
            y: 30,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          }
        );

      // Background image smooth transition
      if (imageRef.current) {
        tl.to(
          imageRef.current,
          {
            scale: 1.05,
            duration: 0.4,
            ease: "power2.inOut",
          },
          0
        ).to(
          imageRef.current,
          {
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (!isAnimatingRef.current && index !== currentSlide) {
      setCurrentSlide(index);
    }
  };

  // const nextSlide = () => {
  //   if (!isAnimatingRef.current) {
  //     setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  //   }
  // };

  // Auto-advance slides every 5 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     nextSlide();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  const currentSlideData = heroSlides[currentSlide];
  const currentEventCardData = eventCards[currentSlide];

  return (
    <section
      ref={containerRef}
      className="relative text-white w-full min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 -z-10">
        <Image
          src={currentSlideData.backgroundImage}
          alt={`Hero Banner Slide ${currentSlide + 1}`}
          fill
          priority
          quality={90}
          className="object-cover object-center transition-opacity duration-700 ease-in-out"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 -z-5 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-5 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Navigation Dots */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id ?? slide.title ?? index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ease-out border border-white/30 ${
              currentSlide === index
                ? "bg-white scale-125 shadow-lg shadow-white/20"
                : "bg-white/20 hover:bg-white/50 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-4 left-0 right-0 z-10 w-full flex gap-12 px-4 md:px-8 pb-2">
        {/* Left column */}
        <div
          ref={leftColRef}
          className="flex lg:flex-[0.7] flex-col justify-end items-start text-left"
        >
            <h1 className="leading-tight text-[36px] md:text-[48px] lg:text-[70px]">
            {currentSlideData.title}
          </h1>
        </div>

        {/* Right column */}
        <div
          ref={rightColRef}
          className="flex lg:flex-[0.3] items-center justify-center hidden lg:block"
        >
          <EventCard
            {...currentEventCardData}
            state="upcoming"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

