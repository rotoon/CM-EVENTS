import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import * as cheerio from "cheerio";
import "dotenv/config";

const url =
  "https://www.cmhy.city/event/1695-Chiang-Mai-International-Food-Festival-2026-CMFF";

// ============================================================================
// Logic copied from detail-scraper.service.ts
// ============================================================================

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function getBrowserHeaders(url: string) {
  const parsedUrl = new URL(url);
  return {
    "User-Agent": getRandomUserAgent(),
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Ch-Ua":
      '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    Referer: `${parsedUrl.protocol}//${parsedUrl.host}/`,
  };
}

async function rewriteDescriptionWithAI(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  rawHTML: string
): Promise<string> {
  if (!rawHTML || rawHTML.length < 50) return rawHTML || "";

  try {
    const prompt = `
    Rewrite the following event description into clean, engaging markdown.
    - Extract key details: Highlights, Agenda (if any).
    - Keep it concise but informative.
    - Format with headers, bullet points, and bold text.
    - Remove any "Share this event" or irrelevant footer text.
    - Translate strictly to Thai language if the original is English.
    
    Raw HTML content:
    ${rawHTML.substring(0, 15000)} -- truncated
    `;

    const result = await model.generateContent(prompt);
    const markdown = result.response.text().trim();
    return markdown || rawHTML;
  } catch (err: unknown) {
    console.error("⚠️ AI rewrite failed:", err);
    return rawHTML;
  }
}

// ============================================================================
// Test Runner
// ============================================================================

async function scrapeReal() {
  console.log("🚀 Starting Full Scraper Test (with AI) for:", url);
  console.log("----------------------------------------");

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    const { data } = await axios.get(url, {
      headers: getBrowserHeaders(url),
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // 1. JSON-LD Extraction (Best for Lat/Lng)
    let lat: number | null = null;
    let lng: number | null = null;
    const jsonLdContent = $('script[type="application/ld+json"]').html();

    if (jsonLdContent) {
      try {
        const jsonLd = JSON.parse(jsonLdContent);
        if (jsonLd && jsonLd.geo) {
          lat = parseFloat(jsonLd.geo.latitude);
          lng = parseFloat(jsonLd.geo.longitude);
        } else if (jsonLd && Array.isArray(jsonLd)) {
          // Sometimes it's an array
          const eventSchema = jsonLd.find(
            (item: any) =>
              item["@type"] === "Event" && item.location && item.location.geo
          );
          if (eventSchema) {
            lat = parseFloat(eventSchema.location.geo.latitude);
            lng = parseFloat(eventSchema.location.geo.longitude);
          }
        }
      } catch (e) {
        console.error("⚠️ Failed to parse JSON-LD:", e);
      }
    }

    // Fallback: Regex from scripts (L.marker or setView)
    if (!lat || !lng) {
      const scriptContent = $("script").text();
      // Look for L.marker([lat, lng]) or setView([lat, lng])
      const geoMatch = scriptContent.match(/\[([0-9.]+),\s*([0-9.]+)\]/);
      if (geoMatch) {
        lat = parseFloat(geoMatch[1]);
        lng = parseFloat(geoMatch[2]);
      }
    }

    // 2. Metadata (Time, Map, FB)
    let timeText = "";
    // Time is usually in the first ul.list-unstyled inside section.pb-3
    const timeLi = $("section.pb-3 ul.list-unstyled li").filter(
      (_, el) => $(el).find(".bi-calendar3-week").length > 0
    );
    if (timeLi.length) {
      timeText = timeLi.text().trim().replace(/\s+/g, " "); // Clean excessive whitespace
    }

    const mapLink = $('a[href*="maps.google.com"]').attr("href") || "";
    const facebookLink = $('a[href*="facebook.com"]').attr("href") || "";

    // 3. Description Extraction
    // Logic: Get section.pb-3 text but REMOVE the metadata parts
    const contentSection = $("section.pb-3").clone();

    // Remove known garbage elements from the clone
    contentSection.find("h3").remove(); // Title
    contentSection.find("ul.list-unstyled").remove(); // Metadata (Time, Location, etc.)
    contentSection.find(".activity-image").remove(); // Main Banner
    contentSection.find(".img-fluid").remove(); // Gallery Images
    contentSection.find("#map").remove(); // Map Container
    contentSection.find("script").remove(); // Scripts
    contentSection.find("style").remove(); // Styles

    // What remains should be the description paragraphs
    let descriptionHtml = contentSection.html() || "";

    // Clean description for logging
    const cleanDesc = contentSection.text().trim().substring(0, 100) + "...";

    const bannerSrc = $("img.activity-image").attr("src") || "";
    const isEnded = /Event has ended|จบกิจกรรมแล้ว/i.test(data);

    // 4. Images Logic
    const imageUrls = new Set<string>();

    // Banner
    if (bannerSrc) imageUrls.add(bannerSrc);

    // Gallery (.img-fluid) filtering
    const allImgFluid: string[] = [];
    $("img.img-fluid").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      if (src && src.startsWith("http")) allImgFluid.push(src);
    });

    if (allImgFluid.length > 3) {
      // Logic: Skip 1st (Banner) and Last 2 (Likely unrelated/promo)
      const galleryImages = allImgFluid.slice(1, -2);
      galleryImages.forEach((src) => imageUrls.add(src));
    } else if (allImgFluid.length > 0) {
      // Fallback if few images found
      allImgFluid.forEach((src) => {
        if (src !== bannerSrc) imageUrls.add(src);
      });
    }

    // 3. AI Processing
    console.log("🤖 Generating AI Description...");
    const enhancedDescription = await rewriteDescriptionWithAI(
      model,
      descriptionHtml
    );

    // 4. Output Results
    console.log("\n📌 Basic Info:");
    console.log("   - Time:", timeText);
    console.log("   - Map:", mapLink);
    console.log("   - FB:", facebookLink);
    console.log(`   - Lat/Lng: ${lat}, ${lng}`);
    console.log(`   - Ended: ${isEnded}`);
    console.log(`   - Desc (First 100 chars): ${cleanDesc}`);
    console.log("\n🖼️  Images:");
    console.log("   - Banner:", bannerSrc);
    console.log(`   - Total Unique Images: ${imageUrls.size}`);
    console.log("   - List:");
    Array.from(imageUrls).forEach((img, i) =>
      console.log(`     [${i}] ${img}`)
    );

    console.log("\n🧠 AI Enhanced Description:");
    console.log("----------------------------------------");
    console.log(enhancedDescription);
    console.log("----------------------------------------");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("❌ Axios Error:", err.message, err.response?.status);
    } else {
      console.error("❌ Error:", err);
    }
  }
}

scrapeReal();
