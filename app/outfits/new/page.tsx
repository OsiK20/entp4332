"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ItemThumb } from "@/components/ItemThumb";
import { db } from "@/lib/db";
import { useItems } from "@/lib/store";
import { OCCASIONS, isOwned, type Category, type Occasion } from "@/lib/types";
import { formatPrice } from "@/lib/util";

const field =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default function NewOutfitPage() {
  const router = useRouter();
  const items = useItems();

  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState<Occasion>("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<Category, typeof items>();
    for (const item of items ?? []) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [items]);

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const selectedToBuy = (items ?? []).filter(
    (i) => selected.includes(i.id!) && !isOwned(i),
  );
  const buyTotal = selectedToBuy.reduce((sum, i) => sum + (i.price ?? 0), 0);

  async function save() {
    if (!name.trim() || selected.length === 0 || saving) return;
    setSaving(true);
    try {
      await db.outfits.add({
        name: name.trim(),
        occasion,
        eventDate: eventDate || undefined,
        itemIds: selected,
        notes: notes.trim() || undefined,
        createdAt: Date.now(),
      });
      router.push("/outfits");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">New outfit</h1>
        <Link href="/outfits" className="text-sm text-neutral-500">
          Cancel
        </Link>
      </div>

      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid gap-1">
          <label className="text-xs font-medium text-neutral-500">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah's wedding — guest"
            className={field}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Occasion
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as Occasion)}
              className={field}
            >
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Event date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={field}
            />
          </div>
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium text-neutral-500">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Outdoor ceremony, bring a light jacket."
            rows={2}
            className={field}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-neutral-500">
          Pick items ({selected.length} selected)
        </h2>
        {!items ? (
          <p className="text-sm text-neutral-400">Loading closet…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Your closet is empty.{" "}
            <Link href="/" className="underline">
              Add items first
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-4">
            {[...grouped.entries()].map(([category, list]) => (
              <div key={category}>
                <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
                  {category}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {(list ?? []).map((item) => {
                    const on = selected.includes(item.id!);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggle(item.id!)}
                        className={`rounded-lg border-2 p-1 text-left transition ${
                          on
                            ? "border-neutral-900 dark:border-white"
                            : "border-transparent"
                        }`}
                      >
                        <div className="relative">
                          <ItemThumb item={item} />
                          {!isOwned(item) && (
                            <span className="absolute right-0.5 top-0.5 rounded bg-amber-500 px-1 text-[9px] font-bold text-white">
                              {formatPrice(item.price) || "BUY"}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-[11px]">{item.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-4 space-y-2">
        {selectedToBuy.length > 0 && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-800 shadow dark:bg-amber-950/60 dark:text-amber-300">
            Includes {selectedToBuy.length} item
            {selectedToBuy.length === 1 ? "" : "s"} to buy
            {buyTotal > 0 && <> · about {formatPrice(buyTotal)}</>}
          </p>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving || !name.trim() || selected.length === 0}
          className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-lg disabled:opacity-40 dark:bg-white dark:text-neutral-900"
        >
          {saving ? "Saving…" : "Save outfit"}
        </button>
      </div>
    </div>
  );
}
