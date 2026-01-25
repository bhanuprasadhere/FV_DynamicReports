import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import {
  Search,
  ShieldCheck,
  Users,
  FileText,
  Loader2,
  Filter,
  ArrowRight
} from 'lucide-react';

import DraggableQuestionCard from './DraggableQuestionCard';
import ReportCanvas from './ReportCanvas';

interface Question {
  id: number;
  text: string;
  questionBankId: number | null;
  riskLevel: string | null;
  isDuplicate: boolean;
}

interface Props {
  questions: Question[] | undefined;
  isLoading: boolean;
  clientSelected: boolean;
}

// Stats Card Component - Professional Style
const StatCard = ({ icon: Icon, label, value, isLoading }: any) => (
  <div className="bg-white border boundary-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
      {isLoading ? <Loader2 className="animate-spin text-blue-500" size={18} /> : <Icon size={18} />}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-xl font-bold text-slate-800 leading-none">{isLoading ? "-" : value}</p>
    </div>
  </div>
);

export default function DashboardBlocks({ questions, isLoading, clientSelected }: Props) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // DND Sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  // Dynamic Filter Extraction
  const availableRiskLevels = useMemo(() => {
    if (!questions) return [];
    const levels = new Set(questions.map(q => q.riskLevel).filter(Boolean));
    return ['All', ...Array.from(levels)];
  }, [questions]);

  // Filter Logic
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    return questions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.questionBankId?.toString().includes(search);
      const matchesFilter = activeFilter === 'All'
        ? true
        : !q.isDuplicate && q.riskLevel === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [questions, search, activeFilter]);

  // Stats Logic
  const stats = useMemo(() => {
    if (!questions) return { total: 0, safety: 0, duplicates: 0 };
    return {
      total: questions.length,
      safety: questions.filter(q => q.riskLevel === 'Safety').length,
      duplicates: questions.filter(q => q.isDuplicate).length
    };
  }, [questions]);

  // DND Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === 'report-canvas') {
      const question = questions?.find(q => q.id === Number(active.id));
      if (question && !selectedQuestions.find(q => q.id === question.id)) {
        setSelectedQuestions(prev => [...prev, question]);
      }
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  if (!clientSelected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white border border-dashed border-gray-300 rounded-2xl">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <ArrowRight size={32} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Select an Organization</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          Use the search bar above to select a client and load their question bank.
        </p>
      </div>
    );
  }

  const activeQuestion = questions?.find(q => q.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={FileText}
            label="Total Items"
            value={stats.total}
            isLoading={isLoading}
          />
          <StatCard
            icon={ShieldCheck}
            label="Critical Risks"
            value={stats.safety}
            isLoading={isLoading}
          />
          <StatCard
            icon={Users}
            label="Duplicates"
            value={stats.duplicates}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COL: Question Bank (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-[750px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header Area */}
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  Question Bank
                  {isLoading && <Loader2 className="animate-spin text-blue-500" size={14} />}
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Live</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search text or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-gray-400"
                  />
                </div>

                {/* Dynamic Filters */}
                {availableRiskLevels.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">

                    {availableRiskLevels.map((level) => (
                      <button
                        key={level as string}
                        onClick={() => setActiveFilter(level as string)}
                        className={`px-3 py-1 rounded-md text-[11px] font-semibold border transition-all duration-200
                          ${activeFilter === level
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50 hover:border-gray-300'}`}
                      >
                        {level as string}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Questions List */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-slate-50/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                        <div className="h-2 bg-gray-100 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredQuestions.length > 0 ? (
                filteredQuestions.map(q => (
                  <DraggableQuestionCard key={q.id} question={q} />
                ))
              ) : (
                <div className="text-center py-20 px-6 flex flex-col items-center">
                  <div className="p-3 bg-white border border-gray-100 rounded-full mb-3 text-slate-300">
                    <Filter size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No questions found</p>
                  <button
                    onClick={() => { setSearch(''); setActiveFilter('All'); }}
                    className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL: Report Canvas (7 cols) */}
          <div className="lg:col-span-7 h-[750px]">
            <ReportCanvas
              selectedQuestions={selectedQuestions}
              onRemove={(id) => setSelectedQuestions(prev => prev.filter(q => q.id !== id))}
              onGenerate={handleGenerateReport}
              isGenerating={isGenerating}
            />
          </div>

        </div>
      </div>

      <DragOverlay dropAnimation={{
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeQuestion ? (
          <div className="opacity-90 w-[320px] cursor-grabbing">
            <DraggableQuestionCard question={activeQuestion} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
