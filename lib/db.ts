import Dexie, { type Table } from "dexie";
import type { ClothingItem, Outfit } from "./types";

/**
 * Local-only store. Everything lives in the browser's IndexedDB — no server,
 * no account. Clearing site data wipes the closet.
 */
export class OccasionDB extends Dexie {
  items!: Table<ClothingItem, number>;
  outfits!: Table<Outfit, number>;

  constructor() {
    super("occasion-db");
    this.version(1).stores({
      items: "++id, category, formality, createdAt",
      outfits: "++id, occasion, eventDate, createdAt",
    });
  }
}

export const db = new OccasionDB();
