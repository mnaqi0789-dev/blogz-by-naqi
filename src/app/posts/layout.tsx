import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Posts Archive | Blogz",
  description: "Browse through our collection of technical write-ups, engineering notes, and insights.",
};

export default function PostsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}