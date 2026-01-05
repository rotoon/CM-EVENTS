import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import prisma from "../src/lib/prisma";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  const url = process.env.CLOUDINARY_URL;
  const matches = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (matches) {
    cloudinary.config({
      cloud_name: matches[3],
      api_key: matches[1],
      api_secret: matches[2],
      secure: true,
    });
    console.log(`✅ Cloudinary Configured: ${matches[3]}`);
  } else {
    console.error("❌ Invalid CLOUDINARY_URL format");
  }
} else {
  console.error("❌ CLOUDINARY_URL missing in .env");
}

if (!GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_MAPS_API_KEY is missing in .env");
  process.exit(1);
}

// Function to upload to Cloudinary with Folder organization
async function uploadToCloudinary(
  photoReference: string,
  placeId: number,
  index: number,
  placeName: string,
  placeType: string
) {
  const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;

  try {
    const safeName = placeName
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()
      .substring(0, 50);
    const publicId = `${safeName}_${placeId}_${index}`;

    // Create folder based on place_type (e.g. hype-cnx/places/cafe)
    const safeType = placeType.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const folderPath = `hype-cnx/places/${safeType}`;

    console.log(`☁️ Uploading to ${folderPath}/${publicId}...`);

    const result = await cloudinary.uploader.upload(googlePhotoUrl, {
      folder: folderPath,
      public_id: publicId,
      overwrite: true,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return result.secure_url;
  } catch (error) {
    console.error(`❌ Cloudinary Upload Error for ${placeName}:`, error);
    return null;
  }
}

async function enrichPlaces() {
  console.log("🚀 Starting Place Enrichment (Organized & Prioritized)...");

  // Get all places
  let places = await prisma.places.findMany({
    include: { images: true },
  });

  console.log(`Found ${places.length} places total.`);

  // --- PRIORITIZATION LOGIC ---
  // 1. Count types
  const typeCounts = places.reduce((acc, place) => {
    acc[place.place_type] = (acc[place.place_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("📊 Place Type Counts:", typeCounts);

  // 2. Sort by Count (Ascending) -> Rarest first
  places.sort((a, b) => {
    const countA = typeCounts[a.place_type] || 0;
    const countB = typeCounts[b.place_type] || 0;
    return countA - countB;
  });

  console.log("✅ Sorted places by rarity (Rarest = First)");
  // -----------------------------

  for (const place of places) {
    try {
      console.log(`\n-----------------------------------`);
      console.log(
        `📍 Processing: ${place.name} (Type: ${place.place_type}, Count: ${
          typeCounts[place.place_type]
        })`
      );

      // 1. Check for Migration (google_ref -> Cloudinary)
      const googleRefImages = place.images.filter((img) =>
        img.image_url.startsWith("google_ref:")
      );

      if (googleRefImages.length > 0) {
        console.log(`🔄 Found ${googleRefImages.length} images to migrate...`);

        for (let i = 0; i < googleRefImages.length; i++) {
          const img = googleRefImages[i];
          const ref = img.image_url.split("google_ref:")[1];

          const cloudinaryUrl = await uploadToCloudinary(
            ref,
            place.id,
            i, // Use 'i' for unique filename
            place.name,
            place.place_type
          );

          if (cloudinaryUrl) {
            await prisma.place_images.update({
              where: { id: img.id },
              data: { image_url: cloudinaryUrl, order: i },
            });
            console.log(`✅ Migrated Image ID ${img.id}: ${cloudinaryUrl}`);
          }
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        continue;
      }

      // 2. Standard Enrichment (New Data)
      let placeId = place.google_place_id;
      let lat = place.latitude;
      let lng = place.longitude;

      if (!placeId) {
        console.log(`🔍 Searching Place ID...`);
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          place.name + " Chiang Mai"
        )}&key=${GOOGLE_API_KEY}`;

        const searchRes = await axios.get(searchUrl);
        const candidates = searchRes.data.results;

        if (candidates && candidates.length > 0) {
          const match = candidates[0];
          placeId = match.place_id;
          lat = match.geometry.location.lat;
          lng = match.geometry.location.lng;

          console.log(`✅ Matched: ${match.name} [${placeId}]`);
          await prisma.places.update({
            where: { id: place.id },
            data: { google_place_id: placeId, latitude: lat, longitude: lng },
          });
        } else {
          console.log(`❌ No match found.`);
          continue;
        }
      }

      // Check if we need to fetch photos
      if (place.images.length === 0) {
        console.log(`📸 Fetching photos metadata from Google...`);
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`;
        const detailsRes = await axios.get(detailsUrl);
        const photos = detailsRes.data.result.photos;

        if (photos && photos.length > 0) {
          console.log(`Found ${photos.length} photos. Processing top 5...`);
          const photosToProcess = photos.slice(0, 5);

          for (let i = 0; i < photosToProcess.length; i++) {
            const photo = photosToProcess[i];
            const cloudinaryUrl = await uploadToCloudinary(
              photo.photo_reference,
              place.id,
              i,
              place.name,
              place.place_type
            );

            if (cloudinaryUrl) {
              await prisma.place_images.create({
                data: {
                  place_id: place.id,
                  image_url: cloudinaryUrl,
                  caption: `Google Photo by ${
                    photo.html_attributions?.[0] || "Unknown"
                  }`,
                  order: i,
                },
              });
              console.log(`✅ Create new Image ${i + 1}`);
            }
          }
        }
      } else {
        // console.log(`✅ Place already has images.`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${place.name}:`, error);
    }
  }

  console.log("\n✅ Enrichment & Migration Complete!");
}

enrichPlaces().catch((e) => {
  console.error(e);
  process.exit(1);
});
