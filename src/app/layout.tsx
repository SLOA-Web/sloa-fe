import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import ClientWrapper from "./ClientWrapper";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sri Lanka Orthopaedic Association - Advancing Orthopaedic Care",
  description: "The Sri Lanka Orthopaedic Association (SLOA) is dedicated to advancing orthopaedic care through education, training, research, and professional development. Join our community of orthopaedic surgeons and professionals.",
  keywords: ["Sri Lanka Orthopaedic Association", "SLOA", "orthopaedic surgery", "orthopaedics", "medical association", "Sri Lanka healthcare", "bone surgery", "musculoskeletal health"],
  authors: [{ name: "Sri Lanka Orthopaedic Association" }],
  creator: "Sri Lanka Orthopaedic Association",
  publisher: "Sri Lanka Orthopaedic Association",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sloa.axle.global/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sri Lanka Orthopaedic Association - Advancing Orthopaedic Care",
    description: "The Sri Lanka Orthopaedic Association (SLOA) is dedicated to advancing orthopaedic care through education, training, research, and professional development.",
    url: "https://sloa.axle.global/",
    siteName: "Sri Lanka Orthopaedic Association",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Sri Lanka Orthopaedic Association Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-site-verification-code", // Replace with actual verification code
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden relative`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <div className="max-w-[1560px] mx-auto">
            <ClientWrapper>
              <Navbar />
              {children}
              <Footer />
            </ClientWrapper>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
