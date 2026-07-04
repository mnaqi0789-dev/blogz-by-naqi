"use client";

import { useState } from "react";
import { FolderHeart, LogOut, PlusCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { usePosts, usePostMutations } from "@/hooks/usePosts";
import { useAdminTab } from "./useAdminTab";
import PostForm from "./PostForm";
import ManagePanel from "./ManagePanel";
import type { PostFormValues } from "./schema";

export default function AdminDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { logout } = useAuth();
  const { data: posts, isLoading: isLoadingPosts } = usePosts();
  const { createPost, updatePost, deletePost, isCreating, isUpdating, isDeleting } =
    usePostMutations();
  const { tab, setTab } = useAdminTab();
  const [editingPostSlug, setEditingPostSlug] = useState<string | null>(null);

  const handleSubmit = async (values: PostFormValues) => {
    if (editingPostSlug) {
      await updatePost({ slug: editingPostSlug, data: values });
    } else {
      await createPost({ ...values, createdAt: new Date() });
    }
  };

  return (
    <main className="min-h-screen px-6 pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Admin Console
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-1 truncate text-sm text-slate-500">
              Signed in as{" "}
              <span className="font-medium text-slate-700">{currentUser?.email}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-600 hover:text-blue-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white p-1">
          <TabButton active={tab === "create"} onClick={() => setTab("create")}>
            <PlusCircle className="h-4 w-4" />
            {editingPostSlug ? "Edit Post" : "Create Post"}
          </TabButton>
          <TabButton active={tab === "manage"} onClick={() => setTab("manage")}>
            <FolderHeart className="h-4 w-4" />
            Manage Posts
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {posts?.length ?? 0}
            </span>
          </TabButton>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {tab === "create" ? (
            <PostForm
              editingSlug={editingPostSlug}
              onCancelEdit={() => setEditingPostSlug(null)}
              onSubmit={handleSubmit}
              submitting={isCreating || isUpdating}
            />
          ) : (
            <ManagePanel
              posts={posts}
              isLoading={isLoadingPosts}
              isDeleting={isDeleting}
              onEdit={(slug) => {
                setEditingPostSlug(slug);
                setTab("create");
              }}
              onDelete={(slug) => {
                void deletePost(slug);
              }}
              onEmptyCreate={() => setTab("create")}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}