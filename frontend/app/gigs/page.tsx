import { EventsSkeleton } from "@/components/events/events-skeleton";
import { GigsContentClient } from "@/components/gigs/gigs-content-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gigs & Live Music",
  description:
    "Discover live music, gigs, and concerts in Chiang Mai tonight. Turn up the volume with HYPE CNX.",
};

export default function GigsPage() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <GigsContentClient />
    </Suspense>
  );
}
