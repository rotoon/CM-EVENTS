/**
 * Tag Categories
 * จัดกลุ่ม tags ตามประเภท พร้อมสี
 */

export type TagCategory = "location" | "food" | "feature" | "other";

/**
 * Mapping: tag name → category
 */
export const TAG_CATEGORY_MAP: Record<string, TagCategory> = {
  // 📍 Location (โลเคชั่น)
  nimman: "location",
  oldcitywall: "location",
  trainstation: "location",
  thaphae: "location",
  suandok: "location",
  langmor: "location",
  chiangmai: "location",
  chiangrai: "location",
  santitham: "location",
  changklan: "location",
  maerim: "location",
  hangdong: "location",
  maejo: "location",
  huaykaew: "location",
  suthep: "location",
  airport: "location",
  nightbazaar: "location",
  riverside: "location",
  canal: "location",

  // 🍰 Food/Drink (อาหาร/เครื่องดื่ม)
  dessert: "food",
  bakery: "food",
  breakfast: "food",
  brunch: "food",
  lunch: "food",
  dinner: "food",
  coffee: "food",
  food: "food",
  noodle: "food",
  steak: "food",
  buffet: "food",
  seafood: "food",
  omakase: "food",
  finedining: "food",
  streetfood: "food",
  khaosoي: "food",
  saiua: "food",
  drinks: "food",
  cocktail: "food",
  wine: "food",
  beer: "food",
  tea: "food",
  icecream: "food",
  cake: "food",

  // ✨ Feature/Type (ประเภท/บริการ)
  cafe: "feature",
  workingspace: "feature",
  restaurant: "feature",
  bar: "feature",
  rooftop: "feature",
  livemusic: "feature",
  petfriendly: "feature",
  recommend: "feature",
  cozy: "feature",
  instagrammable: "feature",
  hidden: "feature",
  newopen: "feature",
  viewpoint: "feature",
  nature: "feature",
  temple: "feature",
  waterfall: "feature",
  mountain: "feature",
  nightlife: "feature",
  club: "feature",
  pub: "feature",
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
  feature: {
    bg: "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200",
    label: "ประเภท",
    labelEn: "Feature",
    emoji: "✨",
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
    feature: [],
    other: [],
  };

  for (const tag of tags) {
    const category = getTagCategory(tag);
    groups[category].push(tag);
  }

  return groups;
}
