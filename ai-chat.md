```markdown
# Chiang Mai Trip Itinerary Design for hypecnx + Perplexity API

แนวคิด: ใช้ Perplexity เป็น **trip planner engine** ที่สร้าง itinerary แบบ JSON โดยอิงข้อมูลอีเวนต์จาก DB `events` ของ hypecnx เป็น truth source หลัก จากนั้น backend ของ hypecnx ทำ post-processing/override อีกที [web:21][web:27]

---

## 1) JSON Schema สำหรับ Trip Itinerary

ออกแบบให้รองรับทั้งอีเวนต์จาก DB และสถานที่ทั่วไป (POI):
```

{
"tripMeta": {
"startDate": "2026-01-15",
"days": 3,
"travelerProfile": {
"style": ["cafe", "nature", "night_market"],
"budgetLevel": "medium",
"hasCar": true,
"notes": "ไม่ชอบเดินไกล"
},
"summary": "ทริปเชียงใหม่ 3 วันสไตล์คาเฟ่+ธรรมชาติ"
},
"days": [
{
"dayIndex": 1,
"date": "2026-01-15",
"theme": "ในเมือง + คาเฟ่",
"totalEstimatedCost": 1200,
"totalEstimatedDurationMinutes": 480,
"items": [
{
"sortOrder": 1,
"timeOfDay": "morning",
"startTime": "09:00",
"endTime": "11:00",
"durationMinutes": 120,
"place": {
"type": "event",
"eventId": 123,
"sourceUrl": "https://facebook.com/...",
"title": "เชียงใหม่อาร์ตมาร์เก็ต",
"shortDescription": "ตลาดนัดงานคราฟต์และศิลปะท้องถิ่น",
"locationText": "วันนิมมาน เชียงใหม่",
"latitude": 18.799,
"longitude": 98.967,
"googleMapsUrl": "https://maps.google.com/?q=...",
"coverImageUrl": "https://...",
"tags": ["market", "art", "local"],
"rating": 4.5,
"priceLevel": "low",
"isFromHiveDatabase": true
},
"notes": "แนะนำมาช่วงเช้า คนยังไม่เยอะมาก",
"estimatedCost": 300,
"travelFromPrevious": {
"distanceKm": 3.2,
"durationMinutes": 10,
"transportMode": "car",
"notes": "ขับรถจากที่พักแถวคูเมือง"
}
}
]
}
],
"overallNotes": "ปรับเวลาแต่ละช่วงตามสภาพการจราจรและสภาพอากาศในวันจริง"
}

```

### จุดออกแบบสำคัญ

- `tripMeta` แยก metadata ทริป (เอาไว้โชว์ header/summary) [web:21]
- `days[]` ถือข้อมูลรายวัน มี `items[]` เป็น activity/layer หลัก
- `place.type`:
  - `"event"` → ผูกกับ row ใน table `events`
  - `"poi"` → สถานที่ทั่วไป (ยังไม่อยู่ใน DB)
- `isFromHiveDatabase`:
  - `true` → เชื่อมกับ DB hypecnx (ใช้สำหรับ override ทีหลัง)
  - `false` → ข้อมูลที่ model propose เอง

---

## 2) Mapping กับ schema ใน DB `events`

จาก schema:

```

CREATE TABLE IF NOT EXISTS events (
id SERIAL PRIMARY KEY,
source_url TEXT UNIQUE NOT NULL,
title TEXT NOT NULL,
description TEXT,
location TEXT,
date_text TEXT,
month_wrapped TEXT,
cover_image_url TEXT,
first_scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
is_fully_scraped BOOLEAN DEFAULT FALSE,
time_text TEXT,
latitude REAL,
longitude REAL,
google_maps_url TEXT,
facebook_url TEXT,
is_ended BOOLEAN DEFAULT FALSE,
description_markdown TEXT
);

```

แนะนำ mapping ประมาณนี้:

- `place.eventId` ← `events.id`
- `place.sourceUrl` ← `events.source_url`
- `place.title` ← `events.title`
- `place.shortDescription` ← สร้างจาก `description_markdown` หรือ `description` (ตัดให้สั้น)
- `place.locationText` ← `events.location`
- `place.latitude` / `place.longitude` ← `events.latitude` / `events.longitude`
- `place.googleMapsUrl` ← `events.google_maps_url`
- `place.coverImageUrl` ← `events.cover_image_url`
- `place.tags` ← derive จาก keyword ใน `title/description` (ทำเพิ่มใน backend)
- `place.isFromHiveDatabase` ← `true`
- `place.priceLevel` / `place.rating`:
  - เริ่มต้นให้ model ประเมินคร่าว ๆ
  - หรือทำ field เสริมใน DB future version

---

## 3) Prompt Design สำหรับ Perplexity

### System Prompt

```

You are a Chiang Mai local trip planner and itinerary optimizer.

GOALS:

- Create an N-day trip itinerary in Chiang Mai.
- Prioritize using events and places from the given "hypecnx_events" list when possible.
- Respect opening hours, approximate travel times, and group nearby places in the same day.
- Output MUST be valid JSON following the provided JSON schema.

RULES:

- If a suitable place exists in "hypecnx_events", use it first, and set `place.type = "event"` and `place.isFromHiveDatabase = true`.
- If something is not in "hypecnx_events", you MAY suggest a general POI and set `place.type = "poi"` and `place.isFromHiveDatabase = false`.
- Use realistic but approximate `durationMinutes`, `estimatedCost`, and `travelFromPrevious`.
- Only include latitude, longitude, and googleMapsUrl if they are provided in "hypecnx_events" or can be reasonably inferred.
- DO NOT invent very specific prices; use rough ranges and `priceLevel` of "low" | "medium" | "high".
- Group places that are geographically close on the same day when possible.
- Avoid planning long-distance car rides at night for safety.

JSON OUTPUT SCHEMA (conceptual, not a JSON Schema object):

- Must follow exactly this structure:
  {
  "tripMeta": { ... },
  "days": [ ... ],
  "overallNotes": "string"
  }

Return ONLY JSON with no explanation text.

```

### User Prompt (template)

```

ผู้ใช้จะไปเชียงใหม่ {{days}} วัน เริ่มวันที่ {{startDate}}

โปรไฟล์ผู้ใช้:

- สไตล์เที่ยว: {{style_list}}
- งบประมาณต่อวัน: {{budget_per_day}} บาท
- มีรถเช่า: {{has_car}}
- หมายเหตุ: {{notes}}

นี่คือรายการ events จากฐานข้อมูล hypecnx (JSON array):

{{hypecnx_events_json}}

แต่ละ event มีฟิลด์:

- id, source_url, title, description, location, date_text, time_text,
  latitude, longitude, google_maps_url, facebook_url, is_ended, cover_image_url

เงื่อนไข:

- เลือก events ที่ยังไม่จบ (is_ended = false)
- ถ้า date_text ระบุช่วงวันที่ ให้ใช้เฉพาะเหตุการณ์ที่ตรงกับช่วงวันที่ทริป หรืออย่างน้อยอยู่ในเดือน/สัปดาห์เดียวกัน
- วางลำดับสถานที่แต่ละวันให้กลุ่มที่อยู่ใกล้กัน
- ใส่เวลาโดยประมาณ (startTime/endTime) แบบยืดหยุ่นได้
- เติมกิจกรรม/สถานที่อื่น ๆ (poi) ถ้าจำเป็น เพื่อให้แต่ละวันไม่โล่งเกินไป
- อย่าลืมค่าประมาณค่าใช้จ่าย และ travelFromPrevious (distanceKm, durationMinutes, transportMode)

ตอบกลับเป็น JSON ตาม schema ที่กำหนดใน system message เท่านั้น

```

> หมายเหตุ: `{{hypecnx_events_json}}` คือ JSON array ที่ serialize จาก rows ใน table `events` หลัง query filter มาแล้ว [web:27][web:30]

---

## 4) Flow การ Override ด้วย Data จาก DB hypecnx

การออกแบบ flow ให้ Perplexity เป็น “planner + selector” แต่ DB hypecnx เป็น source of truth:

### Step 1: Query DB ก่อนเรียก Perplexity

- Query `events` โดย filter:
  - `is_ended = false`
  - ช่วงวันที่ใกล้กับทริป (ใช้ `date_text` / `month_wrapped` เพื่อ filter แบบกว้าง ๆ)
- Normalize fields ให้ friendly ก่อนส่งเข้า prompt เช่น:

```

[
{
"id": 123,
"title": "เชียงใหม่อาร์ตมาร์เก็ต",
"location": "วันนิมมาน",
"dateText": "15-17 ม.ค. 2026",
"timeText": "10:00-22:00",
"latitude": 18.799,
"longitude": 98.967,
"googleMapsUrl": "https://maps.google.com/...",
"sourceUrl": "https://facebook.com/events/...",
"coverImageUrl": "https://...",
"isEnded": false
}
]

```

### Step 2: เรียก Perplexity เพื่อสร้าง Itinerary JSON

- ส่ง system + user prompt ตามด้านบน
- Model จะคืน JSON ที่มี `place.type = "event"`/`"poi"` + `eventId` ตามที่ให้ [web:27]

### Step 3: Post-processing / Override จาก DB

ฝั่ง backend:

1. Parse JSON ที่ได้จาก Perplexity
2. สำหรับทุก `day.items[].place`:
   - ถ้า `place.type === "event"` และ `place.isFromHiveDatabase === true`:
     - ใช้ `eventId` ไป query DB (หรือ lookup จาก cache/array ของ Step 1)
     - Override ฟิลด์สำคัญ:
       - `title`, `locationText`, `latitude`, `longitude`, `googleMapsUrl`, `coverImageUrl`
       - ถ้า DB บอกว่า `is_ended = true` (อัปเดตทีหลัง) → mark ว่า `place.isUnavailable = true` หรือเอาออกจาก itinerary
   - ถ้า `place.type === "poi"`:
     - ยังไม่มีใน DB:
       - แสดงผลตามที่ model ให้มา
       - optional: สร้าง `pois` table เพื่อบันทึกข้อมูลในอนาคต

3. Validate JSON หลัง override:
   - เช็กว่า `days[]` ไม่ว่าง
   - เช็กว่า activity แต่ละวันมีเวลา/ลำดับที่สมเหตุสมผล

### Step 4: Render ฝั่ง Frontend

- ใช้ itinerary JSON เวอร์ชัน override แล้ว
- UI แยกความต่าง:
  - Event จาก hypecnx:
    - แสดง badge/label เช่น “จาก hypecnx”
    - ใช้ภาพ/ลิงก์ Google Maps ที่แน่นอนจาก DB
  - POI ทั่วไป:
    - ใช้ข้อมูลแบบ generic
    - อาจมีปุ่ม “เพิ่มเข้า DB” สำหรับ admin

### Step 5: Caching & Logging (ควรมี)

- เก็บ:
  - raw JSON ที่ได้จาก Perplexity
  - JSON หลัง override
- ใช้สำหรับ:
  - debug เวลา format พัง
  - ให้ผู้ใช้กลับมาดูทริปที่เคยสร้างได้

---

## 5) แนวทางใช้ Structured Outputs จริง ๆ (Optional แต่แนะนำ)

Perplexity รองรับ structured outputs ซึ่งช่วยให้บังคับรูปแบบ JSON ตาม schema ได้ดีขึ้น [web:27][web:30].

แนวคิด:

- กำหนด JSON Schema (แบบ JSON Schema Draft) ใน backend:

```

{
"type": "object",
"properties": {
"tripMeta": {
"type": "object",
"properties": {
"startDate": { "type": "string" },
"days": { "type": "integer" },
"travelerProfile": {
"type": "object",
"properties": {
"style": { "type": "array", "items": { "type": "string" } },
"budgetLevel": { "type": "string" },
"hasCar": { "type": "boolean" },
"notes": { "type": "string" }
},
"required": ["style", "budgetLevel", "hasCar"]
},
"summary": { "type": "string" }
},
"required": ["startDate", "days", "travelerProfile"]
},
"days": {
"type": "array",
"items": {
"type": "object",
"properties": {
"dayIndex": { "type": "integer" },
"date": { "type": "string" },
"theme": { "type": "string" },
"totalEstimatedCost": { "type": "number" },
"totalEstimatedDurationMinutes": { "type": "integer" },
"items": {
"type": "array",
"items": {
"type": "object",
"properties": {
"sortOrder": { "type": "integer" },
"timeOfDay": { "type": "string" },
"startTime": { "type": "string" },
"endTime": { "type": "string" },
"durationMinutes": { "type": "integer" },
"place": {
"type": "object",
"properties": {
"type": { "type": "string" },
"eventId": { "type": ["integer", "null"] },
"sourceUrl": { "type": ["string", "null"] },
"title": { "type": "string" },
"shortDescription": { "type": ["string", "null"] },
"locationText": { "type": ["string", "null"] },
"latitude": { "type": ["number", "null"] },
"longitude": { "type": ["number", "null"] },
"googleMapsUrl": { "type": ["string", "null"] },
"coverImageUrl": { "type": ["string", "null"] },
"tags": {
"type": "array",
"items": { "type": "string" }
},
"rating": { "type": ["number", "null"] },
"priceLevel": { "type": ["string", "null"] },
"isFromHiveDatabase": { "type": "boolean" }
},
"required": ["type", "title", "isFromHiveDatabase"]
},
"notes": { "type": ["string", "null"] },
"estimatedCost": { "type": ["number", "null"] },
"travelFromPrevious": {
"type": "object",
"properties": {
"distanceKm": { "type": ["number", "null"] },
"durationMinutes": { "type": ["integer", "null"] },
"transportMode": { "type": ["string", "null"] },
"notes": { "type": ["string", "null"] }
}
}
},
"required": ["sortOrder", "timeOfDay", "place"]
}
}
},
"required": ["dayIndex", "date", "items"]
}
},
"overallNotes": { "type": "string" }
},
"required": ["tripMeta", "days", "overallNotes"]
}

```

- ส่ง schema นี้ไปกับ request ของ Perplexity เพื่อให้ model generate JSON ตามแบบที่กำหนด [web:27][web:30].

---

## 6) TL;DR สำหรับ implementation

- FE: form เลือกวัน/สไตล์ → call backend `/api/plan-trip`
- Backend `/api/plan-trip`:
  1. Query `events` ตามช่วงวัน, filter `is_ended = false`
  2. Serialize เป็น `hypecnx_events_json`
  3. เรียก Perplexity ด้วย system + user prompt + (optionally) structured output schema
  4. รับ JSON itinerary
  5. Post-process:
     - override ข้อมูล event จาก DB
     - validate / clean
  6. ส่ง JSON ให้ FE
- FE: render itinerary + map + UI ปรับแพลน

ไฟล์ markdown นี้สามารถโยนให้ antigravity ใช้เป็น spec/blueprint สำหรับออกแบบโค้ด/สถาปัตยกรรมต่อได้โดยตรง [web:21][web:27].
```
