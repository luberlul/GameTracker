const BASE = "https://howlongtobeat.com";
const IMAGE_BASE = `${BASE}/games/`;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36";

export interface HltbData {
  id: string;
  name: string;
  imageUrl: string;
  mainStory: number;
  mainExtra: number;
  completionist: number;
}

interface BleedInit {
  token: string;
  hpKey: string;
  hpVal: string;
}

interface HltbEntry {
  game_id: number;
  game_name: string;
  game_image: string;
  comp_main: number;
  comp_plus: number;
  comp_100: number;
}

async function getBleedInit(): Promise<BleedInit> {
  const res = await fetch(`${BASE}/api/bleed/init?t=${Date.now()}`, {
    headers: { "User-Agent": UA, Accept: "application/json", Referer: `${BASE}/` },
  });
  if (!res.ok) throw new Error(`bleed/init ${res.status}`);
  return res.json() as Promise<BleedInit>;
}

async function hltbSearch(query: string): Promise<HltbEntry[]> {
  const { token, hpKey, hpVal } = await getBleedInit();

  const payload: Record<string, unknown> = {
    searchType: "games",
    searchTerms: query.trim().split(" "),
    searchPage: 1,
    size: 10,
    searchOptions: {
      games: {
        userId: 0,
        platform: "",
        sortCategory: "popular",
        rangeCategory: "main",
        rangeTime: { min: 0, max: 0 },
        gameplay: { perspective: "", flow: "", genre: "", difficulty: "" },
        rangeYear: { min: 0, max: 0 },
        modifier: "",
      },
      users: { sortCategory: "postcount" },
      lists: { sortCategory: "follows" },
      filter: "",
      sort: 0,
      randomizer: 0,
    },
    useCache: true,
    [hpKey]: hpVal,
  };

  const res = await fetch(`${BASE}/api/bleed`, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/json",
      "x-auth-token": token,
      "x-hp-key": hpKey,
      "x-hp-val": hpVal,
      Origin: BASE,
      Referer: `${BASE}/search`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HLTB search ${res.status}`);
  const data = (await res.json()) as { data?: HltbEntry[] };
  return data.data ?? [];
}

function nameSimilarity(result: string, query: string): number {
  const r = result.toLowerCase();
  const q = query.toLowerCase();
  if (r === q) return 1;
  if (r.startsWith(q) || q.startsWith(r)) return 0.95;
  if (r.includes(q) || q.includes(r)) return 0.85;
  return 0;
}

export async function searchHltb(query: string): Promise<HltbData | null> {
  try {
    const results = await hltbSearch(query);
    if (!results.length) return null;

    const best = results.reduce((a, b) =>
      nameSimilarity(b.game_name, query) > nameSimilarity(a.game_name, query) ? b : a,
    );

    return {
      id: String(best.game_id),
      name: best.game_name,
      imageUrl: best.game_image ? `${IMAGE_BASE}${best.game_image}` : "",
      mainStory: best.comp_main ? best.comp_main / 3600 : 0,
      mainExtra: best.comp_plus ? best.comp_plus / 3600 : 0,
      completionist: best.comp_100 ? best.comp_100 / 3600 : 0,
    };
  } catch (e) {
    console.error("[HLTB]", e);
    return null;
  }
}
