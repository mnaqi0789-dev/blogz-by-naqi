"use client";

import { Edit3, FileEdit, Mail, ShieldAlert, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Post } from "@/lib/posts";

const CATEGORY_LABELS: Record<Post["category"], string> = {
  finance: "Finance",
  compsci: "Computer Science",
};

export default function DraftsPanel({
  posts,
  isLoading,
  isDeleting,
  isDemoMode,
  onEdit,
  onPublish,
  onDelete,
}: {
  posts: Post[] | undefined;
  isLoading: boolean;
  isDeleting: boolean;
  isDemoMode: boolean;
  onEdit: (slug: string) => void;
  onPublish: (slug: string) => void;
  onDelete: (slug: string) => void;
}) {
  if (isDemoMode) {
    return (
      <div>
        <h2 className="font-serif text-xl text-slate-900">Drafts</h2>
        <p className="mt-1 text-sm text-slate-500">
          Unpublished posts, visible only to the site owner.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-6 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <ShieldAlert className="h-6 w-6 text-slate-500" />
          </div>
          <p className="font-semibold text-slate-800">
            You&apos;re not allowed to view draft posts in demo mode.
          </p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            For authorization, please contact the admin.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-slate-900">Drafts</h2>
      <p className="mt-1 text-sm text-slate-500">
        Unpublished posts. Publish when ready, or keep editing.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {post.title || "Untitled draft"}
                    </p>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                      Draft
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <span className="truncate">/{post.slug}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => onEdit(post.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-600 hover:text-blue-600"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    onClick={() => onPublish(post.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    Publish
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {`"${post.title}" will be permanently removed from Firestore. This cannot be undone.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={isDeleting}
                          onClick={() => onDelete(post.slug)}
                          className="bg-red-600 font-semibold text-white hover:bg-red-700"
                        >
                          Delete draft
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
            <FileEdit className="mb-3 h-8 w-8 text-slate-300" />
            <p className="font-semibold text-slate-700">No drafts</p>
            <p className="mt-1 text-sm text-slate-500">
              Posts saved as drafts or archived from Manage will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}