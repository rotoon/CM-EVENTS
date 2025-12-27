import {
  BookOpen,
  Coffee,
  Mic,
  Palette,
  ShoppingBag,
  Sparkles,
  Utensils,
} from "lucide-react";

// Icon mapping default
export const ICON_MAP: Record<string, any> = {
  festival: Sparkles,
  music: Mic,
  art: Palette,
  cafe: Coffee,
  market: ShoppingBag,
  workshop: BookOpen,
  food: Utensils,
};

export const CATEGORY_STYLES: Record<
  string,
  { active: string; hover: string }
> = {
  festival: {
    active:
      "bg-neo-black text-white shadow-none translate-x-1 translate-y-1 hover:bg-neo-black hover:text-white",
    hover: "hover:bg-neo-black hover:text-white",
  },
  music: {
    active:
      "bg-neo-lime text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-lime hover:text-black",
    hover: "hover:bg-neo-lime",
  },
  art: {
    active:
      "bg-neo-pink text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-pink hover:text-black",
    hover: "hover:bg-neo-pink hover:text-black",
  },
  cafe: {
    active:
      "bg-neo-purple text-white shadow-none translate-x-1 translate-y-1 hover:bg-neo-purple hover:text-white",
    hover: "hover:bg-neo-purple hover:text-white ",
  },
  market: {
    active:
      "bg-neo-black text-white shadow-none translate-x-1 translate-y-1 hover:bg-neo-black hover:text-white",
    hover: "hover:bg-neo-black hover:text-white",
  },
  workshop: {
    active:
      "bg-neo-lime text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-lime hover:text-black",
    hover: "hover:bg-neo-lime",
  },
  food: {
    active:
      "bg-neo-pink text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-pink hover:text-black",
    hover: "hover:bg-neo-pink ",
  },
};

export const DEFAULT_CATEGORY_STYLE = {
  active:
    "bg-neo-lime text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-lime hover:text-black",
  hover: "hover:bg-neo-lime",
};

// Neo-Pop Colors Cycle
export const NEO_COLORS = [
  "bg-neo-pink",
  "bg-neo-lime",
  "bg-neo-purple text-white",
  "bg-neo-black text-white",
  "bg-white border-2 border-black",
];

export const TAGS = ["ART", "MUSIC", "FOOD", "VIBE", "PARTY"];
