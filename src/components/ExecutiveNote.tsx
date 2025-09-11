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
  content1?: string;
  content2?: string;
}

export default function ExecutiveNote({
  role,
  title,
  content1,
  content2,
}: Readonly<ExecutiveNoteProps>) {
  const [executive, setExecutive] = useState<CouncilMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs for GSAP animations
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  const content2Ref = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  const displayTitle = title || `${role.toUpperCase()} NOTE`;
  const positionTitle =
    role === "president" ? "President - SLOA" : "Secretary - SLOA";

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
    if (typeof window !== "undefined" && !loading && executive) {
      const initAnimations = async () => {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          // Image animation - slide in from left with scale
          gsap.fromTo(
            imageRef.current,
            {
              x: -100,
              opacity: 0,
              scale: 0.9,
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
                toggleActions: "play none none none",
              },
            }
          );

          // Content1 animation - slide in from right for secretary, left for president
          gsap.fromTo(
            content1Ref.current,
            {
              x: role === "president" ? -100 : 100,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: content1Ref.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none none",
              },
            }
          );

          // Content2 animation - slide in from right for secretary, left for president
          const content2Element =
            role === "president" ? textRef.current : content2Ref.current;
          if (content2Element) {
            gsap.fromTo(
              content2Element,
              {
                x: role === "president" ? -100 : 100,
                opacity: 0,
              },
              {
                x: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.4,
                scrollTrigger: {
                  trigger: content2Element,
                  start: "top 80%",
                  end: "bottom 20%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          // Signature animation - fade in from bottom
          gsap.fromTo(
            signatureRef.current,
            {
              y: 50,
              opacity: 0,
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
                toggleActions: "play none none none",
              },
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

  const imageSrc = executive.user.imageUrl || "/assets/images/small_logo.png";
  const name =
    executive.user.name || role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <>
      {role === "secretary" ? (
        <section ref={sectionRef} className="py-12 lg:py-24">
          <div className="container mx-auto px-4 md:px-10 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
              <div
                ref={imageRef}
                className="relative w-full aspect-square md:col-span-1"
              >
                <div className="overflow-hidden rounded-xl bg-[#122D1E]/10 h-full">
                  <Image
                    src={imageSrc}
                    alt={`${name} portrait`}
                    fill
                    className="object-cover object-center object-top rounded-[8px]"
                    sizes="33vw"
                    priority
                  />
                </div>
              </div>

              <div ref={textRef} className="text-[#122D1E] md:col-span-2">
                <SectionHeader text={displayTitle} />
                <div className="mt-6 space-y-4 leading-7 lg:leading-8 text-[12px] lg:text-[16px] text-[#2b4233]">
                  <div
                    ref={content1Ref}
                    className="whitespace-pre-line leading-[28px] md:leading-[34px] lg:leading-[38px]"
                  >
                    {content1}
                  </div>

                  {content2 && (
                    <div ref={content2Ref} className="whitespace-pre-line">
                      {content2}
                    </div>
                  )}

                  <div ref={signatureRef} className="pt-6 md:pt-16">
                    <p className="font-semibold text-[12px] lg:text-[16px]">
                      {name}
                    </p>
                    <p className="text-[10px] lg:text-[14px]">
                      {positionTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section
          ref={sectionRef}
          className="py-12 lg:py-24 container mx-auto px-4 md:px-10 lg:px-16"
        >
          <div
            ref={imageRef}
            className="relative w-full aspect-square md:col-span-1 md:hidden mb-10"
          >
            <div className="overflow-hidden rounded-xl bg-[#122D1E]/10 h-full">
              <Image
                src={imageSrc}
                alt={`${name} portrait`}
                fill
                className="object-cover object-center object-top rounded-[8px]"
                sizes="33vw"
                priority
              />
            </div>
          </div>
          <SectionHeader text={displayTitle} />
          <div
            ref={content1Ref}
            className="whitespace-pre-line mt-6 space-y-4 leading-7 lg:leading-8 text-[12px] lg:text-[16px] text-[#2b4233]"
          >
            {content1}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div ref={textRef} className="text-[#122D1E] md:col-span-2">
              <div className="mt-6 space-y-4 leading-7 lg:leading-8 text-[12px] lg:text-[16px] text-[#2b4233]">
                <div className="whitespace-pre-line">{content2}</div>

                <div ref={signatureRef} className="pt-6 md:pt-16">
                  <p className="font-semibold text-[12px] lg:text-[16px]">
                    {name}
                  </p>
                  <p className="text-[10px] lg:text-[14px]">{positionTitle}</p>
                </div>
              </div>
            </div>

            <div
              ref={imageRef}
              className="relative w-full aspect-square md:col-span-1 hidden md:block"
            >
              <div className="overflow-hidden rounded-xl bg-[#122D1E]/10 h-full">
                <Image
                  src={imageSrc}
                  alt={`${name} portrait`}
                  fill
                  className="object-cover object-center object-top rounded-[8px]"
                  sizes="33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
