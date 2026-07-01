"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Category } from "@/components/CategoryFilter";

type Ctx = {
  search: string;
  setSearch: (v: string) => void;
  category: Category;
  setCategory: (v: Category) => void;
};

const PostsFilterContext = createContext<Ctx | null>(null);

export function PostsFilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  return (
    <PostsFilterContext.Provider value={{ search, setSearch, category, setCategory }}>
      {children}
    </PostsFilterContext.Provider>
  );
}

export function usePostsFilter() {
  const ctx = useContext(PostsFilterContext);
  if (!ctx) throw new Error("usePostsFilter must be used inside PostsFilterProvider");
  return ctx;
}
