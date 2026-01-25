import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useClients } from './hooks/useClients';
import { useQuestions } from './hooks/useQuestions';
import Header from './components/layout/Header';
import MainLayout from './components/layout/MainLayout';
import VendorStatsBlock from './components/blocks/VendorStatsBlock';
import QuestionsBlock from './components/blocks/QuestionsBlock';
import EMRStatsBlock from './components/blocks/EMRStatsBlock';
import { ArrowRight } from 'lucide-react';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60, // 1 hour
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create Persister
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

function DashboardContent() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const { data: clients, isLoading: isLoadingClients } = useClients();
  const { data: questions, isLoading: isLoadingQuestions } = useQuestions(selectedClientId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        isLoadingClients={isLoadingClients}
      />

      <MainLayout>
        {!selectedClientId ? (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="p-6 bg-white rounded-full shadow-lg mb-6">
              <ArrowRight className="text-primary" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Select a Client to Get Started
            </h2>
            <p className="text-slate-600 max-w-md">
              Choose a client from the dropdown above to view their prequalification questions and analytics.
            </p>
          </div>
        ) : (
          // Three-Block Layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Block I: Vendor Stats (Placeholder) */}
            <div className="lg:col-span-3">
              <VendorStatsBlock />
            </div>

            {/* Block II: Questions (Main) */}
            <div className="lg:col-span-6">
              <QuestionsBlock
                questions={questions}
                isLoading={isLoadingQuestions}
              />
            </div>

            {/* Block III: EMR Stats (Placeholder) */}
            <div className="lg:col-span-3">
              <EMRStatsBlock />
            </div>
          </div>
        )}
      </MainLayout>
    </div>
  );
}

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <DashboardContent />
    </PersistQueryClientProvider>
  );
}
