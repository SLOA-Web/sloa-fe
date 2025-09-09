"use client"
import { SectionHeaderProps } from "@/types";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SectionHeader: React.FC<SectionHeaderProps> = ({ text, color = "#587565", className = "" }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const hrRef = useRef<HTMLHRElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!headerRef.current || !hrRef.current || !textRef.current) return;
    
    const el = headerRef.current;
    const hr = hrRef.current;
    const txt = textRef.current;

    // Add a small delay to ensure elements are properly mounted
    const timer = setTimeout(() => {
      if (!el || !hr || !txt) return;
      
      const ctx = gsap.context(() => {
        // Set initial states explicitly
        gsap.set([txt, hr], { clearProps: "all" });
        
        gsap.fromTo(
          txt,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
              refreshPriority: 1,
            },
          }
        );
        
        gsap.fromTo(
          hr,
          { scaleX: 0, transformOrigin: "100% 50%" },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
              refreshPriority: 1,
            },
          }
        );
      }, el);
      
      return () => ctx.revert();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={headerRef} className={`flex items-center gap-2 font-poppins text-[#587565] ${className}`}>
      <hr ref={hrRef} className="w-4 md:w-8 lg:w-16" style={{ borderColor: color }} />
      <p ref={textRef} className="uppercase text-[18px]" style={{ color }}>{text}</p>
    </div>
  );
};

export default SectionHeader;
