import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question } from '@/types/report';

type SelectionMode = 'checkbox' | 'drag';

interface SelectionState {
    selectedQuestions: Question[];
    selectionMode: SelectionMode;
    addQuestion: (question: Question) => void;
    removeQuestion: (questionId: number) => void;
    toggleQuestion: (question: Question) => void;
    clearSelection: () => void;
    setSelectionMode: (mode: SelectionMode) => void;
}

export const useSelectionStore = create<SelectionState>()(
    persist(
        (set, get) => ({
            selectedQuestions: [],
            selectionMode: 'checkbox',

            addQuestion: (question) =>
                set((state) => {
                    if (state.selectedQuestions.find((q) => q.id === question.id)) {
                        return state;
                    }
                    return {
                        selectedQuestions: [...state.selectedQuestions, question],
                    };
                }),

            removeQuestion: (questionId) =>
                set((state) => ({
                    selectedQuestions: state.selectedQuestions.filter((q) => q.id !== questionId),
                })),

            toggleQuestion: (question) => {
                const { selectedQuestions } = get();
                const exists = selectedQuestions.find((q) => q.id === question.id);

                if (exists) {
                    set({
                        selectedQuestions: selectedQuestions.filter((q) => q.id !== question.id),
                    });
                } else {
                    set({
                        selectedQuestions: [...selectedQuestions, question],
                    });
                }
            },

            clearSelection: () => set({ selectedQuestions: [] }),

            setSelectionMode: (mode) => set({ selectionMode: mode }),
        }),
        {
            name: 'selection-storage',
        }
    )
);
