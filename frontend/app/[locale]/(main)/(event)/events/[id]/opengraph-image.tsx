import { fetchEventById } from "@/lib/api";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Event Detail";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Fonts
// We'll use system fonts for simplicity in edge runtime, or load specific fonts if needed.
// For now, let's stick to standard sans-serif to keep it fast and error-free.

export default async function Image({ params }: { params: { id: string } }) {
  const { id } = await params; // await params in Next.js 15+, safe to await generally

  // Fetch event data
  const event = await fetchEventById(parseInt(id));

  if (!event) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Hype CNX
      </div>,
      {
        ...size,
      },
    );
  }

  const image = event.cover_image_url || "https://hypecnx.com/hype-sticker.png";
  // Ensure absolute URL for fetch (though <img> src behaves differently in OG generation)
  // ImageResponse handles remote URLs well if valid.

  return new ImageResponse(
    <div
      style={{
        background: "#f0f0f0", // Light gray background
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.1,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          padding: "40px",
          gap: "40px",
        }}
      >
        {/* Left: Image */}
        <div
          style={{
            display: "flex",
            flex: "1",
            border: "4px solid #000",
            boxShadow: "8px 8px 0px 0px #C4F135", // Neo-lime shadow
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#fff",
          }}
        >
          {/* We use standard img tag which ImageResponse processes */}
          <img
            src={image}
            alt={event.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right: Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {/* Branding */}
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 900,
              color: "#C4F135", // Neo-lime
              background: "#000",
              padding: "4px 12px",
              alignSelf: "flex-start",
              textTransform: "uppercase",
            }}
          >
            Hype CNX
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#000",
              lineHeight: 1.1,
              textTransform: "uppercase",
              // Limit lines?
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.title}
          </div>

          {/* Date / Location */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#555",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {event.date_text || "Upcoming Event"}
            </div>

            {event.location && (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "300px",
                  }}
                >
                  {event.location}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative corner */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "0",
          height: "0",
          borderStyle: "solid",
          borderWidth: "0 0 100px 100px",
          borderColor: "transparent transparent #C4F135 transparent",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}
