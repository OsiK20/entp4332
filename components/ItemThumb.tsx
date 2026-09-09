"use client";

import type { ClothingItem } from "@/lib/types";
import { useObjectUrl } from "./useObjectUrl";

const CATEGORY_EMOJI: Record<ClothingItem["category"], string> = {
  top: "👕",
  bottom: "👖",
  dress: "👗",
  outerwear: "🧥",
  shoes: "👞",
  accessory: "👜",
};

export function ItemThumb({
  item,
  className = "",
}: {
  item: ClothingItem;
  className?: string;
}) {
  const url = useObjectUrl(item.image);

  return (
    <div
      className={`flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800 ${className}`}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-2xl" aria-hidden>
          {CATEGORY_EMOJI[item.category]}
        </span>
      )}
    </div>
  );
}
