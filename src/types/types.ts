// Example Movie type definition
export interface Movie {
  movie_id: string;
  title: string;
  description: string;
  releaseDate: string;
  posterPath: string;
  director: string;
  actors: string;
  genre: string;
  imdbRating: string;
  language: string;
  production: string;
  runtime: string;
  rating?: string; // Optional properties can be included
  country?: string; // Optional properties can be included
  boxOffice?: string; // Optional properties can be included
}
