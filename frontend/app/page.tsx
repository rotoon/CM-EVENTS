"use client";

import { CategoryFilter } from "@/components/category-filter";
import { EventsSkeleton } from "@/components/events/events-skeleton";
import { HeroSection } from "@/components/hero-section";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const EVENTS_PER_PAGE = 24;
// Events Content
// ============================================================================

import { EventsContent } from "@/components/events/events-content";

// ============================================================================
// Home Content
// ============================================================================

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const month = searchParams.get("month") || undefined;

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Auto-set current month in URL if not present
  useEffect(() => {
    if (!month) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", currentMonth);
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [month, currentMonth, router, searchParams]);

  const effectiveMonth = month ?? currentMonth;

  return (
    <>
      <HeroSection />
      <CategoryFilter activeCategory={category} activeMonth={effectiveMonth} />
      <EventsContent category={category} month={effectiveMonth} />
    </>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function Home() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
