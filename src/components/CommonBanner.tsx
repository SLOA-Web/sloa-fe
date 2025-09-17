"use client"
import { CommonBannerProps } from "@/types";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CommonBanner: React.FC<CommonBannerProps> = ({ imageUrl, text }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".title-letter",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.025,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split text into spans
  const renderText = () =>
    text.split("").map((char, i) => (
      <span key={`${char}-${i}`} className="title-letter inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <div
      className="w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] bg-cover bg-center relative"
      ref={sectionRef}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      <h1
        ref={textRef}
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[96px] font-roboto uppercase leading-tight"
      >
        {renderText()}
      </h1>
    </div>
  );
};

export default CommonBanner;