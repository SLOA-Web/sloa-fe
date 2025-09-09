import CommonBanner from "@/components/CommonBanner";
import EventsSection from "@/components/events/EventsSection";

export default function EventPage() {
  return (
    <main>
      <CommonBanner imageUrl="assets/images/membership.svg" text="Events" />
      <EventsSection />
    </main>
  );
}
