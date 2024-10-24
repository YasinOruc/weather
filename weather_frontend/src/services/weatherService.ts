import axiosInstance from '../utils/axiosConfig';

export const getWeather = async (city: string) => {
  try {
    const response = await axiosInstance.get('weather/', {
      params: { city },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
