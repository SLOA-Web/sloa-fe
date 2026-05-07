import LoadingSpinner from "@/components/ui/LoadingSpinner";
import HeroBanner from "../components/home/HeroBanner";
import AnnualSession from "../components/home/AnnualSession";
import { Suspense, lazy } from "react";

const RecentEvents = lazy(() => import("../components/home/RecentEvents"));
const BecomeAMember = lazy(() => import("../components/home/BecomeAMember"));
const BookEvents = lazy(() => import("@/components/home/BookEvents"));
const ExecutiveNote = lazy(() => import("@/components/ExecutiveNote"));

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sri Lanka Orthopaedic Association - Advancing Orthopaedic Care",
  description:
    "Welcome to the Sri Lanka Orthopaedic Association (SLOA). Discover our mission, events, and opportunities to join our community of orthopaedic professionals.",
  openGraph: {
    title: "Sri Lanka Orthopaedic Association - Advancing Orthopaedic Care",
    description:
      "Welcome to the Sri Lanka Orthopaedic Association (SLOA). Discover our mission, events, and opportunities to join our community of orthopaedic professionals.",
    url: "https://srilankaortho.org/",
    siteName: "Sri Lanka Orthopaedic Association",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Sri Lanka Orthopaedic Association Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <HeroBanner />
      <AnnualSession />
      <Suspense fallback={<LoadingSpinner />}>
        <RecentEvents />
        <BecomeAMember />
        <BookEvents />
        <ExecutiveNote
          role="president"
          title="PRESIDENT NOTE"
          content1={`It is certainly an honour, pleasure and a privilege to be serving as president of SLOA. On behalf of the Sri Lankan Orthopedic Association, warmly welcome you to the Annual Academic Session 2026 to be held from 12th to 14th November, the Hotel Grand Kandyan, in the historic city of Kandy.`}
          content2={`The theme for the year “Fostering inclusion and collaboration" in the medical sector reflects our collective responsibility to built a healthy community, that is equitable, multidisciplinary and unity in purpose. Kandy with its rich cultural heritage and tranquil surroundings offers an ideal setting for academic engagement and collegial interaction.
I hope you will also take to enjoy the warmth of Sri Lankan hospitality and unique charm of this beautiful city.`}
        />
      </Suspense>
    </>
  );
}
