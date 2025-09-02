"use client"

import React, { useRef, useEffect } from "react";
// Import types are available for future use
import Image from "next/image";
import CustomButton from "../ui/CustomButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SUMMARY_LIMIT } from "@/utils/constants";



gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EventCard: React.FC<any> = (props) => {
  // Handle both old and new data structures
  const image = props.image || "/assets/images/logo.png";
  const date = props.date;
  const title = props.title;
  const summary = props.summary || props.shortDesc || "";
  const doctor = props.doctor || props.speaker || "";
  const onReadMore = props.onReadMore;
  const state = props.state;
  const loading = props.loading;

  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    if (cardRef.current) {
      const anim = gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
  if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }
    if (imageRef.current) {
      const anim = gsap.fromTo(
        imageRef.current,
        { autoAlpha: 0, scale: 0.95 },
        {
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
        }
      );
  if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }
    if (titleRef.current) {
      const anim = gsap.fromTo(
        titleRef.current,
        { autoAlpha: 0, y: 20 },
        {
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
        }
      );
  if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }
    if (dateRef.current) {
      const anim = gsap.fromTo(
        dateRef.current,
        { autoAlpha: 0, x: -20 },
        {
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
        }
      );
  if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }
    if (summaryRef.current) {
      const anim = gsap.fromTo(
        summaryRef.current,
        { autoAlpha: 0, y: 20 },
        {
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
        }
      );
  if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }
    return () => {
      triggers.forEach(trigger => trigger && trigger.kill());
    };
  }, []);
  if (state === "heropage") {
    return (
      <div className="bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-xs min-h-[380px] max-h-[380px] text-black">
        {/* Top half image */}
        <div className="w-full h-52 relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col w-full flex-1">
          <h3 className="text-[16px] mb-2 font-roboto">{title}</h3>
          <p className="text-[14px] mb-2 font-poppins font-thin">
            {date} | {doctor}
          </p>
          <div className="flex-1" />
          <div className="flex justify-end mt-2">
            <CustomButton text="Book Now" className="border-none px-0 py-0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-lg min-h-[380px] max-h-[380px]"
    >
      {/* Top half image */}
      <div className="w-full h-40 relative" ref={imageRef}>
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
        <h3
          className="text-[24px] font-normal my-3 font-roboto"
          ref={titleRef}
        >
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
