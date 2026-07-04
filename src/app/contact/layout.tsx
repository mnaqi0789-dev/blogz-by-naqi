import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Blogz",
  description: "Get in touch with the team. Questions, pitches, or feedback are welcome.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}