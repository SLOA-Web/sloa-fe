"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomImageProps } from "@/types/index";

const CustomImage: React.FC<CustomImageProps> = ({
  imageUrl,
  imageClassname,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

  return (
    <section ref={sectionRef}>
      {imageUrl && (
        <div
          className="w-full h-[450px] overflow-hidden relative"
          ref={imgWrapperRef}
        >
          <div
            className={`absolute left-0 w-full h-full bg-tertiary z-10 ${imageClassname}`}
            ref={imgMaskRef}
            style={{ top: 0 }} // mask starts at top
          />
          {imageUrl && (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${imageUrl}')`, willChange: 'transform' }}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default CustomImage;
