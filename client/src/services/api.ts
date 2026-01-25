import axios from 'axios';

// Create Axios Instance
export const api = axios.create({
  baseURL: 'http://localhost:5008/api',
  timeout: 10000,
});

// Request Interceptor: Add specific headers or logging
api.interceptors.request.use(
  (config) => {
    // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => {
    // Optional: Simulate network delay for "Loading" feel validation during dev
    // await new Promise(r => setTimeout(r, 500));
    return response;
  },
  (error) => {
    console.error('[API Error]:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getClients = async () => {
  const { data } = await api.get('/reports/clients');
  return data;
};

export const getClientSchema = async (clientId: number) => {
  const { data } = await api.get(`/reports/schema/${clientId}`);
  return data;
};