import { create } from "zustand";
import type { Category } from "@/components/CategoryFilter";

interface FilterState {
  activeCategory: Category;
  setCategory: (category: Category) => void;
  search: string;
  setSearch: (search: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  activeCategory: "all",
  setCategory: (category) => set({ activeCategory: category }),
  search: "",
  setSearch: (search) => set({ search }),
}));
