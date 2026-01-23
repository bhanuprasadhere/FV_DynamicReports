import React, { useMemo, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Question } from '../types';
import { GripVertical, FileText, Search, AlertCircle, ShieldAlert } from 'lucide-react';
import type { QuestionFilters } from '../types';

interface DraggableQuestionProps {
  question: Question;
  index: number;
}

const RiskBadge: React.FC<{ level?: string }> = ({ level }) => {
  if (!level) return null;
  
  const colors: Record<string, string> = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${colors[level] || 'bg-gray-100 text-gray-800'}`}>
      {level}
    </span>
  );
};

const SafetyBadge: React.FC<{ level?: string }> = ({ level }) => {
  if (!level) return null;
  
  const colors: Record<string, string> = {
    'Safe': 'bg-green-50 text-green-700 border border-green-200',
    'Warning': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'Dangerous': 'bg-red-50 text-red-700 border border-red-200',
  };
  
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${colors[level] || 'bg-gray-50 text-gray-700'}`}>
      {level}
    </span>
  );
};

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({ question, index }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `question-${question.id}-${index}`,
    data: { question, type: 'question' },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-3 bg-white border-l-4 border-blue-500 rounded hover:bg-blue-50 transition-colors cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 text-sm line-clamp-2">{question.text}</p>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
              {question.dataType}
            </span>
            {question.riskLevel && <RiskBadge level={question.riskLevel} />}
            {question.safetyLevel && <SafetyBadge level={question.safetyLevel} />}
            {question.isMandatory && (
              <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                Required
              </span>
            )}
          </div>

          {question.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{question.description}</p>
          )}
        </div>

        <FileText size={14} className="text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
};

interface SidebarProps {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ questions, isLoading, error }) => {
  const [filters, setFilters] = useState<QuestionFilters>({
    searchText: '',
    riskLevel: null,
    safetyLevel: null,
    section: null,
    isMandatoryOnly: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique sections and risk/safety levels
  const uniqueSections = useMemo(() => {
    return [...new Set(questions.map((q) => q.sectionName))].sort();
  }, [questions]);

  const riskLevels = useMemo(() => {
    return [...new Set(questions.map((q) => q.riskLevel).filter(Boolean))].sort();
  }, [questions]);

  const safetyLevels = useMemo(() => {
    return [...new Set(questions.map((q) => q.safetyLevel).filter(Boolean))].sort();
  }, [questions]);

  // Apply filters
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        !filters.searchText ||
        q.text.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        q.category.toLowerCase().includes(filters.searchText.toLowerCase());

      const matchesRisk = !filters.riskLevel || q.riskLevel === filters.riskLevel;
      const matchesSafety = !filters.safetyLevel || q.safetyLevel === filters.safetyLevel;
      const matchesSection = !filters.section || q.sectionName === filters.section;
      const matchesMandatory = !filters.isMandatoryOnly || q.isMandatory;

      return matchesSearch && matchesRisk && matchesSafety && matchesSection && matchesMandatory;
    });
  }, [questions, filters]);

  // Paginate
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage]);

  // Group by section
  const groupedQuestions = useMemo(() => {
    const groups: { [key: string]: Question[] } = {};
    paginatedQuestions.forEach((q) => {
      if (!groups[q.sectionName]) {
        groups[q.sectionName] = [];
      }
      groups[q.sectionName].push(q);
    });
    return groups;
  }, [paginatedQuestions]);

  return (
    <aside className="w-96 bg-gray-50 border-r border-gray-200 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-800">Questions Library</h2>
        <p className="text-xs text-gray-500 mt-1">
          {filteredQuestions.length} questions • Drag to canvas →
        </p>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 sticky top-20 z-20 bg-gray-50">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={filters.searchText}
            onChange={(e) => {
              setFilters({ ...filters, searchText: e.target.value });
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 space-y-2 border-b border-gray-200 bg-white">
        <div className="flex gap-2 flex-wrap">
          {/* Risk Level Filter */}
          <select
            value={filters.riskLevel || ''}
            onChange={(e) => {
              setFilters({ ...filters, riskLevel: e.target.value || null });
              setCurrentPage(1);
            }}
            className="text-xs px-2 py-1 border border-gray-300 rounded bg-white cursor-pointer"
          >
            <option value="">All Risk Levels</option>
            {riskLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Mandatory Filter */}
          <label className="text-xs flex items-center gap-1 px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.isMandatoryOnly}
              onChange={(e) => {
                setFilters({ ...filters, isMandatoryOnly: e.target.checked });
                setCurrentPage(1);
              }}
              className="w-3 h-3"
            />
            <span>Required Only</span>
          </label>
        </div>

        {/* Section Filter */}
        {uniqueSections.length > 1 && (
          <select
            value={filters.section || ''}
            onChange={(e) => {
              setFilters({ ...filters, section: e.target.value || null });
              setCurrentPage(1);
            }}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white cursor-pointer"
          >
            <option value="">All Sections</option>
            {uniqueSections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading questions...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <p className="font-medium">Error loading questions</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}

        {!isLoading && !error && questions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Select a client to view questions</p>
          </div>
        )}

        {!isLoading && !error && filteredQuestions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No questions match your filters</p>
          </div>
        )}

        {!isLoading && !error && Object.keys(groupedQuestions).length > 0 && (
          <div className="space-y-4">
            {Object.entries(groupedQuestions).map(([sectionName, sectionQuestions]) => (
              <div key={sectionName} className="space-y-2">
                <div className="sticky top-0 bg-gray-100 px-3 py-2 rounded font-semibold text-gray-700 text-sm">
                  {sectionName}
                </div>
                <div className="space-y-2 pl-2">
                  {sectionQuestions.map((question, idx) => (
                    <DraggableQuestion
                      key={`${sectionName}-${question.id}`}
                      question={question}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && !error && filteredQuestions.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Stats Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-100 text-xs text-gray-600">
        <p>
          Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
        </p>
      </div>
    </aside>
  );
};
