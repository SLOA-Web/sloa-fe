"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import gsap from "gsap";

const CongressHero = () => {
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leftColRef.current || !rightColRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      leftColRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    ).fromTo(
      rightColRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.7"
    );
  }, []);

  return (
    <section className="bg-[#4B1E27] text-white pt-32 pb-16 md:pb-20 lg:pb-24 px-4 md:px-10 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left column */}
        <div ref={leftColRef} className="order-2 lg:order-1">
          <h1 className="uppercase font-poppins font-normal text-[34px] md:text-[46px] lg:text-[56px] leading-[1.2]">
            Sri Lanka Orthopaedic Association Congress 2026
          </h1>

          <p className="mt-6 text-white/80 text-[15px] md:text-base leading-7 max-w-xl">
            Sri Lanka Orthopaedic Association (SLOA) represents the
            Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed
            to the improvement of the standard of care given to Orthopaedic
            and Trauma patients.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-[15px]">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>The Grand Kandyan Hotel</span>
            </div>
            <div className="flex items-center gap-3 text-[15px]">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <span>12th - 14th November 2026</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-primary text-white px-4 py-2.5 shadow hover:bg-primary/90 uppercase text-[14px] tracking-wide transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Right column - image(s) */}
        <div ref={rightColRef} className="order-1 lg:order-2">
          {/* Mobile: single image */}
          <div className="lg:hidden relative w-full max-w-[420px] mx-auto aspect-[740/800] rounded-[4px] overflow-hidden shadow-xl">
            <Image
              src="/assets/images/congress2.png"
              alt="SLOA Congress speaker"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Desktop: image collage */}
          <div className="hidden lg:block relative w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto aspect-[500/682]">
            <div className="absolute left-0 top-0 w-[71%] aspect-[740/800] rounded-[4px] overflow-hidden shadow-xl">
              <Image
                src="/assets/images/congress2.png"
                alt="SLOA Congress speaker"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            <div className="absolute left-[29%] top-[43%] w-[71%] aspect-[740/800] rounded-[4px] overflow-hidden shadow-xl">
              <Image
                src="/assets/images/congress1.png"
                alt="SLOA Congress registration"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CongressHero;
