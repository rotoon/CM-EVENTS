/**
 * Import Places Script
 * นำเข้าข้อมูลร้านอาหาร/คาเฟ่จาก newbie.cnx_posts_cleaned.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "../src/lib/prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PostData {
  post_number: number;
  date: string;
  url: string;
  place_name: string;
  place_type: string;
  caption: string;
  hashtags: string[];
  hashtags_count: number;
  categories: string[];
  categories_count: number;
  likes: number;
  comments: number;
  location: null;
  post_type: string;
}

async function importPlaces() {
  console.log("🚀 Starting import...");

  // อ่านไฟล์ JSON
  const jsonPath = path.join(__dirname, "../db/newbie.cnx_posts_cleaned.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const posts: PostData[] = JSON.parse(rawData);

  console.log(`📦 Found ${posts.length} places to import`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    try {
      // สร้าง place
      const place = await prisma.places.create({
        data: {
          name: post.place_name,
          place_type: post.place_type,
          description: post.caption,
          instagram_url: post.url,
          likes: post.likes,
          comments: post.comments,
          post_date: new Date(post.date),
        },
      });

      // สร้าง categories
      if (post.categories && post.categories.length > 0) {
        await prisma.place_categories.createMany({
          data: post.categories.map((cat) => ({
            place_id: place.id,
            category: cat,
          })),
          skipDuplicates: true,
        });
      }

      successCount++;

      // แสดง progress ทุก 100 รายการ
      if (successCount % 100 === 0) {
        console.log(`✅ Imported ${successCount}/${posts.length}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error importing "${post.place_name}":`, error);
    }
  }

  console.log("\n📊 Import Summary:");
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${posts.length}`);
}

async function main() {
  try {
    await importPlaces();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
