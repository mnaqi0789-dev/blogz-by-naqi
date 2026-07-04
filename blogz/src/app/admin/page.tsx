// app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
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
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";

import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { usePosts, usePost, usePostMutations } from "@/hooks/usePosts";
import TipTapEditor from "@/components/ui/TipTapEditor";
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

const ROYAL = "#1e3a8a";

/* ─────────── Validation ─────────── */
const postSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase-with-dashes only"),
  category: z.string().trim().min(2, "Category required").max(40),
  description: z.string().trim().min(10, "Add a short description").max(240),
  bannerUrl: z.string().trim().url("Must be a valid URL"),
  content: z
    .string()
    .refine((v) => v.replace(/<[^>]*>/g, "").trim().length >= 50, {
      message: "Write at least 50 characters of content",
    }),
});

type PostFormValues = z.infer<typeof postSchema>;
type FieldErrors = Partial<Record<keyof PostFormValues, string>>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const emptyForm: PostFormValues = {
  title: "",
  slug: "",
  category: "",
  description: "",
  bannerUrl: "",
  content: "",
};

export default function AdminPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { loginWithGoogle, logout } = useAuth();
  const { data: posts, isLoading: isLoadingPosts } = usePosts();
  const { createPost, updatePost, deletePost, isCreating, isUpdating, isDeleting } =
    usePostMutations();

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as "create" | "manage") || "create";
  const setTab = (tabValue: "create" | "manage") =>
    router.push(`/admin?tab=${tabValue}`);

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

  /* ─── Unauthenticated ─── */
  if (!currentUser) {
    return (
      <Shell>
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e3a8a]/10">
              <ShieldCheck className="h-6 w-6" style={{ color: ROYAL }} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in with your authorized Google account to manage BLOGZ.
            </p>
          </div>

          {authError && (
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {authError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
          >
            {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            {authLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            Restricted portal. Unauthorized attempts will be denied.
          </p>
        </div>
      </Shell>
    );
  }

  /* ─── Signed in but not admin ─── */
  if (currentUser.email !== adminEmail) {
    return (
      <Shell>
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Not Authorized</h1>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{currentUser.email}</span> does not
            have access to this portal.
          </p>
          <button
            onClick={logout}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Switch account
          </button>
        </div>
      </Shell>
    );
  }

  /* ─── Authorized dashboard ─── */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: ROYAL }}>
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Console
            </div>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Signed in as{" "}
              <span className="font-medium text-slate-700">{currentUser.email}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-slate-200">
          <TabButton active={activeTab === "create"} onClick={() => setTab("create")}>
            <PlusCircle className="h-4 w-4" />
            {editingPostSlug ? "Edit Post" : "Create Post"}
          </TabButton>
          <TabButton active={activeTab === "manage"} onClick={() => setTab("manage")}>
            <FolderHeart className="h-4 w-4" />
            Manage Posts
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {posts?.length ?? 0}
            </span>
          </TabButton>
        </div>

        {/* Panel */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {activeTab === "create" ? (
            <PostForm
              key={editingPostSlug ?? "new"}
              editingSlug={editingPostSlug}
              onCancelEdit={() => setEditingPostSlug(null)}
              onSubmit={async (values) => {
                if (editingPostSlug) {
                  await updatePost({ slug: editingPostSlug, data: values });
                } else {
                  await createPost(values);
                }
              }}
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
              onDelete={(slug) => deletePost(slug)}
              onEmptyCreate={() => setTab("create")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Post Form (Create / Edit) ─────────── */

function PostForm({
  editingSlug,
  onCancelEdit,
  onSubmit,
  submitting,
}: {
  editingSlug: string | null;
  onCancelEdit: () => void;
  onSubmit: (values: PostFormValues) => Promise<void>;
  submitting: boolean;
}) {
  const { data: existing, isLoading: loadingExisting } = usePost(editingSlug ?? "");
  const [values, setValues] = useState<PostFormValues>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState(false);

  // Preload when editing
  useEffect(() => {
    if (editingSlug && existing) {
      setValues({
        title: existing.title ?? "",
        slug: existing.slug ?? "",
        category: existing.category ?? "",
        description: existing.description ?? "",
        bannerUrl: existing.bannerUrl ?? "",
        content: existing.content ?? "",
      });
      setSlugTouched(true);
    }
  }, [editingSlug, existing]);

  // Auto-slug from title
  useEffect(() => {
    if (!slugTouched && !editingSlug) {
      setValues((v) => ({ ...v, slug: slugify(v.title) }));
    }
  }, [values.title, slugTouched, editingSlug]);

  const set = <K extends keyof PostFormValues>(k: K, v: PostFormValues[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
    if (saved) setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    const parsed = postSchema.safeParse(values);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof PostFormValues;
        if (!fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      return;
    }
    try {
      await onSubmit(parsed.data);
      setSaved(true);
      if (!editingSlug) {
        setValues(emptyForm);
        setSlugTouched(false);
      }
    } catch (err) {
      setErrors({ title: (err as Error)?.message ?? "Failed to save post" });
    }
  };

  if (editingSlug && loadingExisting) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading post…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {editingSlug ? "Edit Post" : "Draft a New Entry"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Compose content, assign metadata, and publish to production.
          </p>
        </div>
        {editingSlug && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300"
          >
            <X className="h-3.5 w-3.5" />
            Cancel edit
          </button>
        )}
      </header>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {editingSlug ? "Post updated." : "Post published."}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" error={errors.title} className="sm:col-span-2">
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="A catchy headline"
            className={inputCls(!!errors.title)}
          />
        </Field>

        <Field label="Slug" error={errors.slug} hint="Auto-generated from title, editable">
          <input
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            disabled={!!editingSlug}
            placeholder="my-post-slug"
            className={inputCls(!!errors.slug) + (editingSlug ? " bg-slate-50 text-slate-500" : "")}
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <input
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Reading, Writing, Reviews…"
            className={inputCls(!!errors.category)}
          />
        </Field>

        <Field label="Description" error={errors.description} className="sm:col-span-2">
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            maxLength={240}
            placeholder="Short teaser shown on cards & meta tags."
            className={inputCls(!!errors.description) + " resize-none"}
          />
          <div className="mt-1 text-right text-[11px] text-slate-400">
            {values.description.length}/240
          </div>
        </Field>

        <Field label="Banner image URL" error={errors.bannerUrl} className="sm:col-span-2">
          <input
            value={values.bannerUrl}
            onChange={(e) => set("bannerUrl", e.target.value)}
            placeholder="https://…"
            className={inputCls(!!errors.bannerUrl)}
          />
          {values.bannerUrl && !errors.bannerUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
              {/* Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.bannerUrl}
                alt="Banner preview"
                className="h-40 w-full object-cover"
                onError={(e) => ((e.currentTarget.style.display = "none"))}
              />
            </div>
          )}
        </Field>
      </div>

      <Field label="Content" error={errors.content}>
        <TipTapEditor value={values.content} onChange={(html) => set("content", html)} />
      </Field>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={() => {
            setValues(editingSlug && existing
              ? {
                  title: existing.title,
                  slug: existing.slug,
                  category: existing.category ?? "",
                  description: existing.description ?? "",
                  bannerUrl: existing.bannerUrl ?? "",
                  content: existing.content ?? "",
                }
              : emptyForm);
            setErrors({});
            setSaved(false);
          }}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={submitting}
          style={{ backgroundColor: ROYAL }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting
            ? editingSlug ? "Saving…" : "Publishing…"
            : editingSlug ? "Save changes" : "Publish post"}
        </button>
      </div>
    </form>
  );
}

/* ─────────── Manage Panel ─────────── */

function ManagePanel({
  posts,
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
  onEmptyCreate,
}: {
  posts: any[] | undefined;
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
  onEmptyCreate: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">Content Inventory</h2>
      <p className="mt-1 text-sm text-slate-500">Review, edit metadata, or remove live posts.</p>

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
                key={post.slug}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{post.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span
                      style={{ backgroundColor: `${ROYAL}15`, color: ROYAL }}
                      className="rounded-full px-2 py-0.5 font-medium"
                    >
                      {post.category}
                    </span>
                    <span className="truncate">/{post.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(post.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you completely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action is permanent. “{post.title}” will be deleted forever from
                          Firestore.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={isDeleting}
                          onClick={() => onDelete(post.slug)}
                          className="rounded-full bg-red-600 font-semibold text-white hover:bg-red-700"
                        >
                          Delete Post
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
            <p className="mt-1 text-sm text-slate-500">Start by drafting your first article.</p>
            <button
              onClick={onEmptyCreate}
              style={{ backgroundColor: ROYAL }}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
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

/* ─────────── UI helpers ─────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      {children}
    </div>
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
      className={
        "-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition " +
        (active
          ? "border-[#1e3a8a] text-[#1e3a8a]"
          : "border-transparent text-slate-500 hover:text-slate-800")
      }
    >
      {children}
    </button>
  );
}

function Field({
  label,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return (
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 " +
    (hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]/15")
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
