/**
 * Tag Categories
 * จัดกลุ่ม tags ตามประเภท พร้อมสี
 * อัพเดท: รองรับ 100+ tags จาก database
 */

export type TagCategory =
  | "location"
  | "food"
  | "cuisine"
  | "feature"
  | "recommend"
  | "accommodation"
  | "excluded"
  | "other";

/**
 * Mapping: tag name → category
 */
export const TAG_CATEGORY_MAP: Record<string, TagCategory> = {
  // ═══════════════════════════════════════════════════════════════
  // 📍 LOCATION (โลเคชั่นในเชียงใหม่และใกล้เคียง)
  // ═══════════════════════════════════════════════════════════════
  // ย่านยอดนิยม
  nimman: "location",
  thaphae: "location",
  oldcitywall: "location",
  suandok: "location",
  langmor: "location",
  changphuak: "location",
  wualai: "location",
  trainstation: "location",

  // อำเภอ/ตำบล
  maerim: "location",
  hangdong: "location",
  chiangdao: "location",
  sankamphaeng: "location",
  sansai: "location",
  maetaeng: "location",
  maeon: "location",
  khlongchon: "location",

  // ย่านในเมือง
  jedyod: "location",
  fahham: "location",
  patan: "location",
  changkhian: "location",
  ruamchok: "location",
  nonghoi: "location",
  payap: "location",
  sanpheesua: "location",
  padaet: "location",

  // จังหวัดใกล้เคียง
  chiangrai: "location",
  chiangraicafe: "location",
  chiangraitravel: "location",
  chiangraifood: "location",
  lamphun: "location",
  lamphuncafe: "location",
  lamphunfood: "location",
  lampang: "location",
  lampangcafe: "location",
  chiangmailand: "location",

  // ═══════════════════════════════════════════════════════════════
  // � FOOD (มื้ออาหาร/ประเภทอาหารทั่วไป)
  // ═══════════════════════════════════════════════════════════════
  // มื้ออาหาร
  food: "food",
  breakfast: "food",
  brunch: "food",
  lunch: "food",
  dinner: "food",

  // ประเภทอาหาร
  dessert: "food",
  bakery: "food",
  noodle: "food",
  buffet: "food",
  seafood: "food",
  meatlovers: "food",
  shabu: "food",
  burger: "food",

  // เครื่องดื่ม
  drinking: "food",

  // อาหารไทย
  thaifood: "food",
  northernfood: "food",
  southernfood: "food",

  // ขนม/ตลาด

  localmarket: "food",

  // ═══════════════════════════════════════════════════════════════
  // 🌏 CUISINE (อาหารต่างชาติ - ไม่ใช่สถานที่ต่างประเทศ)
  // ═══════════════════════════════════════════════════════════════
  japfood: "cuisine",
  koreanfood: "cuisine",
  italianfood: "cuisine",
  vietnamfood: "cuisine",
  chinesefood: "cuisine",
  indianfood: "cuisine",

  // ═══════════════════════════════════════════════════════════════
  // ✨ FEATURE (ประเภทร้าน/บริการ/สไตล์)
  // ═══════════════════════════════════════════════════════════════
  // ประเภทร้าน
  cafe: "feature",
  restaurant: "feature",
  bar: "feature",
  rooftop: "feature",
  workingspace: "feature",

  // สไตล์/บริการ
  travel: "feature",
  nightchillin: "feature",
  yumzaab: "feature",
  chefstable: "feature",
  workshop: "feature",

  // ═══════════════════════════════════════════════════════════════
  // ⭐ RECOMMEND (แนะนำ)
  // ═══════════════════════════════════════════════════════════════
  recommend: "recommend",
  chiangrairecommend: "recommend",
  chiangraiwheretostay: "recommend",

  // ═══════════════════════════════════════════════════════════════
  // 🏨 ACCOMMODATION (ที่พัก)
  // ═══════════════════════════════════════════════════════════════
  wheretostay: "accommodation",
  recommendstay: "accommodation",

  // ═══════════════════════════════════════════════════════════════
  // 🚫 EXCLUDED (ต่างประเทศ/จังหวัดอื่น - ไม่แสดงใน UI)
  // ═══════════════════════════════════════════════════════════════
  // ญี่ปุ่น
  japan: "excluded",
  japancafe: "excluded",
  japanrecommend: "excluded",
  japankyoto: "excluded",
  japantravel: "excluded",
  japanfood: "excluded",
  japandessert: "excluded",

  // เกาหลี
  korea: "excluded",
  koreatravel: "excluded",
  korearecommend: "excluded",
  koreacafe: "excluded",
  koreafood: "excluded",
  koreadessert: "excluded",

  // ไต้หวัน
  taiwan: "excluded",
  taiwancafe: "excluded",
  taiwanrecommend: "excluded",
  taiwantravel: "excluded",
  taiwanfood: "excluded",
  taiwandessert: "excluded",

  // สุราษฎร์ธานี
  surat: "excluded",
  suratfood: "excluded",
  suratcafe: "excluded",
  surattravel: "excluded",
  suratrecommend: "excluded",

  //ขนอม
  khanom: "excluded",
  khanomcafe: "excluded",
  khanomfood: "excluded",
  khanomwheretostay: "excluded",
};

/**
 * Category → Style config
 */
export const TAG_CATEGORY_STYLES: Record<
  TagCategory,
  { bg: string; label: string; labelEn: string; emoji: string }
> = {
  location: {
    bg: "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200",
    label: "โลเคชั่น",
    labelEn: "Location",
    emoji: "📍",
  },
  food: {
    bg: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200",
    label: "อาหาร",
    labelEn: "Food & Drink",
    emoji: "🍰",
  },
  cuisine: {
    bg: "bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200",
    label: "อาหารต่างชาติ",
    labelEn: "International",
    emoji: "🌏",
  },
  feature: {
    bg: "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200",
    label: "ประเภท",
    labelEn: "Feature",
    emoji: "✨",
  },
  recommend: {
    bg: "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200",
    label: "แนะนำ",
    labelEn: "Recommend",
    emoji: "⭐",
  },
  accommodation: {
    bg: "bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200",
    label: "ที่พัก",
    labelEn: "Accommodation",
    emoji: "🏨",
  },
  excluded: {
    bg: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
    label: "ไม่แสดง",
    labelEn: "Excluded",
    emoji: "🚫",
  },
  other: {
    bg: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
    label: "อื่นๆ",
    labelEn: "Other",
    emoji: "🏷️",
  },
};

/**
 * Get category for a tag
 */
export function getTagCategory(tag: string): TagCategory {
  const normalized = tag.toLowerCase().replace(/[^a-z]/g, "");
  return TAG_CATEGORY_MAP[normalized] || "other";
}

/**
 * Group tags by category
 */
export function groupTagsByCategory(
  tags: string[]
): Record<TagCategory, string[]> {
  const groups: Record<TagCategory, string[]> = {
    location: [],
    food: [],
    cuisine: [],
    feature: [],
    recommend: [],
    accommodation: [],
    excluded: [],
    other: [],
  };

  for (const tag of tags) {
    const category = getTagCategory(tag);
    groups[category].push(tag);
  }

  return groups;
}
