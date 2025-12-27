import { EventsSkeleton } from "@/components/events/events-skeleton";
import { ExhibitionsContentClient } from "@/components/exhibitions/exhibitions-content-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Art & Exhibitions",
  description:
    "Explore the thriving art scene in Chiang Mai. Find the latest exhibitions and creative workshops with HYPE CNX.",
};

export default function ExhibitionsPage() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <ExhibitionsContentClient />
    </Suspense>
  );
}
