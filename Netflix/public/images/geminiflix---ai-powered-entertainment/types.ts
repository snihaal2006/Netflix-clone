
export interface Movie {
  id: string;
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  duration: string;
  genres: string[];
  backdropUrl: string;
  posterUrl: string;
  matchScore?: number;
}

export interface Category {
  id: string;
  name: string;
  movies: Movie[];
}

export enum AppView {
  BROWSE = 'browse',
  SEARCH = 'search',
  MY_LIST = 'my_list',
  AI_RECOMMENDER = 'ai_recommender'
}
