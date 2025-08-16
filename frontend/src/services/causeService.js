import axiosInstance from '../axiosConfig';

export const createCause = async (causeData) => {
  try {
    const response = await axiosInstance.post('/api/causes', causeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCauses = async () => {
  try {
    const response = await axiosInstance.get('/api/causes');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};