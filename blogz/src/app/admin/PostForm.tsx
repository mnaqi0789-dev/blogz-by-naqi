"use client";

import { Loader2 } from "lucide-react";
import { usePost } from "@/hooks/usePosts";
import type { Post } from "@/lib/posts";
import PostFormFields from "./PostFormFields";
import { emptyForm, type PostFormValues } from "./schema";

export default function PostForm({
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
  const { data: existing, isLoading } = usePost(editingSlug ?? "");

  if (editingSlug && isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading post…
      </div>
    );
  }

  return (
    <PostFormFields
      key={editingSlug ?? "new"}
      editingSlug={editingSlug}
      initialValues={buildInitialValues(editingSlug, existing)}
      onCancelEdit={onCancelEdit}
      onSubmit={onSubmit}
      submitting={submitting}
    />
  );
}

function buildInitialValues(
  editingSlug: string | null,
  existing: Post | null | undefined,
): PostFormValues {
  if (editingSlug && existing) {
    return {
      title: existing.title,
      slug: existing.slug,
      category: existing.category,
      description: existing.description,
      bannerImage: existing.bannerImage,
      content: existing.content,
    };
  }
  return emptyForm;
}