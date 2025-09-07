"use client";
import Image from "next/image";
import EventCard from "./EventCard";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { heroSlides } from "@/data";
import { UpcomingEvent, Banner, BannersResponse, HeroSlide } from "@/types";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [upcomingEvent, setUpcomingEvent] = useState<UpcomingEvent | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const router = useRouter();

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannersLoading(true);
        const data: BannersResponse = await api.get("/api/v1/banners/active");
        setBanners(data.banners || []);
      } catch (err: unknown) {
        // Fallback to static data if API fails
        console.error('Failed to fetch banners:', err);
        setBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };
    fetchBanners();
  }, [router]);

  // Fetch upcoming event
  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        setEventLoading(true);
        const data: UpcomingEvent = await api.get("/api/v1/events/upcoming/next");
        setUpcomingEvent(data);
      } catch (err: unknown) {
        const errorMessage = handleApiError(err, router);
        setEventError(errorMessage);
      } finally {
        setEventLoading(false);
      }
    };
    fetchUpcomingEvent();
  }, [router]);

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

      // Fade out with subtle movement - only animate left column
      tl.to([leftColRef.current], {
        opacity: 0,
        y: -30,
        scale: 0.98,
        duration: 0.4,
        ease: "power2.inOut",
      })
        // Brief pause for content change
        .set({}, {}, "+=0.1")
        // Fade in with smooth entrance - only animate left column
        .fromTo(
          [leftColRef.current],
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

  const nextSlide = () => {
    if (!isAnimatingRef.current) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Use banners if available, fallback to static slides
  const slidesData = banners.length > 0 ? (banners as (Banner | HeroSlide)[]) : (heroSlides as (Banner | HeroSlide)[]);
  const currentSlideData = slidesData[currentSlide];

  const isBanner = (item: Banner | HeroSlide): item is Banner => {
    return (item as Banner).imageUrl !== undefined;
  };
  
  // Ensure currentSlide is within bounds when data changes
  useEffect(() => {
    if (slidesData.length > 0 && currentSlide >= slidesData.length) {
      setCurrentSlide(0);
    }
  }, [slidesData.length, currentSlide]);

  return (
    <section
      ref={containerRef}
      className="relative text-white w-full min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 -z-10">
        {bannersLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : currentSlideData ? (
          (() => {
            const src = isBanner(currentSlideData)
              ? currentSlideData.imageUrl
              : currentSlideData.backgroundImage;
            if (typeof src !== 'string' || src.trim().length === 0) {
              return (
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <p className="text-white text-lg">No banner image</p>
                </div>
              );
            }
            const fallbackAlt = `Hero Banner Slide ${currentSlide + 1}`;
            const altText = isBanner(currentSlideData) && currentSlideData.altText && currentSlideData.altText.trim().length > 0
              ? currentSlideData.altText
              : fallbackAlt;
            return (
              <Image
                src={src}
                alt={altText}
                fill
                priority
                quality={90}
                className="object-cover object-center transition-opacity duration-700 ease-in-out"
                sizes="100vw"
              />
            );
          })()
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <p className="text-white text-lg">No banners available</p>
          </div>
        )}
      </div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 -z-5 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-5 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Navigation Dots */}
      {slidesData.length > 1 && (
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
          {slidesData.map((slide, index) => (
            <button
              key={`slide-${index}`}
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
      )}

      {/* Content */}
      <div className="absolute bottom-4 left-0 right-0 z-10 w-full flex gap-12 px-4 md:px-8 pb-2">
        {/* Left column */}
        <div
          ref={leftColRef}
          className="flex lg:flex-[0.7] flex-col justify-end items-start text-left"
        >
          {currentSlideData && (
            <div className="space-y-4">
              <h1 className="leading-tight text-[36px] md:text-[48px] lg:text-[70px]">
                {currentSlideData.title}
              </h1>
              {'description' in currentSlideData && currentSlideData.description && (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  {currentSlideData.description}
                </p>
              )}
              {'linkUrl' in currentSlideData && currentSlideData.linkUrl && (
                <button
                  onClick={() => {
                    if (currentSlideData.linkUrl.startsWith('http')) {
                      window.open(currentSlideData.linkUrl, '_blank');
                    } else {
                      router.push(currentSlideData.linkUrl);
                    }
                  }}
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Learn More
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div
          ref={rightColRef}
          className="flex lg:flex-[0.3] items-center justify-center lg:block"
        >
          {(() => {
            if (eventLoading) {
              return (
                <div className="relative bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-sm min-h-[320px] text-black">
                  <div className="w-full h-52 relative bg-gray-300 animate-pulse"></div>
                  <div className="p-4 flex flex-col w-full flex-1">
                    <div className="h-4 bg-gray-300 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-300 animate-pulse mb-2"></div>
                    <div className="flex-1" />
                    <div className="h-8 w-20 bg-gray-300 animate-pulse"></div>
                  </div>
                </div>
              );
            } else if (eventError) {
              return (
                <div className="bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-xs min-h-[380px] max-h-[380px] text-black justify-center p-4">
                  <p className="text-sm text-red-500 text-center">Failed to load upcoming event</p>
                </div>
              );
            } else if (upcomingEvent) {
              return (
                <EventCard
                  {...upcomingEvent}
                  state="heropage"
                  onReadMore={() => router.push(`/events/${upcomingEvent.id}`)}
                />
              );
            } else {
              return (
                <div className="bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-xs min-h-[380px] max-h-[380px] text-black justify-center p-4">
                  <p className="text-sm text-muted-foreground text-center">No upcoming events</p>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
