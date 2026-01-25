import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, SelectionMode } from '../types';

interface SelectionState {
    selectedQuestions: Question[];
    selectionMode: SelectionMode;
    addQuestion: (question: Question) => void;
    removeQuestion: (questionId: number) => void;
    clearSelection: () => void;
    setSelectionMode: (mode: SelectionMode) => void;
    toggleQuestion: (question: Question) => void;
}

export const useSelectionStore = create<SelectionState>()(
    persist(
        (set, get) => ({
            selectedQuestions: [],
            selectionMode: 'drag',

            addQuestion: (question) =>
                set((state) => {
                    // Prevent duplicates
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

            clearSelection: () => set({ selectedQuestions: [] }),

            setSelectionMode: (mode) => set({ selectionMode: mode }),

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
        }),
        {
            name: 'selection-storage',
        }
    )
);
