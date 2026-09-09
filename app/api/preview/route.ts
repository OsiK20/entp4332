import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const MAX_IMAGE_BYTES = 2_000_000;

/** First capture group of the first matching pattern, else undefined. */
function firstMatch(html: string, patterns: RegExp[]): string | undefined {
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1].trim());
  }
  return undefined;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function metaPatterns(prop: string): RegExp[] {
  return [
    new RegExp(
      `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
  ];
}

/** Reject localhost / private ranges so this can't be used to probe internals. */
function isPublicHttpUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return null;
  }
  return url;
}

async function fetchWithTimeout(url: string, ms: number, asText: boolean) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": UA,
        Accept: asText
          ? "text/html,application/xhtml+xml"
          : "image/avif,image/webp,image/*,*/*",
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("url");
  if (!target) {
    return NextResponse.json(
      { ok: false, reason: "Missing url" },
      { status: 400 },
    );
  }

  const url = isPublicHttpUrl(target);
  if (!url) {
    return NextResponse.json(
      { ok: false, reason: "That does not look like a public product link." },
      { status: 400 },
    );
  }

  let html: string;
  try {
    const res = await fetchWithTimeout(url.toString(), 8000, true);
    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        reason: `The store returned an error (${res.status}). Fill it in below.`,
      });
    }
    html = (await res.text()).slice(0, 600_000);
  } catch {
    return NextResponse.json({
      ok: false,
      reason: "Could not open that page. Fill it in below.",
    });
  }

  const title =
    firstMatch(html, metaPatterns("og:title")) ??
    firstMatch(html, metaPatterns("twitter:title")) ??
    firstMatch(html, [/<title[^>]*>([^<]+)<\/title>/i]);

  const imageUrl =
    firstMatch(html, metaPatterns("og:image:secure_url")) ??
    firstMatch(html, metaPatterns("og:image")) ??
    firstMatch(html, metaPatterns("twitter:image"));

  const priceRaw =
    firstMatch(html, metaPatterns("product:price:amount")) ??
    firstMatch(html, metaPatterns("og:price:amount")) ??
    firstMatch(html, [
      /<meta[^>]+itemprop=["']price["'][^>]+content=["']([^"']+)["']/i,
      /"price"\s*:\s*"?([0-9]+(?:\.[0-9]{1,2})?)"?/i,
      /"priceAmount"\s*:\s*"?([0-9]+(?:\.[0-9]{1,2})?)"?/i,
    ]);
  const price = priceRaw ? Number(priceRaw.replace(/[^0-9.]/g, "")) : undefined;

  let image: string | null = null;
  if (imageUrl) {
    const abs = isPublicHttpUrl(new URL(imageUrl, url).toString());
    if (abs) {
      try {
        const imgRes = await fetchWithTimeout(abs.toString(), 8000, false);
        const type = imgRes.headers.get("content-type") ?? "image/jpeg";
        if (imgRes.ok && type.startsWith("image/")) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          if (buf.byteLength <= MAX_IMAGE_BYTES) {
            image = `data:${type};base64,${buf.toString("base64")}`;
          }
        }
      } catch {
        /* leave image null — the form still works without it */
      }
    }
  }

  return NextResponse.json({
    ok: true,
    title: title ?? null,
    price: price && !Number.isNaN(price) ? price : null,
    image,
  });
}
