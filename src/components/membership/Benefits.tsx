"use client";
import SectionHeader from "../SectionHeader";
import { BENEFITS } from "@/data";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      <SectionHeader text="benefits" />

      <div className="mx-4 md:mx-10 lg:mx-16 lg:w-[50%] my-12">
        <span
          ref={titleRef}
          className="font-roboto text-[32px] md:text-[40px] lg:text-[55px] basis-[72.5%]"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </span>
        <p
          ref={descRef}
          className="font-poppins text-[16px] 16 lg:mr-24 leading-8 my-4"
        >
          Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic
          surgical fraternity of Sri Lanka. SLOA is committed to the improvement
          of the standard of care given to Orthopaedic and Trauma patients.
        </p>
      </div>

      <div className="mx-4 md:mx-10 lg:mx-16 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {BENEFITS.map((benefit, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (el) cardsRef.current[idx] = el;
            }}
            className="bg-white hover:bg-secondary hover:text-white transition-colors duration-300 rounded-lg shadow p-8 cursor-pointer"
          >
            <h3 className="font-roboto text-[32px] mb-4 mb-52 font-thin">
              {benefit.title}
            </h3>
            <p className="font-poppins text-[16px]">{benefit.para}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
