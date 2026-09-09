"use client";

import { useMemo, useState } from "react";
import { AddFromLinkForm } from "@/components/AddFromLinkForm";
import { ItemCard } from "@/components/ItemCard";
import { ItemForm } from "@/components/ItemForm";
import { useItems } from "@/lib/store";
import { isOwned } from "@/lib/types";

type Filter = "all" | "owned" | "buy";
type AddMode = null | "own" | "link";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "owned", label: "My clothes" },
  { key: "buy", label: "Want to buy" },
];

export default function ClosetPage() {
  const items = useItems();
  const [adding, setAdding] = useState<AddMode>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(() => {
    if (!items) return undefined;
    if (filter === "owned") return items.filter((i) => isOwned(i));
    if (filter === "buy") return items.filter((i) => !isOwned(i));
    return items;
  }, [items, filter]);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Closet</h1>
          <p className="text-sm text-neutral-500">
            {items
              ? `${items.length} item${items.length === 1 ? "" : "s"}`
              : "…"}
          </p>
        </div>
        {!adding && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdding("own")}
              className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
            >
              Add item
            </button>
            <button
              type="button"
              onClick={() => setAdding("link")}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium dark:border-neutral-700"
            >
              Add from link
            </button>
          </div>
        )}
      </div>

      {adding === "own" && <ItemForm onDone={() => setAdding(null)} />}
      {adding === "link" && <AddFromLinkForm onDone={() => setAdding(null)} />}

      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              filter === f.key
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!shown ? (
        <p className="text-sm text-neutral-400">Loading closet…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">
            {filter === "buy"
              ? "Nothing on your buy list yet. Use “Add from link” to paste a product you’re considering."
              : filter === "owned"
                ? "No clothes added yet. Use “Add item” to photograph what you own."
                : "Your closet is empty. Add a few pieces to start building outfits."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shown.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
