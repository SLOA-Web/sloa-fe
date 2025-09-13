import CommonBanner from "@/components/CommonBanner";
import CTASection from "@/components/home/CTASection";
import {
  HowItStarted,
  OurMission,
  OurVision,
  CouncilMembers,
} from "@/components/about";
import ExecutiveNote from "@/components/ExecutiveNote";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Sri Lanka Orthopaedic Association",
  description: "Learn about the Sri Lanka Orthopaedic Association (SLOA), our mission, vision, history, and leadership in advancing orthopaedic care.",
  openGraph: {
    title: "About Us - Sri Lanka Orthopaedic Association",
    description: "Learn about the Sri Lanka Orthopaedic Association (SLOA), our mission, vision, history, and leadership in advancing orthopaedic care.",
    url: "https://sloa.axle.global/about",
    siteName: "Sri Lanka Orthopaedic Association",
    images: [
      {
        url: "/assets/images/aboutus_hero.svg",
        width: 1200,
        height: 630,
        alt: "About Sri Lanka Orthopaedic Association",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div>
      <CommonBanner imageUrl="assets/images/aboutus_hero.svg" text="ABOUT US" />
      <HowItStarted />
      <OurMission />
      <OurVision />
      <CouncilMembers />
      <ExecutiveNote
        role="secretary"
        title="SECRETARY NOTE"
        content1={`It is an honor to serve as Secretary of the Sri Lanka Orthopaedic Association. As we continue to grow as a community of dedicated professionals, our focus remains on advancing orthopaedic care, education, and research in Sri Lanka. I look forward to working together with our members to uphold the highest standards of clinical excellence, foster collaboration, and support the next generation of orthopaedic surgeons.
Thank you for your continued commitment to our mission.`}
      />
      <CTASection
        buttonText="Become a member"
        description="Join the Sri Lanka Orthopaedic Association to advance orthopaedic care through education, training, research, collaboration, and professional development nationwide."
        imageSrc="/assets/images/cta_about.svg"
      />
    </div>
  );
}
