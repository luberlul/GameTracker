export interface GameData {
  id: string;
  title: string;
  coverColor: string;
  coverImage?: string;
  bannerImage?: string;
  status: string;
  platform: string;
  overallRating: number;
  storyRating: number;
  gameplayRating: number;
  soundtrackRating: number;
  graphicsRating: number;
  difficulty: number;
  hoursPlayed: number;
  minutesPlayed: number;
  startDate: string;
  endDate?: string;
  releaseYear?: string;
  genre: string[];
  notes: string;
  achievements: string;
  screenshots: string[];
  tier?: string;
  igdbId?: number;
  hltbId?: string;
  hltbName?: string;
  hltbImageUrl?: string;
  hltbMainStory?: number;
  hltbMainExtra?: number;
  hltbCompletionist?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateGameInput = Omit<GameData, "id" | "createdAt" | "updatedAt">;
export type UpdateGameInput = Partial<CreateGameInput>;
