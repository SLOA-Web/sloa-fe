"use client";
import SectionHeader from "../SectionHeader";
import { BENEFITS } from "@/data";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Benefits: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.set(titleRef.current, { display: "inline-block" });
        gsap.fromTo(
          titleRef.current,
          { x: 100 },
          {
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
          }
        );
      }

      // Animate description
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
            delay: 0.2,
          }
        );
      }

      // Animate cards with stagger
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
            delay: 0.4,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="py-12 lg:py-24">
      <SectionHeader text="membership criteria" />

      <div className="px-4 md:px-10 lg:px-16 lg:w-[50%] my-12">
        <span
          ref={titleRef}
          className="font-roboto text-[32px] md:text-[40px] lg:text-[55px] basis-[72.5%]"
        >
          Join Our Professional Community
        </span>
        <p
          ref={descRef}
          className="font-poppins text-[16px] 16 lg:mr-24 leading-8 my-4"
        >
          Become part of the Sri Lanka Orthopaedic Association (SLOA), the
          premier professional body representing orthopaedic surgeons and
          musculoskeletal specialists committed to excellence in patient care
          and medical advancement.
        </p>
      </div>

      <div className="px-4 md:px-10 lg:px-16 lg:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BENEFITS.map((criteria, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (el) cardsRef.current[idx] = el;
            }}
            className="bg-white hover:bg-secondary hover:text-white transition-colors duration-300 rounded-lg shadow p-8 cursor-pointer group"
          >
            <h3 className="font-roboto text-[24px] mb-2 font-medium text-primary">
              {criteria.title}
            </h3>
             <Image
              src={criteria.vector}
              alt=""
              width={96}
              height={96}
              className="w-24 h-24 md:w-32 md:h-32 lg:w-52 lg:h-52 mb-2 mx-auto group-hover:brightness-0 group-hover:invert"
            />
            <p className="font-poppins text-[16px] leading-6">
              {criteria.para}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
