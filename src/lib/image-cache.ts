// Tiny image loader cache:
// - Tracks URLs already requested so a re-mount doesn't trigger a fresh load
// - Exposes a hook that resolves to "loading" | "loaded" | "error"
// Browser HTTP cache handles the actual byte-level reuse — this layer only
// prevents flicker / duplicate work in React.

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "loaded" | "error";

const cache = new Map<string, Status>();
const inflight = new Map<string, Promise<Status>>();

function preload(url: string): Promise<Status> {
  const existing = inflight.get(url);
  if (existing) return existing;

  const promise = new Promise<Status>((resolve) => {
    const img = new Image();
    img.onload = () => {
      cache.set(url, "loaded");
      inflight.delete(url);
      resolve("loaded");
    };
    img.onerror = () => {
      cache.set(url, "error");
      inflight.delete(url);
      resolve("error");
    };
    img.src = url;
  });

  inflight.set(url, promise);
  cache.set(url, "loading");
  return promise;
}

export function useCachedImage(url: string | null | undefined): Status {
  const [status, setStatus] = useState<Status>(() =>
    url ? (cache.get(url) ?? "idle") : "idle",
  );

  useEffect(() => {
    if (!url) {
      setStatus("idle");
      return;
    }
    const cached = cache.get(url);
    if (cached === "loaded" || cached === "error") {
      setStatus(cached);
      return;
    }
    setStatus("loading");
    let alive = true;
    preload(url).then((s) => {
      if (alive) setStatus(s);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  return status;
}

export function prefetchImages(urls: (string | null | undefined)[]) {
  for (const url of urls) {
    if (url && !cache.has(url)) preload(url);
  }
}
