"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap"; 
import { CommonHeroProps } from "@/types";

const CommonHero: React.FC<CommonHeroProps> = ({
  description,
  title,
  imageUrl,
  imageClassname,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        descRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        ".title-letter",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.025,
        }
      );
      gsap.fromTo(
        imgMaskRef.current,
        { top: 0, height: "100%" }, // start mask at top
        {
          top: "100%", // animate mask downwards
          height: "0%",
          duration: 1,
          ease: "power3.out",
          delay: 0.8,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split title into spans
  const renderTitle = () =>
    title.split("").map((char, i) => (
      <span key={i} className="title-letter inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section className="uppercase" ref={sectionRef}>
      <p
        className="text-[14px] md:text-[15px] lg:text-[16px] font-ibm opacity-[0.75] md:w-[60%] lg:w-[38%]"
        ref={descRef}
      >
        {description}
      </p>
      <h1
        className="text-[40px] md:text-[72px] lg:text-[128px] font-semibold font-inter"
        ref={titleRef}
      >
        {renderTitle()}
      </h1>

      {imageUrl && (
        <div
          className="my-6 w-full h-[600px] rounded-[14px] overflow-hidden relative"
          ref={imgWrapperRef}
        >
          <div
            className={`absolute left-0 w-full h-full bg-tertiary z-10 ${imageClassname}`}
            ref={imgMaskRef}
            style={{ top: 0 }} // mask starts at top
          />
          {imageUrl && (
            <div
              className="w-full h-full bg-cover bg-top bg-fixed"
              style={{ backgroundImage: `url('${imageUrl}')` }}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default CommonHero;
