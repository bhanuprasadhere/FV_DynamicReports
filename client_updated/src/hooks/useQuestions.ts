import { useQuery } from '@tanstack/react-query';
import { getClientSchema } from '../services/api';

export const useQuestions = (clientId: number | null) => {
    return useQuery({
        queryKey: ['questions', clientId],
        queryFn: () => getClientSchema(clientId!),
        enabled: !!clientId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
    });
};
