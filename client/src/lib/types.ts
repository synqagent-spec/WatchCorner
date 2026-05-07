export interface Movie {
  imdb_id: string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
  genre_ids: number[];
  runtime?: number;
  tagline?: string;
  genres?: Array<{ id: number; name: string }>;
  cast?: Array<{
    name: string;
    character: string;
    profile_path: string;
  }>;
}

export interface TVShow {
  imdb_id: string;
  name: string;
  title?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
  release_date?: string;
  genre_ids: number[];
  number_of_seasons?: number;
  genres?: Array<{ id: number; name: string }>;
  cast?: Array<{
    name: string;
    character: string;
    profile_path: string;
  }>;
}

export interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  vote_average: number;
  air_date: string;
}

export interface Season {
  season_number: number;
  episodes: Episode[];
}

export interface APIResponse<T> {
  results: T[];
  total_pages: number;
  page: number;
}

export type ContentType = "movie" | "tv";
export type TimeWindow = "day" | "week" | "month";
