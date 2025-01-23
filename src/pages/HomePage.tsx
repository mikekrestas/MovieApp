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

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center">
      <h1 className="my-4 pt-5">Latest Movies</h1>
      <div className="container" style={{ paddingTop: '20px' }}>
        <div style={{ height: '500px', overflow: 'visible' }}>
          <Slider {...settings}>
            {movies.map((movie) => (
              <div
                key={movie.movie_id}
                className="px-2"
                style={{
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  borderRadius: '10px',
                }}
              >
                <Link to={`/movie/${movie.movie_id}`} className="block">
                  <img
                    src={movie.posterPath || 'https://via.placeholder.com/200x300'}
                    alt={movie.title}
                    className={`rounded-lg object-cover mx-auto movie-poster ${films.some(film => film.movie_id === movie.movie_id) ? 'in-films' : ''}`}
                    style={{
                      width: '200px',
                      height: '300px',
                      borderRadius: '10px',
                      transition: 'transform 0.3s ease, border-color 0.3s ease',
                      display: 'block',
                      margin: '0 auto',
                      position: 'relative',
                      top: '0',
                    }}
                  />
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default HomePage;