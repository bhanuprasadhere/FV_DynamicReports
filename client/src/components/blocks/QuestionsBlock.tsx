import { useState, useMemo } from 'react';
import { Search, Download, CheckSquare, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Question } from '@/types/report';
import { useSelectionStore } from '@/store/selectionStore';
import { toast } from '@/hooks/use-toast';

interface QuestionsBlockProps {
    questions: Question[];
    isLoading: boolean;
}

const getRiskColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

    const lower = level.toLowerCase();
    if (lower.includes('high') || lower.includes('safety') || lower.includes('critical')) {
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
    if (lower.includes('medium') || lower.includes('moderate')) {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
    if (lower.includes('low')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
};

export default function QuestionsBlock({ questions, isLoading }: QuestionsBlockProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState<string>('all');
    const { selectedQuestions, toggleQuestion, clearSelection } = useSelectionStore();

    // Deduplicate questions and combine risk levels
    const uniqueQuestions = useMemo(() => {
        const questionMap = new Map<number, Question>();

        questions.forEach(q => {
            if (questionMap.has(q.id)) {
                // Question already exists, merge risk levels
                const existing = questionMap.get(q.id)!;
                const allRiskLevels = [...existing.riskLevels, ...q.riskLevels];
                // Remove duplicates
                existing.riskLevels = Array.from(new Set(allRiskLevels));
                existing.templateCount = (existing.templateCount || 1) + 1;
            } else {
                // New question
                questionMap.set(q.id, { ...q });
            }
        });

        return Array.from(questionMap.values());
    }, [questions]);

    // Get ALL unique risk levels from the data for filter dropdown
    const riskLevels = useMemo(() => {
        const levels = new Set<string>();
        uniqueQuestions.forEach(q => {
            q.riskLevels.forEach(level => {
                if (level) levels.add(level);
            });
        });
        return Array.from(levels).sort();
    }, [uniqueQuestions]);

    // Filter and sort questions
    const filteredQuestions = useMemo(() => {
        let filtered = uniqueQuestions;

        // Filter by Search
        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.text.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by Risk Level - check if ANY of the question's risk levels match
        if (riskFilter !== 'all') {
            filtered = filtered.filter(q => q.riskLevels.includes(riskFilter));
        }

        // Sort by QuestionBankId (ascending)
        return filtered.sort((a, b) => (a.questionBankId || a.id) - (b.questionBankId || b.id));
    }, [uniqueQuestions, searchTerm, riskFilter]);

    // Calculate stats
    const stats = useMemo(() => ({
        total: uniqueQuestions.length,
        selected: selectedQuestions.length,
        critical: uniqueQuestions.filter(q =>
            q.riskLevels.some(level => level?.toLowerCase().includes('safety'))
        ).length
    }), [uniqueQuestions, selectedQuestions.length]);

    const handleExport = () => {
        if (selectedQuestions.length === 0) {
            toast({
                title: 'No questions selected',
                description: 'Please select at least one question to export.',
                variant: 'destructive',
            });
            return;
        }

        // Export as JSON
        const dataStr = JSON.stringify(selectedQuestions, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `selected-questions-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
            title: 'Export successful',
            description: `Exported ${selectedQuestions.length} questions.`,
        });
    };

    const isSelected = (question: Question) =>
        selectedQuestions.some(q => q.id === question.id);

    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-full flex flex-col">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-full flex flex-col">
            {/* Header */}
            <div className="mb-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-foreground">
                        Prequalification Questions
                    </h2>
                    {stats.critical > 0 && (
                        <Badge variant="destructive" className="h-6">
                            {stats.critical} Critical Risks
                        </Badge>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                        <div className="text-xs font-medium text-blue-900 dark:text-blue-100">Total Questions</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                        <div className="text-xs font-medium text-green-900 dark:text-green-100">Selected</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.selected}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Risk Filter */}
                    <Select value={riskFilter} onValueChange={setRiskFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Risk" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Risks</SelectItem>
                            {riskLevels.map(level => (
                                <SelectItem key={level} value={level}>
                                    {level}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="text-sm text-muted-foreground">
                    {filteredQuestions.length} questions
                    {(searchTerm || riskFilter !== 'all') && ` (filtered from ${questions.length})`}
                </div>
                <div className="flex gap-2">
                    {selectedQuestions.length > 0 && (
                        <Button variant="outline" size="sm" onClick={clearSelection}>
                            Clear Selection
                        </Button>
                    )}
                    <Button
                        size="sm"
                        onClick={handleExport}
                        disabled={selectedQuestions.length === 0}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export ({selectedQuestions.length})
                    </Button>
                </div>
            </div>

            {/* Questions List - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No questions found
                        {searchTerm && ` matching "${searchTerm}"`}
                        {riskFilter !== 'all' && ` with risk "${riskFilter}"`}
                    </div>
                ) : (
                    filteredQuestions.map((question) => (
                        <div
                            key={question.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify({
                                    type: 'question',
                                    id: question.id,
                                    text: question.text,
                                    displayName: question.text.substring(0, 50) + (question.text.length > 50 ? '...' : ''),
                                }));
                            }}
                            onClick={() => toggleQuestion(question)}
                            className={`
                                p-4 rounded-lg border cursor-pointer transition-all
                                ${isSelected(question)
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {isSelected(question) ? (
                                        <CheckSquare className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Square className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        {/* Show ALL risk levels as badges */}
                                        {question.riskLevels && question.riskLevels.length > 0 ? (
                                            question.riskLevels.map((level, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className={`border-0 ${getRiskColor(level)}`}
                                                >
                                                    {level}
                                                </Badge>
                                            ))
                                        ) : question.riskLevel ? (
                                            // Fallback to single riskLevel for backward compatibility
                                            <Badge variant="outline" className={`border-0 ${getRiskColor(question.riskLevel)}`}>
                                                {question.riskLevel}
                                            </Badge>
                                        ) : null}

                                        {question.templateCount && question.templateCount > 1 && (
                                            <Badge variant="secondary" className="text-xs">
                                                {question.templateCount} templates
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {question.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
