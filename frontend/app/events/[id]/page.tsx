import { EventDetailClient } from "@/components/events/detail/event-detail-client";
import { EventSchema } from "@/components/events/detail/event-schema";
import { fetchEventById } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEventById(parseInt(id));

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const title = event.title;
  const description =
    event.description?.slice(0, 160) ||
    `Join us for ${event.title} in Chiang Mai. Check out dates, location, and more detail on HYPE CNX. ดูรายละเอียดงาน ${event.title} ที่ Hype CNX...`;
  const image = event.cover_image_url || "/hype-sticker.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const eventId = parseInt(id);
  const event = await fetchEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <>
      <EventSchema event={event} />
      <EventDetailClient initialEvent={event} eventId={eventId} />
    </>
  );
}
