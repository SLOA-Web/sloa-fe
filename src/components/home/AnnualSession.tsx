"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import SectionHeader from "../SectionHeader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnnualSession: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !imgRef.current) return;

    const section = sectionRef.current;
    const img = imgRef.current;

    const timer = setTimeout(() => {
      if (!section || !img) return;

      const ctx = gsap.context(() => {
        gsap.set(img, { clearProps: "all" });

        gsap.fromTo(
          img,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
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

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 lg:py-24 px-4 md:px-10 lg:px-16"
    >
      <SectionHeader text="Annual Session" />
      <div ref={imgRef} className="mt-8 flex justify-center">
        <Image
          src="https://xfqwvmtittfhjvhkdoic.supabase.co/storage/v1/object/public/events/SLOA_Annual_Session.jpeg"
          alt="SLOA Annual Session 2026 – 12th–14th November at The Grand Kandyan Hotel"
          className="w-auto h-auto max-w-full rounded-[8px] shadow-lg"
          width={1200}
          height={675}
          priority
        />
      </div>
    </section>
  );
};

export default AnnualSession;
