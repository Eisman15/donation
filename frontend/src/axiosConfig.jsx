import axios from 'axios';

const axiosInstance = axios.create({
 baseURL: 'http://localhost:5001', // local
 //  baseURL: 'http://3.25.88.207:5001', 
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
