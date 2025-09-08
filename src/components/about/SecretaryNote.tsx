"use client";

import { useEffect, useState } from "react";
import SectionHeader from "../SectionHeader";
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

export default function SecretaryNote() {
  const [secretary, setSecretary] = useState<CouncilMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecretary = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ members: CouncilMember[] }>(
          "/api/v1/council/active-members"
        );
        const sec = (response.members || []).find(
          (m) => m.position?.toLowerCase() === "secretary"
        );
        setSecretary(sec || null);
      } catch (e) {
        console.error("Failed to fetch secretary:", e);
        setSecretary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSecretary();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-16">
          <SectionHeader text="SECRETARY NOTE" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="h-[260px] sm:h-[320px] md:h-[420px] rounded-xl bg-gray-200 animate-pulse" />
            <div className="space-y-4">
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

  if (!secretary) return null;

  const imageSrc = secretary.user.imageUrl || "/assets/images/member.webp";
  const name = secretary.user.name || "Secretary";

  return (
    <section className="py-16 lg:py-24 bg-[#fff5f5]">
      <div className="container mx-auto px-4 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative w-full">
            <div className="overflow-hidden rounded-xl bg-[#122D1E]/10">
              <Image
                src={imageSrc}
                alt={`${name} portrait`}
                width={500}
                height={380}
                className="w-full h-[260px] sm:h-[320px] md:h-[420px] object-cover"
                priority
              />
            </div>
          </div>

          <div className="text-[#122D1E]">
            <SectionHeader text="SECRETARY NOTE" />
            <div className="mt-6 space-y-4 leading-8 text-[15px] sm:text-base text-[#2b4233]">
              <p>
                Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical
                fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care
                given to Orthopaedic and Trauma patients. This is done by joining hands with the
                Ministry of Health to improve the Orthopaedic services of the hospitals and provide
                optimum care to a wider population. SLOA is also committed to further enhance the
                knowledge and capabilities of the Sri Lankan Orthopaedic Surgeons by continuous
                medical education. This is facilitated by the numerous CME programmes in our
                schedule conducted by national and international resource persons.
              </p>

              <div className="pt-6 md:pt-16">
                <p className="font-semibold">{name}</p>
                <p className="">Secretary - SLOA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
