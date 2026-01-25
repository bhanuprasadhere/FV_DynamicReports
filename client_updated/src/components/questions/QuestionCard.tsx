import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Question, SelectionMode } from '../../types';

interface QuestionCardProps {
    question: Question;
    selectionMode: SelectionMode;
    isSelected: boolean;
    onToggle?: () => void;
}

export default function QuestionCard({
    question,
    selectionMode,
    isSelected,
    onToggle
}: QuestionCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: question.id.toString(),
        data: question,
        disabled: selectionMode === 'checkbox',
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const getRiskBadgeClass = (riskLevel: string | null) => {
        if (!riskLevel) return 'badge bg-slate-100 text-slate-600';

        switch (riskLevel.toLowerCase()) {
            case 'safety':
                return 'badge badge-danger';
            case 'low risk':
                return 'badge badge-success';
            case 'medium risk':
                return 'badge badge-warning';
            default:
                return 'badge bg-slate-100 text-slate-600';
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`
        bg-white rounded-lg border p-4 transition-all duration-200
        ${isDragging
                    ? 'shadow-2xl border-primary ring-2 ring-primary/20 scale-105 z-50'
                    : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
        ${selectionMode === 'drag' ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
        >
            <div className="flex items-start gap-3">
                {/* Drag Handle or Checkbox */}
                {selectionMode === 'drag' ? (
                    <div
                        {...listeners}
                        {...attributes}
                        className="mt-1 text-slate-300 hover:text-slate-500 transition-colors cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical size={20} />
                    </div>
                ) : (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggle}
                        className="mt-1 w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
                        aria-label={`Select question ${question.questionBankId}`}
                    />
                )}

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-relaxed mb-3 break-words">
                        {question.text}
                    </p>

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-mono">
                            ID: {question.questionBankId || 'N/A'}
                        </span>

                        <div className="flex items-center gap-2">
                            {question.isDuplicate && (
                                <span className="badge bg-amber-100 text-amber-700">
                                    Duplicate
                                </span>
                            )}
                            {question.riskLevel && (
                                <span className={getRiskBadgeClass(question.riskLevel)}>
                                    {question.riskLevel}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
