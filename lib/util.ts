import type { Store } from "./types";

/** Guess which shop a product link points at, from its hostname. */
export function storeFromUrl(url: string): Store {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return "Other";
  }
  if (host.includes("amazon") || host.includes("amzn")) return "Amazon";
  if (host.includes("shein")) return "Shein";
  if (host.includes("temu")) return "Temu";
  return "Other";
}

/** "$18" / "$18.50" — plain, no locale surprises. */
export function formatPrice(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return "";
  return value % 1 === 0 ? `$${value}` : `$${value.toFixed(2)}`;
}
