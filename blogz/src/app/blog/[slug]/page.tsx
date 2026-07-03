// app/blog/[slug]/page.tsx
"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { usePost } from "@/hooks/usePosts";

const categoryLabels: Record<"finance" | "compsci", string> = {
  finance: "Finance",
  compsci: "Computer Science",
};

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: post, isLoading, isError } = usePost(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-[#1e3a8a]">Post not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The post you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/posts"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1e3a8a] px-5 py-2 text-sm text-white transition hover:bg-[#1e40af]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ?.toDate?.()
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
      {/* Back link */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#1e3a8a]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to posts
      </Link>

      {/* Header */}
      <header className="mt-6 space-y-4">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#1e3a8a]">
          {categoryLabels[post.category]}
        </span>

        <h1 className="font-serif text-4xl leading-tight tracking-tight text-[#1e3a8a] sm:text-5xl">
          {post.title}
        </h1>

        <p className="text-lg leading-relaxed text-slate-600">
          {post.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="h-4 w-4" />
          <time>{formattedDate}</time>
        </div>
      </header>

      {/* Banner */}
      {post.bannerImage && (
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-[0_20px_50px_-20px_rgba(30,58,138,0.25)]">
          <Image
            src={post.bannerImage}
            alt={post.title}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-slate mt-12 max-w-none prose-headings:font-serif prose-headings:text-[#1e3a8a] prose-a:text-[#1e3a8a] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-blockquote:border-l-[#1e3a8a] prose-blockquote:bg-blue-50/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-img:rounded-xl">
        {post.content.split("\n").map((para, i) =>
          para.trim() ? (
            <p key={i} className="leading-relaxed text-slate-700">
              {para}
            </p>
          ) : null,
        )}
      </div>

      {/* Footer nav */}
      <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-6">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#1e3a8a]"
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>
        <span className="text-xs text-slate-400">BLOGZ</span>
      </div>
    </article>
  );
}
