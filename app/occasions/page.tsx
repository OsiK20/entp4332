"use client";

import Link from "next/link";
import { OutfitCard } from "@/components/OutfitCard";
import { useOutfits } from "@/lib/store";
import { OCCASIONS } from "@/lib/types";

export default function OccasionsPage() {
  const outfits = useOutfits();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Occasions</h1>
        <p className="text-sm text-neutral-500">
          Planned outfits grouped by event type.
        </p>
      </div>

      {!outfits ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : outfits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">
            Nothing planned yet.{" "}
            <Link href="/outfits/new" className="underline">
              Build an outfit
            </Link>{" "}
            and pick an occasion for it.
          </p>
        </div>
      ) : (
        OCCASIONS.filter((occasion) =>
          outfits.some((o) => o.occasion === occasion),
        ).map((occasion) => {
          const forOccasion = outfits
            .filter((o) => o.occasion === occasion)
            .sort((a, b) =>
              (a.eventDate ?? "9999").localeCompare(b.eventDate ?? "9999"),
            );
          return (
            <section key={occasion} className="space-y-3">
              <h2 className="text-sm font-semibold">
                {occasion}{" "}
                <span className="font-normal text-neutral-400">
                  ({forOccasion.length})
                </span>
              </h2>
              {forOccasion.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}
