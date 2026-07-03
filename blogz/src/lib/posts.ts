import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: "finance" | "compsci";
  bannerImage: string;
  createdAt: Date;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const posts: Post[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title || "",
        slug: data.slug || "",
        description: data.description || "",
        content: data.content || "",
        category: data.category || "finance",
        bannerImage: data.bannerImage || "",
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate()
            : new Date(data.createdAt || Date.now()),
      };
    });

    return posts;
  } catch (e) {
    console.error("Error fetching all posts: ", e);
    throw e;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      title: data.title || "",
      slug: data.slug || "",
      description: data.description || "",
      content: data.content || "",
      category: data.category || "finance",
      bannerImage: data.bannerImage || "",
      createdAt: data.createdAt?.toDate()
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now()),
    };
  } catch (e) {
    console.error(`Error fetching post with slug ${slug}: `, e);
    throw e;
  }
}

export async function createPost(
  post: Omit<Post, "id"> & { id?: string },
): Promise<string> {
  try {
    const postsRef = collection(db, "posts");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude `id` from the write payload
    const { id, ...firebasePayload } = post;

    const docRef = await addDoc(postsRef, firebasePayload);
    console.log("Document successfully written with ID: ", docRef.id);

    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function updatePost(
  slug: string,
  data: Partial<Omit<Post, "id">>,
): Promise<void> {
  try {
    const q = query(
      collection(db, "posts"),
      where("slug", "==", slug),
      limit(1),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Post with slug "${slug}" not found.`);
    }
    const docId = querySnapshot.docs[0].id;
    const postDocRef = doc(db, "posts", docId);

    await updateDoc(postDocRef, data);
    console.log(`Document with slug "${slug}" updated successfully.`);
  } catch (e) {
    console.error(`Error updating post with slug ${slug}: `, e);
    throw e;
  }
}

export async function deletePost(slug: string): Promise<void> {
  try {
    const q = query(
      collection(db, "posts"),
      where("slug", "==", slug),
      limit(1),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Post with slug "${slug}" not found.`);
    }
    const docId = querySnapshot.docs[0].id;
    const postDocRef = doc(db, "posts", docId);

    await deleteDoc(postDocRef);
    console.log(`🗑️ Document with slug "${slug}" deleted successfully.`);
  } catch (e) {
    console.error(`Error deleting post with slug ${slug}: `, e);
    throw e;
  }
}