"use client";

import { useRef, useState } from "react";
import { db } from "@/lib/db";
import { resizeImage } from "@/lib/image";
import {
  CATEGORIES,
  FORMALITIES,
  SEASONS,
  type Category,
  type Formality,
  type Season,
} from "@/lib/types";

const field =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export function ItemForm({ onDone }: { onDone?: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("top");
  const [color, setColor] = useState("");
  const [formality, setFormality] = useState<Formality>("smart casual");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function toggleSeason(s: Season) {
    setSeasons((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const image = file ? await resizeImage(file) : undefined;
      await db.items.add({
        name: name.trim(),
        category,
        color: color.trim() || "unspecified",
        formality,
        seasons,
        image,
        createdAt: Date.now(),
      });
      setName("");
      setColor("");
      setSeasons([]);
      setFile(null);
      formRef.current?.reset();
      onDone?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="grid gap-1">
        <label className="text-xs font-medium text-neutral-500">Photo</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-neutral-500">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Navy blazer"
          className={field}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label className="text-xs font-medium text-neutral-500">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={field}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium text-neutral-500">
            Formality
          </label>
          <select
            value={formality}
            onChange={(e) => setFormality(e.target.value as Formality)}
            className={field}
          >
            {FORMALITIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-neutral-500">Color</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="navy"
          className={field}
        />
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-neutral-500">Seasons</label>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => toggleSeason(s)}
              className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                seasons.includes(s)
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {saving ? "Saving…" : "Add to closet"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg px-4 py-2 text-sm text-neutral-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
