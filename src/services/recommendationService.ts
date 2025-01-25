// src/services/recommendationService.ts
import axios from 'axios';

export const getRecommendations = async (favoriteMovieIds: string[], numRecommendations: number = 5) => {
  try {
    const response = await axios.post('http://localhost:5000/recommend', {
      favorite_movie_ids: favoriteMovieIds,
      num_recommendations: numRecommendations,
    });
    console.log('Received recommendations:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
