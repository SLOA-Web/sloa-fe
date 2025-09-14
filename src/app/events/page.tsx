import CommonBanner from "@/components/CommonBanner";
import EventsSection from "@/components/events/EventsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Sri Lanka Orthopaedic Association",
  description: "Explore upcoming events, conferences, and workshops organized by the Sri Lanka Orthopaedic Association (SLOA) for orthopaedic professionals.",
  alternates: {
    canonical: "https://srilankaortho.org/events",
  },
  openGraph: {
    title: "Events - Sri Lanka Orthopaedic Association",
    description: "Explore upcoming events, conferences, and workshops organized by the Sri Lanka Orthopaedic Association (SLOA) for orthopaedic professionals.",
    url: "https://srilankaortho.org/events",
    siteName: "Sri Lanka Orthopaedic Association",
    images: [
      {
        url: "/assets/images/membership.svg",
        width: 1200,
        height: 630,
        alt: "Sri Lanka Orthopaedic Association Events",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function EventPage() {
  return (
    <main>
      <CommonBanner imageUrl="assets/images/membership.svg" text="Events" />
      <EventsSection />
    </main>
  );
}
