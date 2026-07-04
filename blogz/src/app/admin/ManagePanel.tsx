"use client";

import { Edit3, FileText, PlusCircle, Trash2 } from "lucide-react";
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

export default function ManagePanel({
  posts,
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
  onEmptyCreate,
}: {
  posts: Post[] | undefined;
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
  onEmptyCreate: () => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-xl text-slate-900">Content Inventory</h2>
      <p className="mt-1 text-sm text-slate-500">
        Review, edit metadata, or remove live posts.
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
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {post.title}
                  </p>
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

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
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
                          Delete post
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
            <FileText className="mb-3 h-8 w-8 text-slate-300" />
            <p className="font-semibold text-slate-700">No posts yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Start by drafting your first article.
            </p>
            <button
              onClick={onEmptyCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              Create your first post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}