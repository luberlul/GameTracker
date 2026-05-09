export interface HltbData {
  id: string;
  name: string;
  imageUrl: string;
  mainStory: number;      // hours, 0 = N/A
  mainExtra: number;
  completionist: number;
}

export type SpeedLabel = "faster" | "on-par" | "slower";

export function getSpeedLabel(userHours: number, hltbHours: number): SpeedLabel {
  if (!hltbHours || hltbHours <= 0 || userHours <= 0) return "on-par";
  const ratio = userHours / hltbHours;
  if (ratio < 0.85) return "faster";
  if (ratio > 1.15) return "slower";
  return "on-par";
}

export function formatHltbHours(hours: number): string {
  if (!hours || hours <= 0) return "N/D";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m < 5) return `${h}h`;
  return `${h}h ${m}min`;
}
