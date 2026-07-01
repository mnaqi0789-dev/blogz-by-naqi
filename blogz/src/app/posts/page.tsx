"use client";

import React, { useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";
import { usePostsFilter } from "@/context/PostsFilterContext";
import PostGrid from "@/components/PostGrid";

const PostsPage = () => {
  const { data: posts = [], isLoading, isError, error } = usePosts();
  const { search, category } = usePostsFilter();

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    
    return posts.filter((post) => {
      const matchesCategory = category === "all" ? true : post.category === category;
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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-2 text-slate-600 font-medium">Loading posts...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md my-12 p-6 rounded-2xl border border-red-200 bg-red-50 text-center text-red-700">
        <h3 className="font-bold text-lg">Failed to load posts</h3>
        <p className="text-sm mt-1">{(error as Error)?.message || "Unknown error occurred"}</p>
      </div>
    );
  }

  return (
    // pt-28 provides safe breathing room below the fixed navigation bubble
    <main className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-blue-600">
          Posts
        </h1>
        <p className="text-sm text-slate-500">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
        </p>
      </header>

      <PostGrid posts={filteredPosts} />
    </main>
  );
};

export default PostsPage;