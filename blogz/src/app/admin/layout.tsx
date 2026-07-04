import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Blogz",
  description: "Manage your platform entries and inquiries.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}