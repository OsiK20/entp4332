"use client";

import Link from "next/link";
import { OutfitCard } from "@/components/OutfitCard";
import { useOutfits } from "@/lib/store";

export default function OutfitsPage() {
  const outfits = useOutfits();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Outfits</h1>
          <p className="text-sm text-neutral-500">
            {outfits
              ? `${outfits.length} saved`
              : "…"}
          </p>
        </div>
        <Link
          href="/outfits/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          New outfit
        </Link>
      </div>

      {!outfits ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : outfits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">
            No outfits yet.{" "}
            <Link href="/outfits/new" className="underline">
              Build your first
            </Link>{" "}
            for an upcoming occasion.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
}
