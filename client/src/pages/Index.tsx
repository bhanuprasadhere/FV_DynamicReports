import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/report/Header';
import VendorStatsBlock from '@/components/blocks/VendorStatsBlock';
import QuestionsBlock from '@/components/blocks/QuestionsBlock';
import EMRStatsBlock from '@/components/blocks/EMRStatsBlock';
import ReportBuilderBlock from '@/components/blocks/ReportBuilderBlock';
import { fetchClients, fetchQuestionsWithRiskLevels } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  // Fetch clients with caching
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  // Fetch questions with ALL risk levels when client is selected
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questionsWithRiskLevels', selectedClient],
    queryFn: () => fetchQuestionsWithRiskLevels(selectedClient!),
    enabled: !!selectedClient,
  });

  // Show toast when client is selected
  useEffect(() => {
    if (selectedClient && questions.length > 0) {
      toast({
        title: 'Questions loaded',
        description: `Loaded ${questions.length} questions for the selected client.`,
      });
    }
  }, [selectedClient, questions.length]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        clients={clients}
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
        isLoadingClients={isLoadingClients}
      />

      <main className="flex-1 container mx-auto px-6 py-8 overflow-hidden">
        {!selectedClient ? (
          // Empty State - No client selected
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="p-6 bg-card rounded-full shadow-lg mb-6 border border-border">
              <ArrowRight className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Select a Client to Get Started
            </h2>
            <p className="text-muted-foreground max-w-md text-lg">
              Choose a client from the search bar above to view their prequalification questions and build custom reports.
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              {clients.length > 0 && (
                <span>{clients.length.toLocaleString()} clients available</span>
              )}
            </div>
          </div>
        ) : (
          // 4-Block Layout with Fixed Heights
          <div className="h-[calc(100vh-140px)] flex flex-col gap-4">
            {/* Top 3 Blocks - Fixed Height */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[50%]">
              {/* Block I: Vendor Stats */}
              <div className="lg:col-span-3 h-full overflow-hidden">
                <VendorStatsBlock />
              </div>

              {/* Block II: Questions (Main) */}
              <div className="lg:col-span-6 h-full overflow-hidden">
                <QuestionsBlock
                  questions={questions}
                  isLoading={isLoadingQuestions}
                />
              </div>

              {/* Block III: EMR Stats (Placeholder) */}
              <div className="lg:col-span-3 h-full overflow-hidden">
                <EMRStatsBlock />
              </div>
            </div>

            {/* Block IV: Report Builder (Bottom) - Fixed Height */}
            <div className="h-[50%] overflow-hidden">
              <ReportBuilderBlock clientId={selectedClient} />
            </div>
          </div>
        )}
      </main>
    </div>
  );

};

export default Index;
