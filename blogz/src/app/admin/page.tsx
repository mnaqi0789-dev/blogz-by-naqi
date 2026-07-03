// app/admin/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LogIn,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  FolderHeart,
  Trash2,
  Edit3,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { usePosts, usePostMutations } from "@/hooks/usePosts";

const ROYAL = "#1e3a8a";

export default function AdminPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { loginWithGoogle, logout } = useAuth();
  const { data: posts, isLoading: isLoadingPosts } = usePosts();
  const { deletePost, isDeleting } = usePostMutations();

  const [tab, setTab] = useState<"create" | "manage">("create");
  const [editingPostSlug, setEditingPostSlug] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch {
      setAuthError("Google sign-in failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // ── 1. Not signed in ────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-[0_25px_60px_-25px_rgba(30,58,138,0.25)] backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-blue-900/20"
              style={{ backgroundColor: ROYAL }}
            >
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight" style={{ color: ROYAL }}>
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in with your authorized Google account to manage BLOGZ.
            </p>
          </div>

          {authError && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/70 p-3 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/60 hover:text-[#1e3a8a] disabled:opacity-60"
          >
            {authLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {authLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            Restricted portal. Unauthorized attempts will be denied.
          </p>
        </div>
      </section>
    );
  }

  // ── 2. Signed in but not the admin ─────────────────────────────────
  if (currentUser.email !== adminEmail) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/80 p-10 text-center shadow-[0_25px_60px_-25px_rgba(30,58,138,0.25)] backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-800">
            Not Authorized
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{currentUser.email}</span> does not have
            access to this portal.
          </p>
          <button
            onClick={logout}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: ROYAL }}
          >
            <LogOut className="h-4 w-4" />
            Switch account
          </button>
        </div>
      </section>
    );
  }

  // ── 3. Authorized dashboard ────────────────────────────────────────
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-3 py-1 text-xs font-medium text-[#1e3a8a]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Console
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight" style={{ color: ROYAL }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{currentUser.email}</span>
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-[#1e3a8a]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </header>

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur">
        <TabButton active={tab === "create"} onClick={() => setTab("create")}>
          <PlusCircle className="h-4 w-4" />
          Create Post
        </TabButton>
        <TabButton active={tab === "manage"} onClick={() => setTab("manage")}>
          <FolderHeart className="h-4 w-4" />
          Manage Posts
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {posts?.length ?? 0}
          </span>
        </TabButton>
      </div>

      {/* Panel */}
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-[0_20px_50px_-30px_rgba(30,58,138,0.25)] backdrop-blur-xl">
        {tab === "create" ? (
          <div>
            <h2 className="font-serif text-2xl font-semibold" style={{ color: ROYAL }}>
              {editingPostSlug ? "Edit Post" : "Draft a New Entry"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Compose content, assign metadata, and publish to production.
            </p>

            <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
              <div className="px-6 py-12">
                <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">Editor coming soon</p>
                <p className="mt-1 text-xs text-slate-400">
                  TipTap editor integration point — Step 12
                </p>
              </div>
            </div>

            {editingPostSlug && (
              <button
                onClick={() => setEditingPostSlug(null)}
                className="mt-4 text-xs font-medium text-slate-500 hover:text-[#1e3a8a]"
              >
                ← Cancel edit
              </button>
            )}
          </div>
        ) : (
          <div>
            <h2 className="font-serif text-2xl font-semibold" style={{ color: ROYAL }}>
              Content Inventory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review, edit metadata, or remove live posts.
            </p>

            <div className="mt-6">
              {isLoadingPosts ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                    />
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <ul className="space-y-3">
                  {posts.map((post) => (
                    <li
                      key={post.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-800">
                          {post.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#1e3a8a]">
                            {post.category}
                          </span>
                          <span className="truncate text-xs text-slate-400">/{post.slug}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPostSlug(post.slug);
                            setTab("create");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:text-[#1e3a8a]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          disabled={isDeleting}
                          onClick={async () => {
                            if (confirm(`Permanently remove "${post.title}"?`)) {
                              await deletePost(post.slug);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/60 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
                  <FileText className="mb-3 h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">No posts yet</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Start by drafting your first article.
                  </p>
                  <button
                    onClick={() => setTab("create")}
                    className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:opacity-90"
                    style={{ backgroundColor: ROYAL }}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Create your first post
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── helpers ───────────────────────────────────────────────────────── */

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
          ? "bg-[#1e3a8a] text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-[#1e3a8a]"
      }`}
    >
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
