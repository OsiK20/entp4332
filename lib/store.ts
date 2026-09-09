"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import type { ClothingItem, Outfit } from "./types";

/** All closet items, newest first. `undefined` while loading. */
export function useItems(): ClothingItem[] | undefined {
  return useLiveQuery(() => db.items.orderBy("createdAt").reverse().toArray());
}

/** All saved outfits, newest first. `undefined` while loading. */
export function useOutfits(): Outfit[] | undefined {
  return useLiveQuery(() => db.outfits.orderBy("createdAt").reverse().toArray());
}

/** Look up a set of items by id, preserving the given order. */
export function useItemsByIds(ids: number[]): ClothingItem[] | undefined {
  const key = ids.join(",");
  return useLiveQuery(async () => {
    const rows = await db.items.bulkGet(ids);
    return rows.filter((r): r is ClothingItem => Boolean(r));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export async function deleteItem(id: number): Promise<void> {
  await db.transaction("rw", db.items, db.outfits, async () => {
    await db.items.delete(id);
    const affected = await db.outfits
      .filter((o) => o.itemIds.includes(id))
      .toArray();
    await Promise.all(
      affected.map((o) =>
        db.outfits.update(o.id!, {
          itemIds: o.itemIds.filter((i) => i !== id),
        }),
      ),
    );
  });
}

export async function deleteOutfit(id: number): Promise<void> {
  await db.outfits.delete(id);
}
