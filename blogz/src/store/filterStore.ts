import { create } from 'zustand';

interface FilterState {
  activeCategory: 'all' | 'finance' | 'tech';
  setCategory: (category: 'all' | 'finance' | 'tech') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  activeCategory: 'all', 
  setCategory: (category) => set({ activeCategory: category }), 
}));