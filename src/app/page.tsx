"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import HeroBanner from "../components/home/HeroBanner";
import { Suspense, lazy, useEffect } from "react";

const RecentEvents = lazy(() => import("../components/home/RecentEvents"));
const BecomeAMember = lazy(() => import("../components/home/BecomeAMember"));
const BookEvents = lazy(() => import("@/components/home/BookEvents"));

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after all components have loaded
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
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
      </Suspense>
    </>
  );
}
