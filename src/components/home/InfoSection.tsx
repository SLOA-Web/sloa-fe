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
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        pRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mt-24 mx-0 md:mx-8 lg:mx-16 py-24 flex items-center justify-center"
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
