import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { WorkflowSection } from "@/components/landing/workflow-section";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SyncSpace — Local-first collaborative knowledge workspace",
  description:
    "SyncSpace is a local-first knowledge workspace. Write offline, sync automatically, and share documents with granular permissions and full version history.",
  openGraph: {
    title: "SyncSpace — Local-first collaborative knowledge workspace",
    description:
      "Write offline, sync automatically, and share documents with granular permissions and full version history.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SyncSpace — Local-first collaborative knowledge workspace",
    description:
      "Write offline, sync automatically, and share documents with granular permissions and full version history."
  }
};

export default function HomePage() {
  return (
    <div className={`dark min-h-screen bg-background text-foreground ${inter.className}`}>
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
