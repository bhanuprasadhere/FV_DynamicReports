import axios from 'axios';

// Ensure this matches your running Backend port (5008)
const api = axios.create({
  baseURL: 'http://localhost:5008/api/reports',
});

export const getClients = async () => {
  const { data } = await api.get('/clients');
  return data;
};

export const getClientSchema = async (clientId: number) => {
  const { data } = await api.get(`/schema/${clientId}`);
  return data;
};