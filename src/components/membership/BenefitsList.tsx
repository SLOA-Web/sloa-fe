"use client";

import React, { useState, useRef, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import { BENEFITS_LIST } from "@/data";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BenefitsList: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLButtonElement[]>([]);

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

      // Animate image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { autoAlpha: 0, x: -50 },
          {
            autoAlpha: 1,
            x: 0,
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
    <section
      ref={sectionRef}
      className="py-6 lg:py-16 flex flex-col text-white"
      style={{
        background:
          "linear-gradient(45deg, rgba(18,45,30,0.94) 0%, rgba(18,45,30,0.92) 42%, rgba(18,45,30,1) 100%)",
      }}
    >
      <SectionHeader text="benefits" />
      <div className="mx-4 md:mx-10 lg:mx-16 lg:w-[70%] my-6 lg:my-12">
        <span
          ref={titleRef}
          className="font-roboto text-[32px] md:text-[40px] lg:text-[55px]"
        >
          Explore the exclusive benefits of joining the Sri Lanka Orthopaedic Association.
        </span>
      </div>
      <div className="mx-4 md:mx-10 lg:mx-16 flex flex-col md:flex-row items-start gap-10 lg:h-full">
        {/* Image Container - Full Height */}
        <div
          ref={imageRef}
          className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0"
        >
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] min-h-[250px] md:min-h-[350px] lg:min-h-[400px] flex items-center justify-center">
            <Image
              src={BENEFITS_LIST[activeIdx].image}
              alt={BENEFITS_LIST[activeIdx].title}
              className="w-full h-full object-cover rounded-lg"
              width={500}
              height={300}
            />
          </div>
        </div>
        {/* Cards Container - Stacked */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex flex-col h-[400px] md:h-[500px] lg:h-[600px] min-h-[250px] md:min-h-[350px] lg:min-h-[400px]">
            {BENEFITS_LIST.map((benefit, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  if (el) cardsRef.current[idx] = el;
                }}
                onClick={() => setActiveIdx(idx)}
                className={`text-left flex flex-col transition-all duration-300 px-4 md:px-6 lg:px-8 border-y border-white/50 cursor-pointer bg-transparent overflow-hidden ${
                  idx === activeIdx
                    ? "flex-grow min-h-[150px] md:min-h-[220px] lg:min-h-[300px] py-3 md:py-4 lg:py-6 opacity-100"
                    : "flex-shrink-0 py-1 md:py-2 lg:py-2 opacity-25"
                }`}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  zIndex: idx === activeIdx ? 1 : 0,
                }}
              >
                {idx === activeIdx ? (
                  <div className="flex flex-col h-full">
                    <div className="flex gap-4 md:gap-6 lg:gap-8 py-2 md:py-4 lg:py-8">
                      <div className="inline-block w-2 md:w-2.5 lg:w-3 h-2 md:h-2.5 lg:h-3 aspect-square rounded-full mr-2 md:mr-2.5 lg:mr-3 bg-[#D47045] mt-2 md:mt-2.5 lg:mt-3" />

                      <div className="overflow-hidden">
                        <h3 className="font-roboto text-[20px] md:text-[26px] lg:text-[32px] font-normal">
                          {benefit.title}
                        </h3>
                        <p className="font-poppins text-[12px] md:text-[14px] lg:text-[16px] opacity-75 py-2 md:py-3 lg:py-4 leading-relaxed font-thin animate-in slide-in-from-top-2 duration-300">
                          {benefit.para}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto -mb-2 md:-mb-3 lg:-mb-4 pt-2 md:pt-3 lg:pt-4 flex">
                      <span className="font-roboto text-[10px] md:text-[14px] lg:text-[16px] px-6 md:px-10 lg:px-12 uppercase">
                        Benefit {idx + 1}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="font-roboto text-[10px] md:text-[14px] lg:text-[16px] px-6 md:px-10 lg:px-12 uppercase">
                    Benefit {idx + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsList;
