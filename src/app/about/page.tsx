import CommonBanner from "@/components/CommonBanner";
import CTASection from "@/components/home/CTASection";
import {
  HowItStarted,
  OurMission,
  OurVision,
  CouncilMembers,
} from "@/components/about";
import ExecutiveNote from "@/components/ExecutiveNote";

export default function AboutPage() {
  return (
    <div>
      <CommonBanner imageUrl="assets/images/aboutus_hero.svg" text="ABOUT US" />
      <HowItStarted />
      <OurMission />
      <OurVision />
      <CouncilMembers />
      <ExecutiveNote role="secretary" title="SECRETARY NOTE" />
      <CTASection
        buttonText="Become a member"
        description="Join the Sri Lanka Orthopaedic Association to advance orthopaedic care through education, training, research, collaboration, and professional development nationwide."
        imageSrc="/assets/images/cta_about.svg"
      />
    </div>
  );
}
