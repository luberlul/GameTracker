import { HowLongToBeatService } from "howlongtobeat";

export interface HltbData {
  id: string;
  name: string;
  imageUrl: string;
  mainStory: number;
  mainExtra: number;
  completionist: number;
}

let service: HowLongToBeatService | null = null;

function getService(): HowLongToBeatService {
  if (!service) service = new HowLongToBeatService();
  return service;
}

export async function searchHltb(query: string): Promise<HltbData | null> {
  try {
    const results = await getService().search(query);
    if (!results || results.length === 0) return null;
    const best = results.reduce((a, b) =>
      b.similarity > a.similarity ? b : a,
    );
    return {
      id: best.id,
      name: best.name,
      imageUrl: best.imageUrl ?? "",
      mainStory: best.gameplayMain ?? 0,
      mainExtra: best.gameplayMainExtra ?? 0,
      completionist: best.gameplayCompletionist ?? 0,
    };
  } catch {
    return null;
  }
}
