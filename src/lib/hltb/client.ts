import type { HltbData } from "./types";

function isPackagedElectron(): boolean {
  return (
    typeof window !== "undefined" &&
    window.electron?.hltb != null &&
    window.location.protocol === "file:"
  );
}

export async function searchHltb(query: string): Promise<HltbData | null> {
  if (isPackagedElectron()) {
    return window.electron!.hltb.search(query);
  }
  try {
    const res = await fetch(
      `/api/hltb/search?q=${encodeURIComponent(query)}`,
    );
    if (!res.ok) return null;
    return (await res.json()) as HltbData | null;
  } catch {
    return null;
  }
}
