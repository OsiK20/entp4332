"use client";

import { useEffect, useState } from "react";

/** Turn a Blob into an object URL that is revoked when it changes/unmounts. */
export function useObjectUrl(blob?: Blob | null): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!blob) {
      setUrl(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  return url;
}
