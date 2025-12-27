export interface CategoryDef {
  id: string;
  label: string; // Internal or display label
  keywords: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "festival",
    label: "Festival",
    keywords: [
      "festival",
      "countdown",
      "new year",
      "christmas",
      "yepeng",
      "songkran",
      "loy krathong",
      "เทศกาล",
      "ประเพณี",
      "ปีใหม่",
      "คริสต์มาส",
      "ยี่เป็ง",
      "ลอยกระทง",
      "สงกรานต์",
      "งานวัด",
      "งานฉลอง",
      "สืบสาน",
      "พิธี",
    ],
  },
  {
    id: "music",
    label: "Music",
    keywords: [
      "music",
      "concert",
      "live",
      "band",
      "dj",
      "performance",
      "dance",
      "ดนตรี",
      "คอนเสิร์ต",
      "แสดงสด",
      "วงดนตรี",
      "นักร้อง",
      "ศิลปิน",
      "ดีเจ",
      "เต้น",
      "โชว์",
    ],
  },
  {
    id: "art",
    label: "Art",
    keywords: [
      "art",
      "gallery",
      "exhibition",
      "museum",
      "craft",
      "design",
      "showcase",
      "expo",
      "ศิลปะ",
      "นิทรรศการ",
      "หอศิลป์",
      "งานฝีมือ",
      "วาดภาพ",
      "งานออกแบบ",
      "งานศิลป์",
      "แกลเลอรี่",
      "โชว์เคส",
    ],
  },
  {
    id: "market",
    label: "Market",
    keywords: [
      "market",
      "fair",
      "sale",
      "shop",
      "bazaar",
      "walking street",
      "flea market",
      "street market",
      "expo",
      "show",
      "ตลาด",
      "กาด",
      "ถนนคนเดิน",
      "ขายของ",
      "ช้อปปิ้ง",
      "ตลาดนัด",
      "งานแฟร์",
      "ลดราคา",
      "มาร์เก็ต",
    ],
  },
  {
    id: "workshop",
    label: "Workshop",
    keywords: [
      "workshop",
      "class",
      "course",
      "learning",
      "seminar",
      "training",
      "talk",
      "เวิร์กช็อป",
      "อบรม",
      "สอน",
      "เรียน",
      "สัมมนา",
      "บรรยาย",
      "คอร์ส",
      "ฝึกอบรม",
    ],
  },
  {
    id: "food",
    label: "Food",
    keywords: [
      "food",
      "restaurant",
      "dining",
      "buffet",
      "eat",
      "drink",
      "street food",
      "อาหาร",
      "ร้านอาหาร",
      "ของกิน",
      "บุฟเฟต์",
      "สตรีทฟู้ด",
      "กิน",
      "ชิม",
      "เครื่องดื่ม",
    ],
  },
  {
    id: "cafe",
    label: "Cafe",
    keywords: [
      "cafe",
      "coffee",
      "bakery",
      "dessert",
      "tea",
      "คาเฟ่",
      "กาแฟ",
      "ขนม",
      "ของหวาน",
      "เบเกอรี่",
      "โรงคั่ว",
    ],
  },
];

export function getCategoryKeywords(categoryId: string): string[] {
  const category = CATEGORIES.find(
    (c) => c.id.toLowerCase() === categoryId.toLowerCase()
  );

  const keywords = new Set<string>();
  keywords.add(categoryId.toLowerCase());

  if (category) {
    category.keywords.forEach((k) => keywords.add(k.toLowerCase()));
  }

  return Array.from(keywords);
}
