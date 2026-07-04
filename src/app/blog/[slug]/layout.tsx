import type { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const postDoc = await getDoc(doc(db, "posts", resolvedParams.slug));
    
    if (postDoc.exists()) {
      const data = postDoc.data();
      return {
        title: `${data.title} | Blogz`,
        description: data.description || "Read the latest post on Blogz.",
      };
    }
  } catch {
  }

  return {
    title: "Post | Blogz",
    description: "Read the latest post on Blogz.",
  };
}

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}