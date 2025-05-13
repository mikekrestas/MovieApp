// src/services/matchService.ts
import { Movie } from '../types/types';

export interface TasteMatchBreakdown {
  favorites: number;
  films: number;
  watchlist: number;
  genres: number;
  directors: number;
  actors: number;
  decades: number;
  overall: number;
}

function getSet(arr: (string | undefined)[]): Set<string> {
  return new Set(arr.filter(Boolean).map(x => x!.trim().toLowerCase()));
}

function getGenres(movies: Movie[]) {
  return getSet(movies.flatMap(m => m.genre?.split(',').map(g => g.trim()) || []));
}
function getDirectors(movies: Movie[]) {
  return getSet(movies.flatMap(m => m.director?.split(',').map(d => d.trim()) || []));
}
function getActors(movies: Movie[]) {
  return getSet(movies.flatMap(m => m.actors?.split(',').map(a => a.trim()) || []));
}
function getDecades(movies: Movie[]) {
  return getSet(movies.map(m => {
    const y = parseInt(m.releaseDate?.slice(0, 4));
    return !isNaN(y) ? `${Math.floor(y / 10) * 10}s` : undefined;
  }));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 1;
  const inter = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 1 : inter.size / union.size;
}

export function calculateTasteMatch(
  userA: {
    favorites: Movie[];
    films: Movie[];
    watchlist: Movie[];
  },
  userB: {
    favorites: Movie[];
    films: Movie[];
    watchlist: Movie[];
  }
): TasteMatchBreakdown {
  // Movie overlap
  const favA = getSet(userA.favorites.map(m => m.movie_id));
  const favB = getSet(userB.favorites.map(m => m.movie_id));
  const filmsA = getSet(userA.films.map(m => m.movie_id));
  const filmsB = getSet(userB.films.map(m => m.movie_id));
  const watchA = getSet(userA.watchlist.map(m => m.movie_id));
  const watchB = getSet(userB.watchlist.map(m => m.movie_id));

  // Jaccard for each
  const favorites = jaccard(favA, favB);
  const films = jaccard(filmsA, filmsB);
  const watchlist = jaccard(watchA, watchB);
  const genres = jaccard(getGenres(userA.favorites.concat(userA.films)), getGenres(userB.favorites.concat(userB.films)));
  const directors = jaccard(getDirectors(userA.favorites.concat(userA.films)), getDirectors(userB.favorites.concat(userB.films)));
  const actors = jaccard(getActors(userA.favorites.concat(userA.films)), getActors(userB.favorites.concat(userB.films)));
  const decades = jaccard(getDecades(userA.favorites.concat(userA.films)), getDecades(userB.favorites.concat(userB.films)));

  // Weighted average (tweak as desired)
  const overall = (
    favorites * 0.25 +
    films * 0.2 +
    watchlist * 0.1 +
    genres * 0.15 +
    directors * 0.1 +
    actors * 0.1 +
    decades * 0.1
  );

  return {
    favorites: Math.round(favorites * 100),
    films: Math.round(films * 100),
    watchlist: Math.round(watchlist * 100),
    genres: Math.round(genres * 100),
    directors: Math.round(directors * 100),
    actors: Math.round(actors * 100),
    decades: Math.round(decades * 100),
    overall: Math.round(overall * 100),
  };
}
