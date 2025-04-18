// src/services/recommendationService.ts
import axios from 'axios';

export const getRecommendations = async (
  {
    favorite_movie_ids = [],
    watched_movie_ids = [],
    watchlist_movie_ids = []
  }: {
    favorite_movie_ids: string[];
    watched_movie_ids: string[];
    watchlist_movie_ids: string[];
  },
  numRecommendations: number = 5
) => {
  try {
    const response = await axios.post('http://localhost:5000/recommend', {
      favorite_movie_ids,
      watched_movie_ids,
      watchlist_movie_ids,
      num_recommendations: numRecommendations,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
