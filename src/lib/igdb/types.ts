// IGDB raw API response types

export interface IgdbImage {
  id: number;
  image_id: string;
}

export interface IgdbGenre {
  id: number;
  name: string;
}

export interface IgdbPlatform {
  id: number;
  name: string;
  abbreviation?: string;
}

export interface IgdbCompany {
  id: number;
  name: string;
}

export interface IgdbInvolvedCompany {
  id: number;
  company: IgdbCompany;
  developer: boolean;
  publisher: boolean;
}

export interface IgdbFranchise {
  id: number;
  name: string;
}

export interface IgdbReleaseDate {
  id: number;
  date?: number;
  human?: string;
}

export interface IgdbWebsite {
  url: string;
  category: number;
}

export interface IgdbSearchResult {
  id: number;
  slug: string;
  name: string;
  first_release_date?: number;
  cover?: IgdbImage;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  platforms?: IgdbPlatform[];
  genres?: IgdbGenre[];
}

export interface IgdbGameDetails extends IgdbSearchResult {
  summary?: string;
  storyline?: string;
  artworks?: IgdbImage[];
  screenshots?: IgdbImage[];
  involved_companies?: IgdbInvolvedCompany[];
  franchises?: IgdbFranchise[];
  release_dates?: IgdbReleaseDate[];
  websites?: IgdbWebsite[];
}

// ---- Internal types (shared between renderer and Electron main) ----

export interface GameSuggestion {
  id: number;
  slug: string;
  name: string;
  releaseYear: number | null;
  cover: string | null;
  rating: number;
  ratingsCount: number;
  platforms: string[];
  genres: string[];
}

export interface GameImport extends GameSuggestion {
  description: string;
  banner: string | null;
  developers: string[];
  publishers: string[];
  screenshots: string[];
  franchises: string[];
  released: string | null;
  website: string | null;
}
