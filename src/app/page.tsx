"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import HeroBanner from "../components/home/HeroBanner";
import { Suspense, lazy, useEffect } from "react";

const RecentEvents = lazy(() => import("../components/home/RecentEvents"));
const BecomeAMember = lazy(() => import("../components/home/BecomeAMember"));
const BookEvents = lazy(() => import("@/components/home/BookEvents"));
const ExecutiveNote = lazy(() => import("@/components/ExecutiveNote"));

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after all components have loaded
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HeroBanner />
      <Suspense fallback={<LoadingSpinner />}>
        <RecentEvents />
        <BecomeAMember />
        <BookEvents />
        <ExecutiveNote
          role="president"
          title="PRESIDENT NOTE"
          content1={`It is my great privilege to serve as President of the Sri Lanka Orthopaedic Association, the national body representing orthopaedic surgeons and professionals in Sri Lanka. This year, we gather under the theme “Beyond Bones” — a reminder that our work extends beyond surgical techniques and skeletal repair. We are healers, educators, innovators, and collaborators, committed to restoring not only structure but also dignity, function, and quality of life for our patients.`}
          content2={`At the Association, we continue to strengthen orthopaedic care in Sri Lanka through advanced training, continuing medical education programmes, hands-on workshops, cadaveric dissections, and collaborative seminars. Our mission also embraces the vital contributions of nurses, physiotherapists, occupational therapists, orthotists, and prosthetists, ensuring a multidisciplinary approach to musculoskeletal health.
We are expanding partnerships with the Ministry of Health and international orthopaedic associations, forging stronger links that elevate orthopaedic practice, education, and research in Sri Lanka. These collaborations bring global expertise home, while also showcasing our unique experiences to the world.

As we move “Beyond Bones,” let us continue to inspire one another — to innovate, to educate, and to serve with compassion. Together, we can shape the future of orthopaedics in Sri Lanka.`}
        />
      </Suspense>
    </>
  );
}
