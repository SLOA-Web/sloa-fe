import HeroBanner from "../components/home/HeroBanner";
import { Suspense, lazy } from "react";

const RecentEvents = lazy(() => import("../components/home/RecentEvents"));
const BecomeAMember = lazy(() => import("../components/home/BecomeAMember"));
const BookEvents = lazy(() => import("@/components/home/BookEvents"));

export default function Home() {
  return (
    <>
      <HeroBanner />
      <Suspense fallback={null}>
        <RecentEvents />
        <BecomeAMember />
        <BookEvents />
      </Suspense>
    </>
  );
}
