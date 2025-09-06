"use client";

import React from "react";
import SimpleImage from "@/components/SimpleImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import SectionHeader from "../SectionHeader";

interface OurMissionProps {
  title?: string;
  content?: string;
  images?: Array<{
    src: string;
    alt: string;
  }>;
}

export default function OurMission({
  title = "Our\nMission",
  content = "To advance orthopaedic practice in Sri Lanka by providing high-quality education and CPD, enabling research and audit, setting and promoting clinical standards, and advocating for patient safety and musculoskeletal health nationwide. We strive to foster a culture of continuous professional development among orthopaedic practitioners, support innovative research that addresses local and global challenges, and collaborate with healthcare partners to improve patient outcomes. Through our commitment to excellence, we aim to empower clinicians, enhance public awareness, and ensure equitable access to the highest standards of musculoskeletal care throughout the country.",
  images = [
    {
      src: "/assets/images/our-mission.webp",
      alt: "Physical rehabilitation with forearm crutches",
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Medical assistance with rehabilitation",
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Physical therapy session",
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Rehabilitation progress",
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Physical therapy session",
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Rehabilitation progress",
    },
  ],
}: OurMissionProps) {
  // Auto-scroll functionality with autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto">
        <SectionHeader text="our mission" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16 mx-5 md:mx-10 lg:mx-16 my-12">
          {/* Left Column - Title */}
          <div>
            <h2 className="text-[#122D1E] font-roboto text-3xl lg:text-5xl xl:text-[55px] leading-tight font-normal whitespace-pre-line">
              {title}
            </h2>
          </div>

          {/* Right Column - Content */}
          <div>
            <p className="text-[#122D1E] font-poppins text-base leading-7">
              {content}
            </p>
          </div>
        </div>

        {/* Auto-moving Carousel with Gradient Overlays */}
        <div className="relative mt-16 mx-5">
          {/* Left Gradient Overlay */}
          <div className="absolute left-0 top-0 w-8 md:w-16 lg:w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"/>

          {/* Right Gradient Overlay */}
          <div className="absolute right-0 top-0 w-8 md:w-16 lg:w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"/>

          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/4"
                >
                  <div className="relative">
                    <SimpleImage
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-[300px] lg:h-[445px] object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
