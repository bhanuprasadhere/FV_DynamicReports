import React, { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Question } from '../types';
import { GripVertical, FileText } from 'lucide-react';

interface DraggableQuestionProps {
  question: Question;
  index: number;
}

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
      className={`flex items-start gap-3 p-3 bg-white border-l-4 border-blue-500 rounded hover:bg-blue-50 transition-colors cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm line-clamp-2">{question.text}</p>
        <p className="text-xs text-gray-500 mt-1">{question.dataType}</p>
      </div>
      <FileText size={16} className="text-gray-400 flex-shrink-0" />
    </div>
  );
};

interface SidebarProps {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ questions, isLoading, error }) => {
  // Group questions by SectionName
  const groupedQuestions = useMemo(() => {
    const groups: { [key: string]: Question[] } = {};
    questions.forEach((question) => {
      if (!groups[question.sectionName]) {
        groups[question.sectionName] = [];
      }
      groups[question.sectionName].push(question);
    });
    return groups;
  }, [questions]);

  const sections = Object.entries(groupedQuestions);

  return (
    <aside className="w-96 bg-gray-50 border-r border-gray-200 overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-800">Questions Library</h2>
        <p className="text-xs text-gray-500 mt-1">Drag questions to the canvas →</p>
      </div>

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

        {!isLoading && !error && sections.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Select a client to view questions</p>
          </div>
        )}

        {!isLoading && !error && sections.length > 0 && (
          <div className="space-y-4">
            {sections.map(([sectionName, sectionQuestions]) => (
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
    </aside>
  );
};
