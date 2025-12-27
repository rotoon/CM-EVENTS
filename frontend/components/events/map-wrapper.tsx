"use client";

import dynamic from "next/dynamic";
import { EventsSkeleton } from "./events-skeleton";

const EventsMap = dynamic(() => import("./map/events-map"), {
  ssr: false,
  loading: () => <EventsSkeleton />,
});

export { EventsMap };
