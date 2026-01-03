import { Itinerary } from "./api-trip";

export const MOCK_ITINERARY: Itinerary = {
  tripMeta: {
    startDate: "2026-01-15",
    days: 5,
    travelerProfile: {
      style: ["cafe", "culture", "food", "nature", "nightlife"],
      budgetLevel: "medium",
      hasCar: true,
      areas: ["nimman", "old_city", "mae_rim", "hang_dong"],
      notes: "จัดเต็ม 5 วัน เน้นที่สวยๆ ของอร่อย และอีเวนต์เท่ๆ ทั่วเชียงใหม่",
    },
    summary: "5 Days HYPE Experience: The Ultimate Chiang Mai Collection",
  },
  days: [
    {
      dayIndex: 1,
      date: "15 Jan 2026",
      theme: "☕ NIMMAN VIBE & CRAFT",
      totalEstimatedCost: 1500,
      totalEstimatedDurationMinutes: 480,
      items: [
        {
          sortOrder: 1,
          timeOfDay: "Morning",
          startTime: "09:00",
          endTime: "10:30",
          durationMinutes: 90,
          place: {
            type: "poi",
            title: "Graph Quarter",
            shortDescription:
              "Specialty coffee in an industrial setting. Must try the 'Graph No. 16'.",
            locationText: "Sirimangkalajarn Soi 13",
            googleMapsUrl: "https://maps.app.goo.gl/nimman1",
            coverImageUrl:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
            priceLevel: "medium",
            isFromHiveDatabase: true,
            tags: ["Coffee", "Industrial", "Signature"],
          },
          notes: "กาแฟดีมาก แนะนำเมนูซิกเนเจอร์",
        },
        {
          sortOrder: 2,
          timeOfDay: "Midday",
          startTime: "11:30",
          endTime: "13:00",
          durationMinutes: 90,
          place: {
            type: "poi",
            title: "Kao Soy Nimman",
            shortDescription:
              "Michelin Guide Khao Soy. Get the Khao Soy Super for everything!",
            locationText: "Nimmana Haeminda Soi 7",
            googleMapsUrl: "https://maps.app.goo.gl/nimman2",
            coverImageUrl:
              "https://images.unsplash.com/photo-1707127113175-9c84777a456d?q=80&w=1000&auto=format&fit=crop",
            priceLevel: "medium",
            isFromHiveDatabase: true,
          },
          travelFromPrevious: {
            transportMode: "Car",
            durationMinutes: 10,
          },
        },
        {
          sortOrder: 3,
          timeOfDay: "Afternoon",
          startTime: "14:00",
          endTime: "17:00",
          durationMinutes: 180,
          place: {
            type: "event",
            title: "Chiang Mai Design Week",
            shortDescription:
              "Annual festival celebrating local creativity and design.",
            locationText: "Three Kings Monument",
            coverImageUrl:
              "https://images.unsplash.com/photo-1544650039-22886300435b?q=80&w=1000&auto=format&fit=crop",
            isFromHiveDatabase: true,
          },
          travelFromPrevious: {
            transportMode: "Car",
            durationMinutes: 15,
          },
        },
      ],
    },
    {
      dayIndex: 2,
      date: "16 Jan 2026",
      theme: "🛕 SPIRITUAL OLD CITY",
      totalEstimatedCost: 1200,
      totalEstimatedDurationMinutes: 420,
      items: [
        {
          sortOrder: 1,
          timeOfDay: "Morning",
          startTime: "08:30",
          endTime: "10:00",
          durationMinutes: 90,
          place: {
            type: "poi",
            title: "Wat Chedi Luang",
            shortDescription:
              "Historical temple featuring a massive ruined Lanna-style chedi.",
            locationText: "Phra Pok Klao Rd",
            googleMapsUrl: "https://maps.app.goo.gl/oldcity1",
            coverImageUrl:
              "https://images.unsplash.com/photo-1582234053243-77673f84767f?q=80&w=1000&auto=format&fit=crop",
            isFromHiveDatabase: true,
          },
        },
        {
          sortOrder: 2,
          timeOfDay: "Lunch",
          startTime: "12:00",
          endTime: "13:30",
          durationMinutes: 90,
          place: {
            type: "poi",
            title: "Huen Phen",
            shortDescription:
              "Authentic Northern Thai food in a traditional house.",
            locationText: "Ratchamanka Rd",
            priceLevel: "medium",
            isFromHiveDatabase: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop",
          },
          travelFromPrevious: {
            transportMode: "Walk",
            durationMinutes: 5,
          },
        },
        {
          sortOrder: 3,
          timeOfDay: "Evening",
          startTime: "18:00",
          endTime: "21:00",
          durationMinutes: 180,
          place: {
            type: "event",
            title: "Tha Phae Sunday Walking Street",
            shortDescription:
              "The biggest night market in Chiang Mai with local crafts and street food.",
            locationText: "Tha Phae Gate",
            isFromHiveDatabase: false,
            coverImageUrl:
              "https://images.unsplash.com/photo-1513813274643-2613dd9f25fa?q=80&w=1000&auto=format&fit=crop",
          },
        },
      ],
    },
    {
      dayIndex: 3,
      date: "17 Jan 2026",
      theme: "🏔️ MOUNTAIN AIR & SUNSET",
      totalEstimatedCost: 2000,
      totalEstimatedDurationMinutes: 500,
      items: [
        {
          sortOrder: 1,
          timeOfDay: "Morning",
          startTime: "07:00",
          endTime: "09:00",
          durationMinutes: 120,
          place: {
            type: "poi",
            title: "Wat Phra That Doi Suthep",
            shortDescription:
              "Iconic golden temple overlooking the city of Chiang Mai.",
            locationText: "Doi Suthep",
            coverImageUrl:
              "https://images.unsplash.com/photo-1528181304800-2f54029240c5?q=80&w=1000&auto=format&fit=crop",
            isFromHiveDatabase: true,
          },
        },
        {
          sortOrder: 2,
          timeOfDay: "Afternoon",
          startTime: "13:00",
          endTime: "16:00",
          durationMinutes: 180,
          place: {
            type: "poi",
            title: "Mae Rim Forest Adventure",
            shortDescription:
              "ziplining and jungle trekking in the lush Mae Rim valley.",
            locationText: "Mae Rim",
            priceLevel: "high",
            isFromHiveDatabase: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
          },
          travelFromPrevious: {
            transportMode: "Car",
            durationMinutes: 45,
          },
        },
      ],
    },
    {
      dayIndex: 4,
      date: "18 Jan 2026",
      theme: "🎨 ARTISTIC SOUL",
      totalEstimatedCost: 1000,
      totalEstimatedDurationMinutes: 400,
      items: [
        {
          sortOrder: 1,
          timeOfDay: "Morning",
          startTime: "10:00",
          endTime: "12:00",
          durationMinutes: 120,
          place: {
            type: "poi",
            title: "Baan Kang Wat",
            shortDescription:
              "Handicrafts village with artist workshops and cafes.",
            locationText: "Suthep",
            coverImageUrl:
              "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
            isFromHiveDatabase: true,
          },
        },
        {
          sortOrder: 2,
          timeOfDay: "Afternoon",
          startTime: "14:00",
          endTime: "16:30",
          durationMinutes: 150,
          place: {
            type: "poi",
            title: "MAIIAM Contemporary Art Museum",
            shortDescription:
              "Stunning museum with a mirrored facade featuring modern Thai art.",
            locationText: "Sankampaeng",
            googleMapsUrl: "https://maps.app.goo.gl/maiiam",
            coverImageUrl:
              "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1000&auto=format&fit=crop",
            isFromHiveDatabase: true,
          },
          travelFromPrevious: {
            transportMode: "Car",
            durationMinutes: 30,
          },
        },
      ],
    },
    {
      dayIndex: 5,
      date: "19 Jan 2026",
      theme: "🍸 NIGHTLIFE & FAREWELL",
      totalEstimatedCost: 2500,
      totalEstimatedDurationMinutes: 360,
      items: [
        {
          sortOrder: 1,
          timeOfDay: "Evening",
          startTime: "18:00",
          endTime: "20:00",
          durationMinutes: 120,
          place: {
            type: "poi",
            title: "The Riverside Bar & Restaurant",
            shortDescription:
              "Classic riverside dining with live music and amazing views.",
            locationText: "Charoen Rat Rd",
            priceLevel: "high",
            isFromHiveDatabase: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
          },
        },
        {
          sortOrder: 2,
          timeOfDay: "Night",
          startTime: "21:00",
          endTime: "23:59",
          durationMinutes: 180,
          place: {
            type: "event",
            title: "North Gate Jazz Co-op",
            shortDescription: "Legendary jazz bar with nightly jam sessions.",
            locationText: "Chang Phuak Gate",
            isFromHiveDatabase: true,
            coverImageUrl:
              "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
          },
          travelFromPrevious: {
            transportMode: "Car",
            durationMinutes: 10,
          },
        },
      ],
    },
  ],
  overallNotes:
    "ปิดท้ายทริปเชียงใหม่สุด HYPE ด้วยบรรยากาศ Jazz และดินเนอร์ริมแม่น้ำ อย่าลืมเช็คเวลาเปิด-ปิด ของแต่ละที่ด้วยนะ!",
};
