"use client";

import { useEffect, useState, useRef } from "react";
import SectionHeader from "./SectionHeader";
import Image from "next/image";
import { api } from "@/utils/api";

interface CouncilMember {
  id: string;
  position: string;
  user: {
    id: string;
    name: string | null;
    imageUrl: string | null;
  };
}

interface ExecutiveNoteProps {
  role: "president" | "secretary";
  title?: string;
  content?: string;
}

export default function ExecutiveNote({
  role,
  title,
  content = "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients. This is done by joining hands with the Ministry of Health to improve the Orthopaedic services of the hospitals and provide optimum care to a wider population. SLOA is also committed to further enhance the knowledge and capabilities of the Sri Lankan Orthopaedic Surgeons by continuous medical education. This is facilitated by the numerous CME programmes in our schedule conducted by national and international resource persons."
}: Readonly<ExecutiveNoteProps>) {
  const [executive, setExecutive] = useState<CouncilMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs for GSAP animations
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  const displayTitle = title || `${role.toUpperCase()} NOTE`;
  const positionTitle = role === "president" ? "President - SLOA" : "Secretary - SLOA";

  useEffect(() => {
    const fetchExecutive = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ members: CouncilMember[] }>(
          "/api/v1/council/active-members"
        );
        const exec = (response.members || []).find(
          (m) => m.position?.toLowerCase() === role
        );
        setExecutive(exec || null);
      } catch (e) {
        console.error(`Failed to fetch ${role}:`, e);
        setExecutive(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutive();
  }, [role]);

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && executive) {
      const initAnimations = async () => {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          // Image animation - slide in from left with scale
          gsap.fromTo(
            imageRef.current,
            {
              x: -100,
              opacity: 0,
              scale: 0.9
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: imageRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none none"
              }
            }
          );

          // Text content animation - slide in from right
          gsap.fromTo(
            textRef.current,
            {
              x: 100,
              opacity: 0
            },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none none"
              }
            }
          );

          // Signature animation - fade in from bottom
          gsap.fromTo(
            signatureRef.current,
            {
              y: 50,
              opacity: 0
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              delay: 0.4,
              scrollTrigger: {
                trigger: signatureRef.current,
                start: "top 90%",
                toggleActions: "play none none none"
              }
            }
          );

        }, sectionRef);

        return () => ctx.revert();
      };

      initAnimations();
    }
  }, [loading, executive]);

  if (loading) {
    return (
      <section className="py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-16">
          <SectionHeader text={displayTitle} />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="aspect-square rounded-xl bg-gray-200 animate-pulse md:col-span-1" />
            <div className="space-y-4 md:col-span-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!executive) return null;

  const imageSrc = executive.user.imageUrl || "/assets/images/member.webp";
  const name = executive.user.name || role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <section ref={sectionRef} className="py-12 lg:py-24">
      <div className="container mx-auto px-4 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div ref={imageRef} className="relative w-full aspect-square md:col-span-1">
            <div className="overflow-hidden rounded-xl bg-[#122D1E]/10 h-full">
              <Image
                src={imageSrc}
                alt={`${name} portrait`}
                fill
                className="object-cover rounded-[8px]"
                sizes="33vw"
                priority
              />
            </div>
          </div>

          <div ref={textRef} className="text-[#122D1E] md:col-span-2">
            <SectionHeader text={displayTitle} />
            <div className="mt-6 space-y-4 leading-8 text-[16px] lg:text-[24px] text-[#2b4233]">
              <p>
                {content}
              </p>

              <div ref={signatureRef} className="pt-6 md:pt-16">
                <p className="font-semibold text-lg sm:text-xl">{name}</p>
                <p className="text-base sm:text-lg">{positionTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
