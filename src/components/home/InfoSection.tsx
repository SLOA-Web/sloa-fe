"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import SectionHeader from "../SectionHeader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomButton from "../ui/CustomButton";

gsap.registerPlugin(ScrollTrigger);

interface InfoSectionProps {
  headerText: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ headerText }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !imgRef.current || !pRef.current) return;
    
    const section = sectionRef.current;
    const img = imgRef.current;
    const p = pRef.current;

    // Add a small delay to ensure elements are properly mounted
    const timer = setTimeout(() => {
      if (!section || !img || !p) return;
      
      const ctx = gsap.context(() => {
        // Set initial states explicitly
        gsap.set([img, p], { clearProps: "all" });
        
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
        
        gsap.fromTo(
          p,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
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
      className="mx-0 md:mx-8 lg:mx-16 py-12 lg:py-24 flex items-center justify-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left side: Image */}
        <div ref={imgRef} className="flex justify-center w-full">
          <div className="relative w-full aspect-[1/1] md:aspect-[4/3] max-w-full rounded-[8px]">
            <Image
              src="/assets/images/home_about.svg"
              alt="Info Section"
              fill
              className="object-cover rounded-[8px]"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>
        {/* Right side: Content */}
        <div className="lg:-ml-12">
          <SectionHeader text={headerText} />
          <div className="mx-4 lg:ml-12">
            <p ref={pRef} className="text-[24px] my-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et
              sapien non nunc blandit ullamcorper. Pellentesque convallis
              vestibulum turpis sit amet tempus. Duis rutrum ut dui non semper.
              Sed sit amet tincidunt ante, vitae hendrerit massa. Nullam nec
              faucibus diam, et ultricies nisl. Integer mi lacus, ultricies a
              sollicitudin iaculis, tempus nec magna. Quisque id mauris
              convallis ipsum vehicula ornare. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. In et sapien non nunc blandit
              ullamcorper.
            </p>
            <CustomButton text="Read our story" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
