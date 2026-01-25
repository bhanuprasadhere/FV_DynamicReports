import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import LoadingButton from './LoadingButton';
import emptyCanvas from '../assets/empty_canvas.png';

interface Question {
    id: number;
    text: string;
    questionBankId: number | null;
    riskLevel: string | null;
}

interface Props {
    selectedQuestions: Question[];
    onRemove: (id: number) => void;
    onGenerate: () => Promise<void>;
    isGenerating: boolean;
}

export default function ReportCanvas({ selectedQuestions, onRemove, onGenerate, isGenerating }: Props) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'report-canvas',
    });

    return (
        <div className="flex flex-col h-[750px]">
            <div
                ref={setNodeRef}
                className={`
          flex-1 bg-white border rounded-xl overflow-hidden flex flex-col transition-all duration-200
          ${isOver ? 'border-blue-400 ring-4 ring-blue-50 bg-blue-50/10' : 'border-gray-200 shadow-sm'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Report Builder</h2>
                            <p className="text-xs text-slate-500">Drag questions here to construct report</p>
                        </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
                        {selectedQuestions.length} Items
                    </span>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/30">
                    <AnimatePresence mode="popLayout">
                        {selectedQuestions.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center"
                            >
                                <img
                                    src={emptyCanvas}
                                    alt="Empty Canvas"
                                    className="w-40 h-40 object-contain mb-4 opacity-50 grayscale"
                                />
                                <h3 className="text-sm font-semibold text-slate-700">Canvas is Empty</h3>
                                <p className="text-xs text-slate-500 max-w-[200px] mt-1">
                                    Drag items from the left to start building your report.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-2 pb-20">
                                {selectedQuestions.map((q, idx) => (
                                    <motion.div
                                        key={`${q.id}-${idx}`}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex bg-white p-3 rounded-lg border border-gray-200 shadow-sm group relative hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex-1 pr-6">
                                            <p className="text-sm text-slate-700 leading-relaxed text-wrap">
                                                {q.text}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => onRemove(q.id)}
                                            className="absolute top-2 right-2 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>

                                        {q.riskLevel && (
                                            <div className={`absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full
                         ${q.riskLevel === 'Safety' ? 'bg-red-500' :
                                                    q.riskLevel === 'Low Risk' ? 'bg-emerald-500' :
                                                        'bg-blue-500'}`}
                                            />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-white border-t border-gray-100 z-20">
                    <LoadingButton
                        isLoading={isGenerating}
                        onClick={onGenerate}
                        disabled={selectedQuestions.length === 0}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-none rounded-lg"
                    >
                        {selectedQuestions.length > 0 ? "Generate Final Report" : "Add Items to Generate"}
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}
