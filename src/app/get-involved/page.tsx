"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import CommonBanner from "@/components/CommonBanner";
import InfoSection from "@/components/home/InfoSection";
import CTASection from "@/components/home/CTASection";
import Benefits from "@/components/membership/Benefits";
import BenefitsList from "@/components/membership/BenefitsList";
import { Crown, ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership & Get Involved - Sri Lanka Orthopaedic Association",
  description: "Join the Sri Lanka Orthopaedic Association (SLOA) to advance orthopaedic care through education, training, research, and professional development. Discover membership benefits and how to get involved.",
  keywords: ["SLOA membership", "orthopaedic association", "medical membership", "Sri Lanka healthcare", "orthopaedic professionals", "medical education"],
  alternates: {
    canonical: "https://sloa.axle.global/get-involved",
  },
  openGraph: {
    title: "Membership & Get Involved - Sri Lanka Orthopaedic Association",
    description: "Join the Sri Lanka Orthopaedic Association (SLOA) to advance orthopaedic care through education, training, research, and professional development.",
    url: "https://sloa.axle.global/get-involved",
    siteName: "Sri Lanka Orthopaedic Association",
    images: [
      {
        url: "/assets/images/membership.svg",
        width: 1200,
        height: 630,
        alt: "Sri Lanka Orthopaedic Association Membership",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

function NoMembershipMessage() {
  const searchParams = useSearchParams();
  const [showNoMembershipMessage, setShowNoMembershipMessage] = useState(false);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "no-membership") {
      setShowNoMembershipMessage(true);
      // Scroll to the message
      setTimeout(() => {
        const element = document.getElementById("no-membership-message");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [searchParams]);

  if (!showNoMembershipMessage) {
    return null;
  }

  return (
    <div
      id="no-membership-message"
      className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/20"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-primary/20 p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                  <Crown className="h-10 w-10" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Welcome! You&apos;re Almost There
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We noticed you don&apos;t have an active membership yet. Join
                  our community to unlock exclusive benefits, access
                  professional resources, and connect with healthcare
                  professionals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mx-auto mb-3">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Professional Network
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with peers and mentors
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mx-auto mb-3">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Exclusive Events
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Attend conferences & workshops
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mx-auto mb-3">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Resources
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Access research & guidelines
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <button className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <span>Apply for Membership</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowNoMembershipMessage(false)}
                  className="px-6 py-3 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GetInvolvedPage() {
  return (
    <main className="overflow-x-hidden">
      <CommonBanner
        imageUrl="assets/images/membership.svg"
        text="Membership"
      />

      {/* No Membership Message */}
      <Suspense fallback={null}>
        <NoMembershipMessage />
      </Suspense>
      <BenefitsList />
      <Benefits />
      <InfoSection
        headerText="new member"
        imageSrc="/assets/images/new_member.svg"
        description="Become a part of the Sri Lanka Orthopaedic Association (SLOA) and join a vibrant community of orthopaedic surgeons and musculoskeletal specialists dedicated to advancing the field. As a new member, you'll gain access to exclusive educational resources, research opportunities, and international collaborations. SLOA empowers you to contribute to clinical excellence, set national standards, and make a meaningful impact on patient care across Sri Lanka. Start your journey with us and help shape the future of orthopaedics."
      />
      <CTASection imageSrc="/assets/images/cta_membership.svg" />
    </main>
  );
}
