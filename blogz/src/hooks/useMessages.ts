import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, doc, deleteDoc, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const messageKeys = {
  all: ["messages"] as const,
};

async function getAllMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        name: data.name || "",
        email: data.email || "",
        subject: data.subject || "",
        message: data.message || "",
        createdAt: data.createdAt?.toDate()
          ? data.createdAt.toDate()
          : new Date(data.createdAt || Date.now()),
      };
    });
  } catch (e) {
    console.error("Error fetching messages: ", e);
    throw e;
  }
}

async function deleteMessageById(id: string): Promise<void> {
  try {
    const messageDocRef = doc(db, "messages", id);
    await deleteDoc(messageDocRef);
  } catch (e) {
    console.error(`Error deleting message with ID ${id}: `, e);
    throw e;
  }
}

async function createContactMessage(data: ContactMessageInput): Promise<string> {
  try {
    const messagesCollection = collection(db, "messages");
    const docRef = await addDoc(messagesCollection, {
      ...data,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error writing message document: ", e);
    throw e;
  }
}

export function useMessages() {
  return useQuery<ContactMessage[]>({
    queryKey: messageKeys.all,
    queryFn: getAllMessages,
  });
}

export function useMessageMutations() {
  const queryClient = useQueryClient();

  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => deleteMessageById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: (data: ContactMessageInput) => createContactMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
  });

  return {
    deleteMessage: deleteMessageMutation.mutateAsync,
    isDeletingMessage: deleteMessageMutation.isPending,
    submitMessage: createMessageMutation.mutateAsync,
    isSubmittingMessage: createMessageMutation.isPending,
  };
}