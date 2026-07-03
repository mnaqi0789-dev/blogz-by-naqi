"use client";

import React, { useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useFilterStore } from "@/store/filterStore";
import PostGrid from "@/components/PostGrid";

const categoryLabels: Record<string, string> = {
  all: "All",
  finance: "Finance",
  compsci: "Computer Science",
};

const PostsPage = () => {
  const { data: posts = [], isLoading, isError, error } = usePosts();
  const search = useFilterStore((state) => state.search);
  const category = useFilterStore((state) => state.activeCategory);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        category === "all" ? true : post.category === category;
      if (!matchesCategory) return false;

      if (!query) return true;
      return (
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
    });
  }, [posts, search, category]);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-2 text-slate-600 font-medium">
            Loading posts...
          </span>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <h3 className="font-bold text-lg">Failed to load posts</h3>
          <p className="text-sm mt-1">
            {(error as Error)?.message || "Unknown error occurred"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
              The Archive
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Posts
          </h1>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-xl">
          <span className="font-semibold text-blue-600">
            {filteredPosts.length}
          </span>
          <span>{filteredPosts.length === 1 ? "post" : "posts"}</span>
          {category !== "all" && (
            <>
              <span className="text-slate-300">&middot;</span>
              <span>{categoryLabels[category]}</span>
            </>
          )}
        </div>
      </header>

      <PostGrid posts={filteredPosts} />
    </main>
  );
};

export default PostsPage;