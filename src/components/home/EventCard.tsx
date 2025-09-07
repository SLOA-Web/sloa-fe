"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import CustomButton from "../ui/CustomButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SUMMARY_LIMIT } from "@/utils/constants";

gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EventCard: React.FC<any> = (props) => {
  // Handle both old and new data structures
  const image = props.image;
  const date = props.date;
  const title = props.title;
  const summary = props.summary || props.shortDesc || "";
  const doctor = props.doctor || props.speaker || "";
  const onReadMore = props.onReadMore;
  const state = props.state;
  const loading = props.loading;
  const disableAnimations = props.disableAnimations || false; // New prop to disable individual animations

  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  // Helper to DRY up GSAP animation logic
  const animateElement = (
    ref: React.RefObject<HTMLElement | null>,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars & { scrollTrigger: ScrollTrigger.Vars }
  ): ScrollTrigger | null => {
    if (!ref.current) return null;
    const anim = gsap.fromTo(ref.current, fromVars, toVars);
    return anim.scrollTrigger || null;
  };

  useEffect(() => {
    if (disableAnimations) return;

    const triggers: ScrollTrigger[] = [];

    const animationConfigs = [
      {
        ref: cardRef,
        from: { autoAlpha: 0, y: 40 },
        to: {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      },
      {
        ref: imageRef,
        from: { autoAlpha: 0, scale: 0.95 },
        to: {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        },
      },
      {
        ref: titleRef,
        from: { autoAlpha: 0, y: 20 },
        to: {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 97%",
            toggleActions: "play none none none",
          },
        },
      },
      {
        ref: dateRef,
        from: { autoAlpha: 0, x: -20 },
        to: {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dateRef.current,
            start: "top 97%",
            toggleActions: "play none none none",
          },
        },
      },
      {
        ref: summaryRef,
        from: { autoAlpha: 0, y: 20 },
        to: {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: summaryRef.current,
            start: "top 97%",
            toggleActions: "play none none none",
          },
        },
      },
    ];

    animationConfigs.forEach(({ ref, from, to }) => {
      const trigger = animateElement(
        ref as React.RefObject<HTMLElement | null>,
        from,
        to
      );
      if (trigger) triggers.push(trigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger && trigger.kill());
    };
  }, [disableAnimations]);
  if (state === "heropage") {
    return (
      <div className="relative bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-sm min-h-[320px] text-black">
        {/* Top half image with overlay and Upcoming text */}
        <div className="w-full h-52 relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-transparent" />
          <p className="text-[14px] font-poppins absolute top-3 left-3 z-20 text-white drop-shadow">
            Upcoming
          </p>
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col w-full flex-1">
          <h3 className="text-[16px] mb-2 font-roboto">{title}</h3>
          <p className="text-[14px] mb-2 font-poppins font-thin">
            {date} | {doctor}
          </p>
          <div className="flex-1" />
          <div className="flex justify-end">
            <CustomButton
              onClick={onReadMore}
              text={loading ? "Redirecting..." : "Book Now"}
              className="border-none px-0 py-0"
              hideIcon={!!loading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-lg min-h-[425px] max-h-[500px]"
    >
      {/* Top half image */}
      <div className="w-full h-40 flex-shrink-0 relative" ref={imageRef}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      {/* Content */}
      <div className="p-3 lg:p-6 flex flex-col flex-1 w-full" ref={contentRef}>
        <span
          className="text-[12px] text-[#39604B] font-bold mb-1 font-poppins"
          ref={dateRef}
        >
          {date}
        </span>
        <h3 className="text-[24px] font-normal my-3 font-roboto" ref={titleRef}>
          {title}
        </h3>
        <p className="text-[12px] mb-4 font-poppins" ref={summaryRef}>
          {summary.length > SUMMARY_LIMIT
            ? summary.slice(0, SUMMARY_LIMIT) + "..."
            : summary}
        </p>
        <div className="flex-1" />
        <CustomButton
          onClick={onReadMore}
          text={loading ? "Redirecting..." : "Read More"}
          className="border-none px-0 py-0 w-fit mt-2"
          hideIcon={!!loading}
        />
      </div>
    </div>
  );
};

export default EventCard;
