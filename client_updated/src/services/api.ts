import axios from 'axios';
import type { Client, Question } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:5008/api',
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[API Error]:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getClients = async (): Promise<Client[]> => {
    const { data } = await api.get<Client[]>('/reports/clients');
    return data;
};

export const getClientSchema = async (clientId: number): Promise<Question[]> => {
    const { data } = await api.get<Question[]>(`/reports/schema/${clientId}`);
    return data;
};

export default api;
