import prisma from "../src/lib/prisma";

async function checkStatus() {
  console.log("📊 Checking Image Migration Status...");

  // 1. Total Places
  const totalPlaces = await prisma.places.count();

  // 2. Google Ref Images (Legacy/Expensive)
  const googleRefImages = await prisma.place_images.count({
    where: {
      image_url: {
        startsWith: "google_ref",
      },
    },
  });

  // 3. Cloudinary Images (Good)
  const cloudinaryImages = await prisma.place_images.count({
    where: {
      image_url: {
        contains: "cloudinary",
      },
    },
  });

  // 4. Places with NO images
  const placesWithNoImages = await prisma.places.count({
    where: {
      images: {
        none: {},
      },
    },
  });

  console.log(`\n---------------------------------`);
  console.log(`📍 Total Places:       ${totalPlaces}`);
  console.log(`---------------------------------`);
  console.log(
    `❌ Google Ref (Legcy): ${googleRefImages} images (Needs Migration)`
  );
  console.log(`✅ Cloudinary (Safe):  ${cloudinaryImages} images`);
  console.log(`⚠️  Places w/o Images: ${placesWithNoImages} places`);
  console.log(`---------------------------------\n`);

  if (googleRefImages > 0) {
    console.log(
      "👉 Recommendation: Run 'npx tsx scripts/enrich-places.ts' again to finish migration."
    );
  } else {
    console.log(
      "🎉 All Legacy Images Migrated! (You can safely disable Google Photos API Proxy if you want)"
    );
  }
}

checkStatus()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
