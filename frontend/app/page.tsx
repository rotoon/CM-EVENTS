import { EventsSkeleton } from "@/components/events/events-skeleton";
import { HomeClient } from "@/components/home/home-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Discover Local Vibes",
  description:
    "Explore the latest events, gigs, and exhibitions in Chiang Mai. Your ultimate guide to the city's heartbeat.",
};

export default function Home() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <HomeClient />
    </Suspense>
  );
}
