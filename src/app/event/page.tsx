import CommonBanner from "@/components/CommonBanner";
import InfoSection from "@/components/home/InfoSection";
import CTASection from "@/components/home/CTASection";

export default function EventPage() {
  return (
    <div>
      <CommonBanner imageUrl="assets/images/membership.svg" text="Membership" />
      <InfoSection headerText="new member" />
      <CTASection />
    </div>
  );
}
