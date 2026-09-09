export type Category =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "shoes"
  | "accessory";

export const CATEGORIES: Category[] = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "accessory",
];

export type Formality =
  | "casual"
  | "smart casual"
  | "business"
  | "cocktail"
  | "formal"
  | "black tie";

export const FORMALITIES: Formality[] = [
  "casual",
  "smart casual",
  "business",
  "cocktail",
  "formal",
  "black tie",
];

export const SEASONS = ["spring", "summer", "fall", "winter"] as const;
export type Season = (typeof SEASONS)[number];

export const OCCASIONS = [
  "Wedding",
  "Job interview",
  "Graduation",
  "Gala / black tie",
  "Cocktail party",
  "Date night",
  "Funeral",
  "Religious service",
  "Birthday party",
  "Holiday gathering",
  "Photoshoot",
  "Other",
] as const;
export type Occasion = (typeof OCCASIONS)[number];

/** Where a "want to buy" item was found. */
export type Store = "Amazon" | "Shein" | "Temu" | "Other";

export interface ClothingItem {
  id?: number;
  name: string;
  category: Category;
  color: string;
  formality: Formality;
  seasons: Season[];
  image?: Blob;
  createdAt: number;

  /** false = a "want to buy" item pasted from a shopping link. Missing/true = owned. */
  owned?: boolean;
  /** Price for a "want to buy" item, in whole currency units. */
  price?: number;
  /** Original product link for a "want to buy" item. */
  sourceUrl?: string;
  store?: Store;
}

export interface Outfit {
  id?: number;
  name: string;
  occasion: Occasion;
  /** ISO yyyy-mm-dd of the event, optional. */
  eventDate?: string;
  itemIds: number[];
  notes?: string;
  createdAt: number;
}

export function isOwned(item: ClothingItem): boolean {
  return item.owned !== false;
}
