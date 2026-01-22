import axios, { AxiosInstance } from 'axios';
import { Client, Question, SchemaResponse } from '../types';

const API_BASE_URL = 'http://localhost:5008/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  /**
   * Fetch all available clients (organizations)
   */
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get('/reports/clients');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  },

  /**
   * Fetch schema (questions) for a specific client
   */
  getClientSchema: async (clientId: number): Promise<Question[]> => {
    try {
      const response = await apiClient.get<SchemaResponse>(`/reports/schema/${clientId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch schema for client ${clientId}:`, error);
      throw error;
    }
  },
};

export default apiClient;
