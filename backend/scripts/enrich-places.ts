import axios from "axios";
import dotenv from "dotenv";
import prisma from "../src/lib/prisma";

dotenv.config();

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_KEY) {
  console.error("❌ GOOGLE_MAPS_API_KEY is missing in .env");
  process.exit(1);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🚀 Starting Data Enrichment...");

  // Get all places
  const places = await prisma.places.findMany({
    include: { images: true },
  });

  console.log(`📍 Found ${places.length} places to check.`);

  for (const place of places) {
    try {
      let placeId = place.google_place_id;
      let lat = place.latitude;
      let lng = place.longitude;
      let changed = false;

      // 1. Find Place ID & Lat/Lng if missing
      if (!placeId || !lat || !lng) {
        console.log(`🔎 Searching: ${place.name}...`);
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          place.name + " Chiang Mai"
        )}&key=${GOOGLE_MAPS_KEY}`;

        const searchRes = await axios.get(searchUrl);
        const results = searchRes.data.results;

        if (results && results.length > 0) {
          const first = results[0];
          placeId = first.place_id;
          lat = first.geometry.location.lat;
          lng = first.geometry.location.lng;

          // Update Place
          await prisma.places.update({
            where: { id: place.id },
            data: {
              google_place_id: placeId,
              latitude: lat,
              longitude: lng,
            },
          });
          changed = true;
          console.log(`   ✅ Matched: ${first.name} (${lat},${lng})`);
        } else {
          console.log(`   ❌ Not found`);
          continue;
        }
      }

      // 2. Fetch Photos if no images
      if (placeId && place.images.length === 0) {
        console.log(`🖼️  Fetching photos for ${place.name}...`);
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_MAPS_KEY}`;
        const detailsRes = await axios.get(detailsUrl);
        const photos = detailsRes.data.result.photos;

        if (photos && photos.length > 0) {
          const newImages = photos.slice(0, 5).map((p: any) => ({
            place_id: place.id,
            image_url: `google_ref:${p.photo_reference}`, // Store reference logic
            caption: "Google Maps",
          }));

          for (const img of newImages) {
            await prisma.place_images.create({ data: img });
          }
          console.log(`   ✅ Added ${newImages.length} photos.`);
        } else {
          console.log(`   ⚠️ No photos found.`);
        }
      }

      if (changed) await sleep(200); // Rate limit
    } catch (error) {
      console.error(`Error processing ${place.name}:`, error);
    }
  }

  console.log("✨ Enrichment Complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
