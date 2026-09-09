"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { dataUrlToBlob, resizeImage } from "@/lib/image";
import { storeFromUrl } from "@/lib/util";
import {
  CATEGORIES,
  FORMALITIES,
  type Category,
  type Formality,
} from "@/lib/types";

const field =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

interface Preview {
  ok: boolean;
  title: string | null;
  price: number | null;
  image: string | null;
  reason?: string;
}

export function AddFromLinkForm({ onDone }: { onDone?: () => void }) {
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("dress");
  const [formality, setFormality] = useState<Formality>("cocktail");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFetch() {
    const trimmed = url.trim();
    if (!trimmed || fetching) return;
    setFetching(true);
    setNote(null);
    try {
      const res = await fetch(`/api/preview?url=${encodeURIComponent(trimmed)}`);
      const data = (await res.json()) as Preview;
      setRevealed(true);
      if (data.ok) {
        if (data.title) setName(data.title.slice(0, 120));
        if (data.price != null) setPrice(String(data.price));
        if (data.image) setImageDataUrl(data.image);
        setNote(
          data.image || data.title
            ? "Filled in what we could read. Check it and fix anything."
            : "Couldn't read details from that page — please fill them in.",
        );
      } else {
        setNote(data.reason ?? "Couldn't read that page — please fill it in.");
      }
    } catch {
      setRevealed(true);
      setNote("Something went wrong reading the page — please fill it in.");
    } finally {
      setFetching(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim() || saving) return;
    setSaving(true);
    try {
      let image: Blob | undefined;
      if (uploadFile) {
        image = await resizeImage(uploadFile);
      } else if (imageDataUrl) {
        image = await resizeImage(await dataUrlToBlob(imageDataUrl));
      }
      const parsedPrice = Number(price.replace(/[^0-9.]/g, ""));
      await db.items.add({
        name: name.trim(),
        category,
        color: "unspecified",
        formality,
        seasons: [],
        image,
        createdAt: Date.now(),
        owned: false,
        price: Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : undefined,
        sourceUrl: url.trim(),
        store: storeFromUrl(url.trim()),
      });
      onDone?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="grid gap-1">
        <label className="text-xs font-medium text-neutral-500">
          Product link (Amazon, Shein, Temu, anywhere)
        </label>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.amazon.com/..."
            className={field}
            inputMode="url"
          />
          <button
            type="button"
            onClick={handleFetch}
            disabled={fetching || !url.trim()}
            className="shrink-0 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            {fetching ? "Reading…" : "Fetch details"}
          </button>
        </div>
      </div>

      {note && (
        <p className="rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {note}
        </p>
      )}

      {revealed && (
        <>
          <div className="flex gap-3">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
              {uploadFile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(uploadFile)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : imageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageDataUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-neutral-400">no image</span>
              )}
            </div>
            <div className="grid flex-1 gap-1">
              <label className="text-xs font-medium text-neutral-500">
                Replace / add photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-medium text-neutral-500">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Satin slip dress"
              className={field}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1">
              <label className="text-xs font-medium text-neutral-500">
                Price ($)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="24"
                inputMode="decimal"
                className={field}
              />
            </div>
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
        </>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving || !revealed || !name.trim()}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
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
