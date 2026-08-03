"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "../SectionHeader";

gsap.registerPlugin(ScrollTrigger);

const accommodationOptions = [
  {
    title: "Hotel Accommodation",
    image: "/assets/images/congress_kandyan.jpeg",
    width: 1024,
    height: 1536,
  },
  {
    title: "Off-Site Accommodation",
    image: "/assets/images/congress_lavendish.jpeg",
    width: 853,
    height: 1280,
  },
];

const CongressAccommodation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".accommodation-card",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
              refreshPriority: 1,
            },
          }
        );
      }, section);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 lg:py-24 px-4 md:px-10 lg:px-16"
    >
      <SectionHeader text="Programmes" color="#D47045" />

      <div className="mt-6 lg:mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <h2 className="text-[#4B1E27] text-[28px] md:text-[36px] lg:text-[44px] font-roboto leading-tight max-w-xl">
          Explore the hotel accommodation offers.
        </h2>
        <p className="font-poppins text-[14px] lg:text-[16px] leading-7 text-black/70 max-w-xl">
          The Sri Lanka Orthopaedic Association (SLOA) is the national body
          representing orthopaedic surgeons in Sri Lanka, dedicated to
          advancing trauma care, education, and research.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {accommodationOptions.map((option) => (
          <div
            key={option.title}
            className="accommodation-card rounded-[8px] overflow-hidden shadow-lg"
          >
            <Image
              src={option.image}
              alt={option.title}
              width={option.width}
              height={option.height}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CongressAccommodation;
