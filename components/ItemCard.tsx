"use client";

import type { ClothingItem } from "@/lib/types";
import { isOwned } from "@/lib/types";
import { deleteItem } from "@/lib/store";
import { formatPrice } from "@/lib/util";
import { ItemThumb } from "./ItemThumb";

export function ItemCard({ item }: { item: ClothingItem }) {
  const owned = isOwned(item);

  return (
    <div className="group relative rounded-xl border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
      <ItemThumb item={item} />

      {!owned && (
        <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Want to buy
        </span>
      )}

      <div className="px-1 pt-2">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="truncate text-xs text-neutral-500">
          {owned ? (
            <>
              {item.color} · {item.category} · {item.formality}
            </>
          ) : (
            <>
              {formatPrice(item.price) || "price ?"} · {item.store ?? "shop"} ·{" "}
              {item.category}
            </>
          )}
        </p>
        {!owned && item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            View product →
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm(`Delete "${item.name}"?`)) void deleteItem(item.id!);
        }}
        className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
        aria-label={`Delete ${item.name}`}
      >
        Delete
      </button>
    </div>
  );
}
