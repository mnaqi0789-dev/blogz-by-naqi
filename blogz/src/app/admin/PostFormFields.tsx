"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Save, X } from "lucide-react";
import TipTapEditor from "@/components/ui/TipTapEditor";
import {
  postSchema,
  slugify,
  emptyForm,
  CATEGORY_OPTIONS,
  type PostFormValues,
  type FieldErrors,
} from "./schema";

export default function PostFormFields({
  editingSlug,
  initialValues,
  onCancelEdit,
  onSubmit,
  submitting,
}: {
  editingSlug: string | null;
  initialValues: PostFormValues;
  onCancelEdit: () => void;
  onSubmit: (values: PostFormValues) => Promise<void>;
  submitting: boolean;
}) {
  const [values, setValues] = useState<PostFormValues>(initialValues);
  const [slugTouched, setSlugTouched] = useState(!!editingSlug);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (saved) setSaved(false);
  };

  const handleTitleChange = (title: string) => {
    if (slugTouched) {
      set("title", title);
      return;
    }
    setValues((prev) => ({ ...prev, title, slug: slugify(title) }));
    if (saved) setSaved(false);
  };

  const handleSlugChange = (raw: string) => {
    setSlugTouched(true);
    set("slug", slugify(raw));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    const parsed = postSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof PostFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    try {
      await onSubmit(parsed.data);
      setSaved(true);
      if (!editingSlug) {
        setValues({ ...emptyForm });
        setSlugTouched(false);
      }
    } catch (err) {
      setErrors({ title: (err as Error)?.message ?? "Failed to save post" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-slate-900">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-600 hover:text-blue-600"
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
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="A catchy headline"
            className={inputCls(!!errors.title)}
          />
        </Field>

        <Field label="Slug" error={errors.slug} hint="Auto-generated from title, editable">
          <input
            value={values.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            disabled={!!editingSlug}
            placeholder="my-post-slug"
            className={
              inputCls(!!errors.slug) + (editingSlug ? " bg-slate-50 text-slate-500" : "")
            }
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value as PostFormValues["category"])}
            className={inputCls(!!errors.category)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

        <Field label="Banner image URL" error={errors.bannerImage} className="sm:col-span-2">
          <input
            value={values.bannerImage}
            onChange={(e) => set("bannerImage", e.target.value)}
            placeholder="https://…"
            className={inputCls(!!errors.bannerImage)}
          />
          {values.bannerImage && !errors.bannerImage && (
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
              <img
                src={values.bannerImage}
                alt="Banner preview"
                className="h-40 w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
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
            setValues(initialValues);
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
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {submitting
            ? editingSlug
              ? "Saving…"
              : "Publishing…"
            : editingSlug
              ? "Save changes"
              : "Publish post"}
        </button>
      </div>
    </form>
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
      : "border-slate-200 focus:border-blue-600 focus:ring-blue-100")
  );
}