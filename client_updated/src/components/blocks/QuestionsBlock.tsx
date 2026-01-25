import { useState, useMemo } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { FileText, ShieldCheck, Users, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import type { Question } from '../../types';
import { useSelectionStore } from '../../store/selectionStore';
import QuestionCard from '../questions/QuestionCard';
import SearchInput from '../ui/SearchInput';
import LoadingSpinner from '../ui/LoadingSpinner';
import ConfirmationModal from '../ui/ConfirmationModal';

interface QuestionsBlockProps {
    questions: Question[] | undefined;
    isLoading: boolean;
}

export default function QuestionsBlock({ questions, isLoading }: QuestionsBlockProps) {
    const [search, setSearch] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        selectedQuestions,
        selectionMode,
        setSelectionMode,
        addQuestion,
        toggleQuestion,
        clearSelection,
    } = useSelectionStore();

    // Sort questions by questionBankId (ascending)
    const sortedQuestions = useMemo(() => {
        if (!questions) return [];
        return [...questions].sort((a, b) => {
            const aId = a.questionBankId || 0;
            const bId = b.questionBankId || 0;
            return aId - bId;
        });
    }, [questions]);

    // Filter questions by search
    const filteredQuestions = useMemo(() => {
        return sortedQuestions.filter(q =>
            q.text.toLowerCase().includes(search.toLowerCase()) ||
            q.questionBankId?.toString().includes(search)
        );
    }, [sortedQuestions, search]);

    // Calculate stats
    const stats = useMemo(() => {
        if (!questions) return { total: 0, critical: 0, duplicates: 0 };
        return {
            total: questions.length,
            critical: questions.filter(q => q.riskLevel === 'Safety').length,
            duplicates: questions.filter(q => q.isDuplicate).length,
        };
    }, [questions]);

    // Drag handlers
    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);

        if (event.over && event.over.id === 'selected-panel') {
            const question = questions?.find(q => q.id.toString() === event.active.id);
            if (question) {
                addQuestion(question);
            }
        }
    };

    // Checkbox mode handlers
    const handleSaveSelection = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setShowConfirmation(false);
        // In real app, this would save to backend
        console.log('Saved questions:', selectedQuestions);
    };

    const activeQuestion = questions?.find(q => q.id.toString() === activeId);

    return (
        <div className="card h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        Prequalification Questions
                    </h2>

                    {/* Mode Toggle */}
                    <button
                        onClick={() => setSelectionMode(selectionMode === 'drag' ? 'checkbox' : 'drag')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                        {selectionMode === 'drag' ? (
                            <>
                                <ToggleLeft className="text-primary" size={20} />
                                <span>Drag & Drop</span>
                            </>
                        ) : (
                            <>
                                <ToggleRight className="text-primary" size={20} />
                                <span>Checkbox</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="text-blue-600" size={16} />
                            <span className="text-xs font-semibold text-blue-900 uppercase">Total</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                            {isLoading ? '-' : stats.total}
                        </p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="text-red-600" size={16} />
                            <span className="text-xs font-semibold text-red-900 uppercase">Critical</span>
                        </div>
                        <p className="text-2xl font-bold text-red-900">
                            {isLoading ? '-' : stats.critical}
                        </p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="text-amber-600" size={16} />
                            <span className="text-xs font-semibold text-amber-900 uppercase">Duplicates</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-900">
                            {isLoading ? '-' : stats.duplicates}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search questions by text or ID..."
                />
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <LoadingSpinner size={40} />
                        <p className="text-slate-500 mt-4">Loading questions...</p>
                    </div>
                ) : filteredQuestions.length > 0 ? (
                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div className="space-y-3">
                            {filteredQuestions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    selectionMode={selectionMode}
                                    isSelected={selectedQuestions.some(q => q.id === question.id)}
                                    onToggle={() => toggleQuestion(question)}
                                />
                            ))}
                        </div>

                        <DragOverlay>
                            {activeQuestion && (
                                <div className="w-96 opacity-90">
                                    <QuestionCard
                                        question={activeQuestion}
                                        selectionMode="drag"
                                        isSelected={false}
                                    />
                                </div>
                            )}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-slate-500">
                            {search ? `No questions found matching "${search}"` : 'No questions available'}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="text-primary text-sm font-medium mt-2 hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Checkbox Mode Actions */}
            {selectionMode === 'checkbox' && selectedQuestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            <span className="font-semibold text-primary">{selectedQuestions.length}</span> questions selected
                        </p>
                        <div className="flex gap-2">
                            <button onClick={clearSelection} className="btn-secondary text-sm">
                                Clear
                            </button>
                            <button
                                onClick={() => setShowConfirmation(true)}
                                className="btn-primary text-sm flex items-center gap-2"
                            >
                                <Save size={16} />
                                Save Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleSaveSelection}
                title="Save Selection"
                message={`Are you sure you want to save ${selectedQuestions.length} selected questions?`}
                confirmText="Save"
                isLoading={isSaving}
            />
        </div>
    );
}
