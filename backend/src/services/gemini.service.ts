import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ITripPlannerService,
  LocalEvent,
  TripCriteria,
} from "../types/trip-planner.interface";

export class GeminiService implements ITripPlannerService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", // Use a capable model
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
      tools: [
        {
          googleSearch: {},
        } as any,
      ],
      systemInstruction: this.constructSystemPrompt(),
    });
  }

  private constructSystemPrompt(): string {
    return `You are a Chiang Mai local trip planner and itinerary optimizer.

GOALS:
- Create an N-day trip itinerary in Chiang Mai.
- Suggest popular events and places suitable for the user profile.
- Respect opening hours, approximate travel times, and group nearby places in the same day.
- Output MUST be valid JSON following the provided JSON schema.

RULES:
- Suggest general POI or known events and set \`place.type = "poi"\` (or "event" if known).
- Use realistic but approximate \`durationMinutes\`, \`estimatedCost\`, and \`travelFromPrevious\`.
- Only include latitude, longitude if they can be reasonably inferred.
- DO NOT invent very specific prices; use rough ranges and \`priceLevel\` of "low" | "medium" | "high".
- ALWAYS populate \`locationText\` with a real address found via Google Search. Do not leave it empty.
- ALWAYS populate \`googleMapsUrl\` by finding a real map link via Google Search.
- If a place has a Social Media page (Facebook, Instagram), provide it in \`socialMediaUrl\`.
- ALWAYS populate \`coverImageUrl\` by finding a real image URL for the place using the Google Search tool.
- Group places that are geographically close on the same day when possible.
- Avoid planning long-distance car rides at night for safety.
- STRICTLY return ONLY the JSON object. No markdown code blocks, no explanation text before or after.

JSON OUTPUT SCHEMA:
{
  "tripMeta": {
    "startDate": "YYYY-MM-DD",
    "days": number,
    "travelerProfile": {
      "style": ["string"],
      "budgetLevel": "string",
      "hasCar": boolean,
      "notes": "string"
    },
    "summary": "string"
  },
  "days": [
    {
      "dayIndex": number,
      "date": "YYYY-MM-DD",
      "theme": "string",
      "totalEstimatedCost": number,
      "totalEstimatedDurationMinutes": number,
      "items": [
        {
          "sortOrder": number,
          "timeOfDay": "morning" | "afternoon" | "evening",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "durationMinutes": number,
          "place": {
            "type": "event" | "poi",
            "eventId": number | null,
            "title": "string",
            "shortDescription": "string",
            "locationText": "string",
            "latitude": number | null,
            "longitude": number | null,
            "googleMapsUrl": "string | null",
            "socialMediaUrl": "string | null",
            "coverImageUrl": "string | null",
            "tags": ["string"],
            "rating": number | null,
            "priceLevel": "low" | "medium" | "high",
            "isFromHiveDatabase": boolean
          },
          "notes": "string",
          "estimatedCost": number,
          "travelFromPrevious": {
            "distanceKm": number,
            "durationMinutes": number,
            "transportMode": "car" | "walk" | "grab",
            "notes": "string"
          }
        }
      ]
    }
  ],
  "overallNotes": "string"
}`;
  }

  private constructUserPrompt(
    criteria: TripCriteria,
    localEvents: LocalEvent[]
  ): string {
    // NOTE: User requested to temporally disable using local events for faster generation / simplicity.
    // const eventsJson = JSON.stringify(localEvents);

    return `ผู้ใช้จะไปเชียงใหม่ ${criteria.days} วัน เริ่มวันที่ ${
      criteria.startDate
    }

โปรไฟล์ผู้ใช้:
- สไตล์เที่ยว: ${criteria.travelerProfile.style.join(", ")}
- โซนที่พัก/ที่ชอบ: ${criteria.travelerProfile.areas?.join(", ") || "ไม่ระบุ"}
- งบประมาณต่อวัน: ${criteria.travelerProfile.budgetLevel}
- มีรถเช่า: ${criteria.travelerProfile.hasCar ? "มี" : "ไม่มี"}
- หมายเหตุ: ${criteria.travelerProfile.notes || "-"}

เงื่อนไข:
- วางลำดับสถานที่แต่ละวันให้กลุ่มที่อยู่ใกล้กัน
- ใส่เวลาโดยประมาณ (startTime/endTime) แบบยืดหยุ่นได้
- เติมกิจกรรม/สถานที่อื่น ๆ (poi) ให้เหมาะสม
- อย่าลืมค่าประมาณค่าใช้จ่าย และ travelFromPrevious (distanceKm, durationMinutes, transportMode)
- สำคัญมาก: ต้องใช้ Google Search หาที่อยู่จริงเพื่อระบุใน locationText และหา Google Maps URL เสมอ
- หากมี Social Media (Facebook, Instagram) ให้ใส่ใน socialMediaUrl
- ต้องระบุ coverImageUrl เสมอ (ใช้ของเดิมถ้ามี หรือหาใหม่ถ้าเป็น POI)

ตอบกลับเป็น JSON ตาม schema ที่กำหนดใน system message เท่านั้น
`;
  }

  async generateItinerary(criteria: TripCriteria, localEvents: LocalEvent[]) {
    if (!this.genAI) {
      throw new Error("Gemini API Key is missing");
    }

    const userPrompt = this.constructUserPrompt(criteria, localEvents);

    try {
      const result = await this.model.generateContent(userPrompt);
      const response = await result.response;
      const text = response.text();

      // Ultra-robust extraction: find the known start key "tripMeta"
      // This ignores any conversational filler like "Here is the plan for {3} days..."
      const anchorKey = '"tripMeta"';
      const anchorIndex = text.indexOf(anchorKey);

      let jsonString = text;

      if (anchorIndex !== -1) {
        // Walk backwards to find the opening brace of this object
        const firstBrace = text.lastIndexOf("{", anchorIndex);
        const lastBrace = text.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonString = text.substring(firstBrace, lastBrace + 1);
        }
      } else {
        // Fallback to simple brace detection if schema changed or something weird
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonString = text.substring(firstBrace, lastBrace + 1);
        }
      }

      try {
        const itinerary = JSON.parse(jsonString);
        return itinerary;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Extracted JSON:", jsonString.slice(0, 200) + "...");

        const snippet = text.slice(0, 500);
        throw new Error(
          `Failed to parse itinerary JSON from AI response. Snippet: ${snippet}...`
        );
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}
