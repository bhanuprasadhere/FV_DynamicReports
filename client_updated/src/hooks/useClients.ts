import { useQuery } from '@tanstack/react-query';
import { getClients } from '../services/api';

export const useClients = () => {
    return useQuery({
        queryKey: ['clients'],
        queryFn: getClients,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
    });
};
