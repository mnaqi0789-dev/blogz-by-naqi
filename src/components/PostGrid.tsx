import { SearchX } from "lucide-react";
import type { Post } from "@/lib/posts";
import PostCard from "./PostCard";

interface PostGridProps {
  posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/60 p-16 text-center backdrop-blur-xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
          <SearchX className="h-5 w-5 text-blue-600" />
        </span>
        <p className="text-sm font-medium text-slate-600">No posts match that search</p>
        <p className="text-xs text-slate-400">Try a different keyword or switch categories.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard
          key={post.id || `fallback-key-${index}`} 
          post={post}
        />
      ))}
    </div>
  );
}
