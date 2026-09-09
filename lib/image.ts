/**
 * Downscale an image before it goes into IndexedDB so the closet stays small.
 * Longest edge is capped at `max` px and re-encoded as JPEG. Accepts any Blob
 * (a picked File, or an image we fetched from a product link).
 */
export async function resizeImage(
  input: Blob,
  max = 1024,
  quality = 0.8,
): Promise<Blob> {
  const bitmap = await createImageBitmap(input);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return input;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? input), "image/jpeg", quality);
  });
}

/** Turn a `data:` URL (from the link-preview API) into a Blob. */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
