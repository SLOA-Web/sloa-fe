import CommonBanner from "@/components/CommonBanner";
import CTASection from "@/components/home/CTASection";
import { HowItStarted, OurMission, OurVision, CouncilMembers } from "@/components/about";

export default function AboutPage() {
  return (
    <div>
      <CommonBanner imageUrl="assets/images/aboutus_hero.svg" text="ABOUT US" />
      <HowItStarted />
      <OurMission />
      <OurVision />
      <CouncilMembers />
      <CTASection />
    </div>
  );
}
