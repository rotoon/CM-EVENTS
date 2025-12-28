import { EventsSkeleton } from "@/components/events/events-skeleton";
import { HomeClient } from "@/components/home/home-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Discover Local Vibes | อีเว้นท์เชียงใหม่",
  description:
    "Explore the latest events, gigs, and exhibitions in Chiang Mai. Your ultimate guide to the city's heartbeat. ค้นพบอีเว้นท์และกิจกรรมล่าสุดในเชียงใหม่",
};

export default async function Home() {
  // const upcomingEvents = await fetchUpcoming();
  // const heroEvent = upcomingEvents[0];

  return (
    <Suspense fallback={<EventsSkeleton />}>
      <HomeClient heroEvent={undefined} />
    </Suspense>
  );
}
