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
      <main className="flex min-h-screen items-center justify-center px-6 pt-28 pb-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 pt-28 pb-12 text-center">
        <h1 className="font-serif text-2xl text-slate-900">Post not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The post you are looking for does not exist or may have been
          removed.
        </p>
        <Link
          href="/posts"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>
      </main>
    );
  }

  const formattedDate =
    post.createdAt instanceof Date
      ? post.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Recently";

  return (
    <main className="min-h-screen pb-24 pt-24 sm:pt-28">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <Link
          href="/posts"
          className="absolute left-8 top-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white sm:left-12 sm:top-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All posts
        </Link>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-[0_25px_60px_-20px_rgba(30,58,138,0.35)] sm:aspect-[16/8]">
          {post.bannerImage ? (
            <Image
              src={post.bannerImage}
              alt={post.title}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
              {categoryLabels[post.category] ?? post.category}
            </span>

            <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
              <Calendar className="h-4 w-4" />
              <time>{formattedDate}</time>
            </div>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 pt-10 sm:px-6">
        {post.description && (
          <p className="border-l-2 border-blue-200 pl-5 font-serif text-lg italic leading-relaxed text-slate-600">
            {post.description}
          </p>
        )}

        <div
          className="prose prose-slate mt-10 max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-700 prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-blockquote:border-l-blue-600 prose-blockquote:bg-blue-50/50 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:not-italic prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-6">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>
          <span className="text-xs font-semibold tracking-widest text-slate-400">
            BLOGZ
          </span>
        </div>
      </article>
    </main>
  );
}