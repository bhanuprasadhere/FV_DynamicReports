import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    questionBankId: number | null;
    riskLevel: string | null;
    isDuplicate: boolean;
}

interface Props {
    question: Question;
}

export default function DraggableQuestionCard({ question }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: question.id.toString(),
        data: question
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none group">
            <div
                className={`
          flex items-start gap-3 p-3 mb-2 rounded-lg border transition-all duration-200 select-none
          ${isDragging
                        ? 'bg-white shadow-xl ring-2 ring-blue-500/20 border-blue-500 scale-105 z-50'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
        `}
            >
                {/* Drag Handle */}
                <div className="mt-1 text-gray-300 group-hover:text-gray-400 cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug line-clamp-3 mb-2">
                        {question.text}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                            #{question.questionBankId || 'N/A'}
                        </span>

                        {!question.isDuplicate && question.riskLevel && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                ${question.riskLevel === 'Safety' ? 'bg-red-50 text-red-600 border border-red-100' :
                                    question.riskLevel === 'Low Risk' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                        'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                {question.riskLevel}
                            </span>
                        )}
                    </div>
                </div>

                {/* Status indicator strip */}
                <div className={`w-1 self-stretch rounded-full flex-shrink-0
          ${!question.isDuplicate && question.riskLevel === 'Safety' ? 'bg-red-500' :
                        !question.isDuplicate && question.riskLevel === 'Low Risk' ? 'bg-emerald-500' :
                            'bg-slate-200'}`}
                />
            </div>
        </div>
    );
}
