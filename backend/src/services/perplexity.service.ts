import axios from "axios";

import {
  ITripPlannerService,
  LocalEvent,
  TripCriteria,
} from "../types/trip-planner.interface";

export class PerplexityService implements ITripPlannerService {
  private apiKey: string;
  private apiUrl = "https://api.perplexity.ai/chat/completions";

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || "";
    if (!this.apiKey) {
      console.warn("WARNING: PERPLEXITY_API_KEY is not set.");
    }
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
- ALWAYS provide a descriptive \`locationText\` for every event and POI. Do not leave it empty.
- For POIs, attempt to provide a valid \`googleMapsUrl\` or \`socialMediaUrl\` (Facebook/Instagram) if known.
- If a place has a Social Media page (Facebook, Instagram), provide it in \`socialMediaUrl\`.
- ALWAYS populate \`coverImageUrl\` by finding a real image URL for the place.
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
      "areas": ["string"],
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
- สำคัญมาก: ต้องระบุ locationText ของทุกสถานที่ให้ชัดเจน (เช่น ชื่อถนน, ย่าน, หรือตำบล) และพยายามหา Google Maps URL ถ้าทำได้
- หากมี Social Media (Facebook, Instagram) ให้ใส่ใน socialMediaUrl
- ต้องระบุ coverImageUrl เสมอ (ใช้ของเดิมถ้ามี หรือหาใหม่ถ้าเป็น POI)

ตอบกลับเป็น JSON ตาม schema ที่กำหนดใน system message เท่านั้น
`;
  }

  async generateItinerary(criteria: TripCriteria, localEvents: LocalEvent[]) {
    // If no API key, return null or throw error
    if (!this.apiKey) {
      throw new Error("Perplexity API Key is missing");
    }

    const systemPrompt = this.constructSystemPrompt();
    const userPrompt = this.constructUserPrompt(criteria, localEvents);

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: "sonar", // 'sonar' is faster than 'sonar-pro' but still good at reasoning
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2, // Low temperature for more deterministic/structured output
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const content = response.data.choices[0].message.content;

      // Clean up markdown code blocks if present
      let jsonString = content;
      if (content.includes("```json")) {
        jsonString = content.split("```json")[1].split("```")[0];
      } else if (content.includes("```")) {
        jsonString = content.split("```")[1].split("```")[0];
      }

      try {
        const itinerary = JSON.parse(jsonString.trim());
        return itinerary;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw Content:", content);
        throw new Error("Failed to parse itinerary JSON from AI response");
      }
    } catch (error) {
      console.error("Perplexity API Error:", error);
      throw error;
    }
  }
}
