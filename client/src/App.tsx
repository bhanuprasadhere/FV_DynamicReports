import { useState } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, useQuery } from '@tanstack/react-query';
import DashboardBlocks from './components/DashboardBlocks';
import ClientSearch from './components/ClientSearch';
import { LayoutGrid } from 'lucide-react';
import { getClients, getClientSchema } from './services/api';
// Removed: import './styles/animations.css';

// 1. Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24h
      staleTime: 1000 * 60 * 5,    // 5m
      retry: 1,
    },
  },
});

// 2. Create Persister
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

function DashboardLayout() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Fetch Clients (Cached)
  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  // Fetch Questions (Cached)
  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ['schema', selectedClientId],
    queryFn: () => getClientSchema(selectedClientId!),
    enabled: !!selectedClientId,
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg text-white">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                Dynamic Reports
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Enterprise Console
              </p>
            </div>
          </div>

          {/* Search Component - Aligned Right/Center */}
          <div className="w-full max-w-md">
            <ClientSearch
              clients={clients}
              selectedClientId={selectedClientId}
              onSelect={setSelectedClientId}
              isLoading={loadingClients}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <DashboardBlocks
          questions={questions}
          isLoading={loadingQuestions}
          clientSelected={!!selectedClientId}
        />
      </main>

    </div>
  );
}

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <DashboardLayout />
    </PersistQueryClientProvider>
  );
}