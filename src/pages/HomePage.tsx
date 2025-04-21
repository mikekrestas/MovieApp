// src/pages/HomePage.tsx
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Movie } from '../types/types';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css'; // Ensure global styles are imported
import { getFavorites, getFilms, getWatchlist, getRating } from '../services/authService';
import { getRecommendations } from '../services/recommendationService';
import MovieCard from '../components/MovieCard';

interface HomePageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
  films: Movie[];
}

const HomePage: React.FC<HomePageProps> = ({ user, favorites, setFavorites, movies, films }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [recommendations, setRecommendations] = React.useState<Movie[]>([]);
  const [loadingRecs, setLoadingRecs] = React.useState(false);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setRecommendations([]);
        return;
      }
      setLoadingRecs(true);
      // Gather favorites, watchlist, and watched/films
      const [fav, watch, filmsList] = await Promise.all([
        getFavorites(user.uid),
        getWatchlist(user.uid),
        getFilms(user.uid)
      ]);
      // Get highly-rated movies (8 or above)
      const ratings: { [movieId: string]: number } = {};
      for (const movie of fav.concat(filmsList)) {
        const r = await getRating(user.uid, movie.movie_id);
        if (r && r >= 8) ratings[movie.movie_id] = r;
      }
      // Prepare lists for backend
      const favorite_movie_ids = fav.map(m => m.movie_id);
      const watched_movie_ids = Array.from(new Set([
        ...filmsList.map(m => m.movie_id),
        ...Object.keys(ratings)
      ]));
      const watchlist_movie_ids = watch.map(m => m.movie_id);
      // Fetch recommendations
      const recs = await getRecommendations({
        favorite_movie_ids,
        watched_movie_ids,
        watchlist_movie_ids
      }, 12);
      setRecommendations(recs);
      setLoadingRecs(false);
    };
    fetchRecommendations();
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <h1 className="my-3 pt-5 text-4xl font-bold text-white drop-shadow-lg">Latest Movies</h1>
      <div className="container pt-4">
        <div className="h-[500px] overflow-visible pb-8">
          <Slider {...settings}>
            {movies.map((movie) => {
              const isInFilms = films.some(film => film.movie_id === movie.movie_id);
              return (
                <div
                  key={movie.movie_id}
                  className="px-2 relative z-10 group flex items-center justify-center"
                  style={{ overflow: 'visible' }}
                >
                  <Link to={`/movie/${movie.movie_id}`} className="block" style={{ overflow: 'visible' }}>
                    <img
                      src={movie.posterPath || 'https://via.placeholder.com/200x300'}
                      alt={movie.title}
                      className={`rounded-2xl object-cover mx-auto shadow-xl border-2 border-transparent bg-gray-900/80 transition-transform duration-200 group-hover:scale-105 ${isInFilms ? 'group-hover:border-green-400' : 'group-hover:border-cyan-400'}`}
                      style={{ width: '200px', height: '300px', marginTop: '16px' }}
                    />
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
      {/* Recommendations Carousel */}
      {user && (
        <div className="container pt-8 w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Recommended For You</h2>
            <Link to="/recommendations" className="text-cyan-400 hover:underline text-base">See All</Link>
          </div>
          {loadingRecs ? (
            <div className="text-center text-gray-300 py-8">Loading recommendations...</div>
          ) : recommendations.length === 0 ? (
            <div className="text-center text-gray-300 py-8">No recommendations yet. Add favorites, rate movies, or add to your watchlist!</div>
          ) : (
            <div className="h-[340px] overflow-visible pb-8">
              <Slider {...settings}>
                {recommendations.map((movie) => {
                  const isInFilms = films.some(film => film.movie_id === movie.movie_id);
                  return (
                    <div
                      key={movie.movie_id}
                      className="px-2 relative z-10 group flex items-center justify-center"
                      style={{ overflow: 'visible' }}
                    >
                      <MovieCard movie={movie} isInFilms={isInFilms} style={{}} />
                    </div>
                  );
                })}
              </Slider>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;