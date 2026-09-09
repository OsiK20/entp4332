"use client";

import type { Outfit } from "@/lib/types";
import { isOwned } from "@/lib/types";
import { deleteOutfit, useItemsByIds } from "@/lib/store";
import { formatPrice } from "@/lib/util";
import { ItemThumb } from "./ItemThumb";

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OutfitCard({ outfit }: { outfit: Outfit }) {
  const items = useItemsByIds(outfit.itemIds);
  const date = formatDate(outfit.eventDate);

  const toBuy = (items ?? []).filter((i) => !isOwned(i));
  const buyTotal = toBuy.reduce((sum, i) => sum + (i.price ?? 0), 0);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{outfit.name}</h3>
          <p className="text-xs text-neutral-500">
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 dark:bg-neutral-800">
              {outfit.occasion}
            </span>
            {date && <span className="ml-2">{date}</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete outfit "${outfit.name}"?`))
              void deleteOutfit(outfit.id!);
          }}
          className="text-xs text-neutral-400 hover:text-red-500"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {(items ?? []).map((item) => (
          <div key={item.id}>
            <div className="relative">
              <ItemThumb item={item} />
              {!isOwned(item) && (
                <span className="absolute right-0.5 top-0.5 rounded bg-amber-500 px-1 text-[9px] font-bold text-white">
                  BUY
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-[11px] text-neutral-500">
              {item.name}
            </p>
          </div>
        ))}
        {items && items.length === 0 && (
          <p className="col-span-full text-xs text-neutral-400">
            No items — they may have been deleted from the closet.
          </p>
        )}
      </div>

      {toBuy.length > 0 && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs dark:bg-amber-950/40">
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            Need to buy: {toBuy.length} item{toBuy.length === 1 ? "" : "s"}
            {buyTotal > 0 && <> · about {formatPrice(buyTotal)}</>}
          </p>
          <ul className="mt-1 space-y-0.5">
            {toBuy.map((i) => (
              <li key={i.id} className="text-amber-800 dark:text-amber-300">
                {i.name} — {formatPrice(i.price) || "price ?"}
                {i.sourceUrl && (
                  <>
                    {" "}
                    <a
                      href={i.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      open
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {outfit.notes && (
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          {outfit.notes}
        </p>
      )}
    </div>
  );
}
