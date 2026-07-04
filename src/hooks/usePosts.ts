import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFilterStore } from "../store/filterStore";
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "@/lib/posts";
import { Post } from "../lib/posts";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  detail: (slug: string) => [...postKeys.all, "detail", slug] as const,
};

export function usePosts() {
  const activeCategory = useFilterStore((state) => state.activeCategory);

  return useQuery<Post[]>({
    queryKey: postKeys.lists(),
    queryFn: getAllPosts,
    select: (posts) => {
      if (!activeCategory || activeCategory.toLowerCase() === "all") return posts;
      return posts.filter(
        (post) => post.category.toLowerCase() === activeCategory.toLowerCase()
      );
    },
  });
}

export function usePost(slug: string) {
  return useQuery<Post | null>({
    queryKey: postKeys.detail(slug),
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });
}

export function usePostMutations() {
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (newPost: Omit<Post, "id">) => createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<Post> }) =>
      updatePost(slug, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.slug) });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (slug: string) => deletePost(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(slug) });
    },
  });

  return {
    createPost: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    updatePost: updatePostMutation.mutateAsync,
    isUpdating: updatePostMutation.isPending,
    deletePost: deletePostMutation.mutateAsync,
    isDeleting: deletePostMutation.isPending,
  };
}