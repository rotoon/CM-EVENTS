import { parseThaiDateToISO } from "@/lib/date-utils";
import { EventWithImages } from "@/lib/types";

export function EventSchema({ event }: { event: EventWithImages }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || event.title,
    startDate: parseThaiDateToISO(event.date_text),
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chiang Mai",
        addressRegion: "Chiang Mai",
        addressCountry: "TH",
      },
      geo:
        event.latitude && event.longitude
          ? {
              "@type": "GeoCoordinates",
              latitude: event.latitude,
              longitude: event.longitude,
            }
          : undefined,
    },
    image: event.cover_image_url ? [event.cover_image_url] : [],
    url: typeof window !== "undefined" ? window.location.href : "",
    organizer: {
      "@type": "Organization",
      name: "Hype CNX",
      url: "https:///hivecnx.com/",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
