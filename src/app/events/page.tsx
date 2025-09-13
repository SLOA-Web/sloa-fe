import CommonBanner from "@/components/CommonBanner";
import EventsSection from "@/components/events/EventsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Sri Lanka Orthopaedic Association",
};

export default function EventPage() {
  return (
    <main>
      <CommonBanner imageUrl="assets/images/membership.svg" text="Events" />
      <EventsSection />
    </main>
  );
}
