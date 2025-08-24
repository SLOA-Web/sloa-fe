"use client";

import React, { useState } from "react";
import SimpleImage from "@/components/SimpleImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  images = [
    {
      src: "/assets/images/our-mission.webp",
      alt: "Physical rehabilitation with forearm crutches"
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Medical assistance with rehabilitation"
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Physical therapy session"
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Rehabilitation progress"
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Physical therapy session"
    },
    {
      src: "/assets/images/our-mission.webp",
      alt: "Rehabilitation progress"
    }
  ]
}: OurMissionProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Auto-scroll functionality with autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-[70px] h-[1px] bg-[#587565]"></div>
          <span className="text-[#587565] font-poppins text-lg uppercase tracking-wider font-medium">
            Become a Member
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
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
        <div className="relative mt-16">
          {/* Left Gradient Overlay */}
          <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Right Gradient Overlay */}
          <div className="absolute right-0 top-0 w-8  h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <Carousel
            setApi={setApi}
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
                <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/4">
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
