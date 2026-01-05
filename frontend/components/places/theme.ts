/**
 * Theme configuration for Places components
 * รวม variant styles ทั้งหมดไว้ที่เดียว เพื่อลดความซ้ำซ้อน
 */

export type PlaceVariant =
  | "default"
  | "cafe"
  | "food"
  | "restaurant"
  | "travel"
  | "nightlife"
  | "featured";

// Emoji mapping for place types
export const TYPE_EMOJI: Record<string, string> = {
  All: "🗺️",
  Cafe: "☕",
  Food: "🍜",
  Restaurant: "🍽️",
  Travel: "🌿",
  "Bar/Nightlife": "🍸",
};

// Sticker mapping for place types
export const PLACE_TYPE_STICKERS: Record<string, string> = {
  Cafe: "cafe",
  Food: "food",
  Restaurant: "food",
  Travel: "nature",
  "Bar/Nightlife": "nightlife",
  Shopping: "shopping",
  Art: "art",
};

// Type styles for PlaceCard
export const TYPE_STYLES: Record<
  string,
  { bg: string; text: string; emoji: string }
> = {
  Cafe: { bg: "bg-neo-purple", text: "text-white", emoji: "☕" },
  Food: { bg: "bg-neo-pink", text: "text-white", emoji: "🍜" },
  Restaurant: { bg: "bg-neo-lime", text: "text-black", emoji: "🍽️" },
  Travel: { bg: "bg-neo-cyan", text: "text-black", emoji: "🌿" },
  "Bar/Nightlife": { bg: "bg-neo-black", text: "text-white", emoji: "🍸" },
};

// Variant theme configuration
export interface VariantTheme {
  // Search bar
  searchGlow: string;
  searchInput: string;
  searchIcon: string;
  searchClear: string;
  // Category chips
  chipBase: string;
  chipActive: string;
  chipInactive: string;
  // Results text
  resultsText: string;
  resultsCount: string;
  resultsType: string;
  // Card styles
  cardBase: string[];
  cardText: string;
  cardHoverText: string;
}

export const VARIANT_THEMES: Record<PlaceVariant, VariantTheme> = {
  default: {
    searchGlow: "bg-gradient-to-r from-neo-lime via-neo-pink to-neo-cyan",
    searchInput:
      "bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-neo-black font-black focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none",
    searchIcon: "text-neo-black",
    searchClear: "bg-neo-pink text-white border-2 border-neo-black",
    chipBase: "border-2",
    chipActive:
      "bg-neo-purple text-white border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]",
    chipInactive:
      "bg-black text-white border-neo-lime hover:bg-neo-lime hover:text-black hover:border-black",
    resultsText: "text-white",
    resultsCount: "text-neo-lime",
    resultsType: "text-neo-pink",
    cardBase: [
      "bg-white border-4 border-neo-black",
      "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
    ],
    cardText: "text-neo-black",
    cardHoverText: "group-hover:text-neo-pink",
  },
  featured: {
    searchGlow: "bg-gradient-to-r from-neo-lime via-neo-pink to-neo-cyan",
    searchInput:
      "bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-neo-black font-black focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none",
    searchIcon: "text-neo-black",
    searchClear: "bg-neo-pink text-white border-2 border-neo-black",
    chipBase: "border-2",
    chipActive:
      "bg-neo-purple text-white border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]",
    chipInactive:
      "bg-black text-white border-neo-lime hover:bg-neo-lime hover:text-black hover:border-black",
    resultsText: "text-white",
    resultsCount: "text-neo-lime",
    resultsType: "text-neo-pink",
    cardBase: [
      "bg-white border-4 border-neo-black",
      "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
    ],
    cardText: "text-neo-black",
    cardHoverText: "group-hover:text-neo-pink",
  },
  cafe: {
    searchGlow: "bg-[#A58D71]",
    searchInput:
      "bg-white border-2 border-[#E5E5E5] text-[#2C1810] rounded-xl shadow-sm focus:border-[#6F4E37] focus:ring-1 focus:ring-[#6F4E37]",
    searchIcon: "text-[#A58D71]",
    searchClear: "bg-[#6F4E37] text-white rounded-full",
    chipBase: "rounded-full border border-[#E5E5E5]",
    chipActive: "bg-[#6F4E37] text-white border-[#6F4E37]",
    chipInactive: "bg-white text-[#6F4E37] hover:bg-[#FDFBF7]",
    resultsText: "text-[#6F4E37] border-black/10",
    resultsCount: "text-[#A58D71]",
    resultsType: "text-[#8B5A2B]",
    cardBase: [
      "bg-white rounded-[2rem] border border-[#E5E5E5]",
      "shadow-[0_4px_20px_-4px_rgba(111,78,55,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(111,78,55,0.12)]",
      "hover:-translate-y-1",
    ],
    cardText: "text-neo-black",
    cardHoverText: "group-hover:text-neo-pink",
  },
  food: {
    searchGlow: "bg-[#EA580C]",
    searchInput:
      "bg-white border-4 border-black text-black font-black uppercase rounded-none shadow-[6px_6px_0px_0px_#EA580C] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none",
    searchIcon: "text-[#EA580C]",
    searchClear:
      "bg-[#EA580C] text-white border-2 border-black shadow-[2px_2px_0px_0px_black]",
    chipBase: "border-2 border-black shadow-[2px_2px_0px_0px_#EA580C]",
    chipActive: "bg-[#EA580C] text-white border-black",
    chipInactive: "bg-white text-black hover:bg-orange-50",
    resultsText: "text-gray-800",
    resultsCount: "text-[#EA580C]",
    resultsType: "text-[#DC2626]",
    cardBase: [
      "bg-white border-2 border-black",
      "shadow-[4px_4px_0px_0px_#EA580C] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
      "hover:bg-orange-50",
    ],
    cardText: "text-neo-black",
    cardHoverText: "group-hover:text-neo-pink",
  },
  restaurant: {
    searchGlow: "bg-[#FFD700]",
    searchInput:
      "bg-[#2A2A2A] border-2 border-[#FFD700] text-[#FFD700] font-serif placeholder:font-sans placeholder:text-gray-400 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] shadow-lg",
    searchIcon: "text-[#D4AF37]",
    searchClear:
      "bg-[#FFD700] text-black border border-[#FFD700] hover:bg-white",
    chipBase: "border border-[#FFD700]/50",
    chipActive: "bg-[#FFD700] text-black border-[#FFD700]",
    chipInactive: "bg-transparent text-[#FFD700] hover:bg-[#FFD700]/10",
    resultsText: "text-white border-white/20",
    resultsCount: "text-[#FFD700]",
    resultsType: "text-white",
    cardBase: [
      "bg-[#2A2A2A] border-2 border-[#FFD700]",
      "shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)]",
      "hover:-translate-y-1",
      "text-white",
    ],
    cardText: "text-white",
    cardHoverText: "group-hover:text-[#FFD700]",
  },
  travel: {
    searchGlow: "bg-[#FFD700]/20",
    searchInput:
      "bg-[#0E1C36]/80 border-b-2 border-[#FFD700]/50 backdrop-blur-md text-[#FFD700] font-serif placeholder:text-white/40 focus:bg-[#0E1C36] focus:border-[#FFD700] transition-colors pl-12 rounded-none shadow-lg",
    searchIcon: "text-[#FFD700]",
    searchClear:
      "bg-[#FFD700] text-[#0E1C36] rounded-full hover:bg-white border border-[#FFD700]",
    chipBase: "",
    chipActive: "bg-[#FFD700] text-[#0E1C36] border border-[#FFD700]",
    chipInactive:
      "bg-[#0E1C36]/50 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700] hover:text-[#0E1C36]",
    resultsText: "text-[#FFD700] border-[#FFD700]/30",
    resultsCount: "text-white hover:text-[#FFD700] transition-colors",
    resultsType: "text-[#FFD700]",
    cardBase: [
      "bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-[#FFD700]/60",
      "shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] shadow-[#FFD700]/10",
      "hover:bg-[#0E1C36] hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-500",
      "text-white",
    ],
    cardText: "text-white",
    cardHoverText: "group-hover:text-[#FFD700]",
  },
  nightlife: {
    searchGlow: "bg-gradient-to-r from-[#FF0080] to-[#00FFFF]",
    searchInput:
      "bg-black/90 border-2 border-[#FF0080] text-[#00FFFF] font-mono placeholder:text-[#FF0080]/50 focus:border-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all rounded-none",
    searchIcon: "text-[#FF0080]",
    searchClear:
      "bg-[#FF0080] text-black border border-[#FF0080] hover:bg-[#00FFFF] hover:border-[#00FFFF]",
    chipBase: "",
    chipActive: "bg-[#FF0080] text-black border border-[#FF0080]",
    chipInactive:
      "bg-black text-[#00FFFF] border border-[#FF0080] hover:bg-[#FF0080] hover:text-black hover:shadow-[0_0_10px_#FF0080]",
    resultsText: "text-[#00FFFF] border-[#FF0080]",
    resultsCount: "text-[#FF0080] drop-shadow-[0_0_5px_#FF0080]",
    resultsType: "text-[#00FFFF]",
    cardBase: [
      "bg-black border-2 border-[#FF0080]",
      "shadow-[4px_4px_0px_#00FFFF] hover:shadow-[6px_6px_0px_#FF0080] hover:border-[#00FFFF]",
      "hover:-translate-y-1 transition-all duration-200",
      "text-[#00FFFF] group-hover:text-white",
    ],
    cardText: "text-white",
    cardHoverText: "group-hover:text-[#00FFFF]",
  },
};

// Helper to get theme for variant
export function getVariantTheme(variant: PlaceVariant): VariantTheme {
  return VARIANT_THEMES[variant] || VARIANT_THEMES.default;
}
