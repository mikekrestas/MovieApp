import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Movie } from '../types/types';
import { User } from 'firebase/auth';

interface HomePageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
}

const HomePage: React.FC<HomePageProps> = ({ user, favorites, setFavorites, movies }) => {
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
    <div className="bg-dark text-white min-vh-100">
      <h1 className="my-5 text-center">Latest Movies</h1>
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie.movie_id} className="px-2">
              <Link to={`/movie/${movie.movie_id}`} className="block">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="rounded-lg object-cover mx-auto"
                  style={{
                    width: '200px', // Ensures the posters have a fixed width
                    height: '300px', // Ensures the posters have a fixed height
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  }}
                />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomePage;
