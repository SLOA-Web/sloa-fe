import CommonBanner from "@/components/CommonBanner";
import InfoSection from "@/components/home/InfoSection";
import CTASection from "@/components/home/CTASection";
import Benefits from "@/components/membership/Benefits";
import BenefitsList from "@/components/membership/BenefitsList";

export default function EventPage() {
  return (
    <div>
      <CommonBanner imageUrl="assets/images/membership.svg" text="Membership" />
      <BenefitsList />
      <Benefits />
      <InfoSection headerText="new member" />
      <CTASection />
    </div>
  );
}
