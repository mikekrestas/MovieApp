import axios from 'axios';

export const getRecommendations = async (query: string) => {
  try {
    const response = await axios.post('/recommend', { query });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
