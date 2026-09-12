"use client";

import { useMemo, useState } from "react";
import { Archive, FolderHeart, LogOut, PlusCircle, Inbox, Eye } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { usePosts, usePostMutations } from "@/hooks/usePosts";
import { useMessages } from "@/hooks/useMessages";
import type { Post } from "@/lib/posts";
import { useAdminTab } from "./useAdminTab";
import PostForm from "./PostForm";
import ManagePanel from "./ManagePanel";
import DraftsPanel from "./DraftsPanel";
import MessagesPanel from "./MessagesPanel";
import DemoModeNotice from "./DemoModeNotice";
import type { PostFormValues } from "./schema";

export default function AdminDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isDemoMode = useAuthStore((s) => s.isDemoMode);
  const exitDemoMode = useAuthStore((s) => s.exitDemoMode);
  const openDemoNotice = useAuthStore((s) => s.openDemoNotice);
  const { logout } = useAuth();
  const { data: posts, isLoading: isLoadingPosts } = usePosts();
  const { data: messages } = useMessages();

  const { createPost, updatePost, deletePost, isCreating, isUpdating, isDeleting } =
    usePostMutations();
  const { tab, setTab } = useAdminTab();
  const [editingPostSlug, setEditingPostSlug] = useState<string | null>(null);

  const publishedPosts = useMemo(
    () => posts?.filter((p) => p.status !== "draft") ?? [],
    [posts],
  );
  const draftPosts = useMemo(
    () => posts?.filter((p) => p.status === "draft") ?? [],
    [posts],
  );

  const handleSubmit = async (values: PostFormValues, status?: Post["status"]) => {
    if (isDemoMode) {
      const action =
        status === "draft"
          ? "save draft posts"
          : editingPostSlug
            ? "save changes to posts"
            : "publish new posts";
      openDemoNotice(action);
      return;
    }
    if (editingPostSlug) {
      const data = status ? { ...values, status } : values;
      await updatePost({ slug: editingPostSlug, data });
      setEditingPostSlug(null);
      setTab(status === "draft" ? "drafts" : "manage");
    } else {
      await createPost({ ...values, status: status ?? "published", createdAt: new Date() });
      setTab(status === "draft" ? "drafts" : "manage");
    }
  };

  const handleDeletePost = (slug: string) => {
    if (isDemoMode) {
      openDemoNotice("delete posts");
      return;
    }
    void deletePost(slug);
  };

  const handleArchivePost = (slug: string) => {
    if (isDemoMode) {
      openDemoNotice("archive posts");
      return;
    }
    void updatePost({ slug, data: { status: "draft" } });
  };

  const handlePublishPost = (slug: string) => {
    if (isDemoMode) {
      openDemoNotice("publish posts");
      return;
    }
    void updatePost({ slug, data: { status: "published" } });
  };

  const handleSignOut = () => {
    if (isDemoMode) {
      exitDemoMode();
      return;
    }
    logout();
  };

  return (
    <main className="min-h-screen px-6 pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        {isDemoMode && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Eye className="h-4 w-4 shrink-0" />
            <span>
              You&apos;re viewing the <span className="font-semibold">Demo Mode</span>{" "}
              admin console. Browsing is unrestricted, but creating, editing, saving, or
              deleting anything is disabled.
            </span>
          </div>
        )}

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
              {isDemoMode ? (
                <span className="font-medium text-slate-700">Demo Mode admin</span>
              ) : (
                <>
                  Signed in as{" "}
                  <span className="font-medium text-slate-700">{currentUser?.email}</span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-600 hover:text-blue-600"
          >
            <LogOut className="h-4 w-4" />
            {isDemoMode ? "Exit demo mode" : "Sign out"}
          </button>
        </header>

        <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white p-1">
          <TabButton active={tab === "create"} onClick={() => setTab("create")}>
            <PlusCircle className="h-4 w-4" />
            Create Post
          </TabButton>
          <TabButton active={tab === "manage"} onClick={() => setTab("manage")}>
            <FolderHeart className="h-4 w-4" />
            Manage Posts
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {publishedPosts.length}
            </span>
          </TabButton>
          <TabButton active={tab === "drafts"} onClick={() => setTab("drafts")}>
            <Archive className="h-4 w-4" />
            Drafts
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {isDemoMode ? 0 : draftPosts.length}
            </span>
          </TabButton>
          <TabButton active={tab === "messages"} onClick={() => setTab("messages")}>
            <Inbox className="h-4 w-4" />
            Inquiries
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {messages?.length ?? 0}
            </span>
          </TabButton>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {tab === "create" && (
            <PostForm
              editingSlug={editingPostSlug}
              onCancelEdit={() => setEditingPostSlug(null)}
              onSubmit={handleSubmit}
              submitting={isCreating || isUpdating}
            />
          )}
          {tab === "manage" && (
            <ManagePanel
              posts={publishedPosts}
              isLoading={isLoadingPosts}
              isDeleting={isDeleting}
              onEdit={(slug) => {
                setEditingPostSlug(slug);
                setTab("create");
              }}
              onArchive={handleArchivePost}
              onDelete={handleDeletePost}
              onEmptyCreate={() => setTab("create")}
            />
          )}
          {tab === "drafts" && (
            <DraftsPanel
              posts={draftPosts}
              isLoading={isLoadingPosts}
              isDeleting={isDeleting}
              isDemoMode={isDemoMode}
              onEdit={(slug) => {
                setEditingPostSlug(slug);
                setTab("create");
              }}
              onPublish={handlePublishPost}
              onDelete={handleDeletePost}
            />
          )}
          {tab === "messages" && <MessagesPanel />}
        </div>
      </div>

      <DemoModeNotice />
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