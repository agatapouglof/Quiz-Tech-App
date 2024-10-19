import { create } from "zustand";

export const useQuizStore = create((set) => ({
  storedScore: 0,
  questionNumber: 0,
  storedQuestion: undefined,
  selectedOptions: [],
  increaseStoredScore: () =>
    set((state) => ({ storedScore: state.storedScore + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  resetStoredScore: () => set({ storedScore: 0 }),
  updateCurrentQuestion: (newQuestion) => set({ storedQuestion: newQuestion }),
  updateSelectedOptions: (newOptions) => set({ selectedOptions: newOptions }),
  resetSelectedOptions: () => set({ selectedOptions: [] }),
  addOption: (newOption) =>
    set((state) => ({
      selectedOptions: [...state.selectedOptions, newOption],
    })),
  removeOption: (newOption) =>
    set((state) => ({
      selectedOptions: state.selectedOptions.filter(
        (option) => option !== newOption,
      ),
    })),
}));
