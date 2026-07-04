import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
}

const categoryLabels: Record<Post["category"], string> = {
  finance: "Finance",
  compsci: "Computer Science",
};

export default function PostCard({ post }: PostCardProps) {
  const formattedDate =
    post.createdAt instanceof Date
      ? post.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recent";

  const cleanImageSrc =
    post.bannerImage && post.bannerImage.trim() !== ""
      ? post.bannerImage
      : "https://images.unsplash.com/photo-1499750310107-5fef28a66643"; 

  return (
    <Link
      href={`/blog/${post.slug || "#"}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(30,58,138,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(30,58,138,0.25)] hover:border-blue-200"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <Image
          src={cleanImageSrc}
          alt={post.title || "Blog post"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized // Bypasses local domain configuration restrictions for testing images
        />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
            {categoryLabels[post.category] || "General"}
          </span>
          <time className="text-slate-500">{formattedDate}</time>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700 line-clamp-2">
          {post.title || "Untitled Post"}
        </h3>

        <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
          {post.description || "No description provided for this post."}
        </p>

        <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-blue-700">
          <span>Read more</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
