import type { Metadata } from "next";
import CongressHero from "@/components/congress/CongressHero";
import CongressAccommodation from "@/components/congress/CongressAccommodation";

export const metadata: Metadata = {
  title: "Congress 2026 - Sri Lanka Orthopaedic Association",
  description:
    "Join the Sri Lanka Orthopaedic Association Congress 2026, 12th - 14th November at The Grand Kandyan Hotel, Kandy.",
  alternates: {
    canonical: "https://srilankaortho.org/congress",
  },
  openGraph: {
    title: "Congress 2026 - Sri Lanka Orthopaedic Association",
    description:
      "Join the Sri Lanka Orthopaedic Association Congress 2026, 12th - 14th November at The Grand Kandyan Hotel, Kandy.",
    url: "https://srilankaortho.org/congress",
    siteName: "Sri Lanka Orthopaedic Association",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "SLOA Congress 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function CongressPage() {
  return (
    <main className="overflow-x-hidden">
      <CongressHero />
      <CongressAccommodation />
    </main>
  );
}
