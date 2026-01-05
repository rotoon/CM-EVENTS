import prisma from "../src/lib/prisma";

async function resetImages() {
  console.log("🗑️  Cleaning up bad Cloudinary images...");

  // Delete all images that are from Cloudinary (bad run)
  const { count } = await prisma.place_images.deleteMany({
    where: {
      image_url: {
        contains: "cloudinary",
      },
    },
  });

  console.log(`✅ Deleted ${count} bad image records.`);

  // Also verify if we need to reset google_ref ones?
  // No, google_ref ones are fine to keep if we didn't touch them.
}

resetImages()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
