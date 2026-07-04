"use client";

import React from "react";
import { Trash2, Loader2, Inbox, User, Calendar, Mail, Phone } from "lucide-react";
import { useMessages, useMessageMutations } from "@/hooks/useMessages";
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

export default function MessagesPanel() {
  const { data: messages, isLoading } = useMessages();
  const { deleteMessage, isDeletingMessage } = useMessageMutations();

  return (
    <div>
      <h2 className="font-serif text-xl text-slate-900">Inbox Inquiries</h2>
      <p className="mt-1 text-sm text-slate-500">
        Review submitted messages and direct requests from the contact module.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg) => {
              const lines = msg.message.split("\n");
              let displayMessage = msg.message;
              let extractedEmail = "";
              let extractedPhone = "";

              lines.forEach((line) => {
                if (line.startsWith("Email: ")) {
                  extractedEmail = line.replace("Email: ", "").trim();
                } else if (line.startsWith("Phone: ")) {
                  extractedPhone = line.replace("Phone: ", "").trim();
                }
              });

              if (extractedEmail || extractedPhone) {
                const messageStartIndex = lines.findIndex(
                  (line) =>
                    !line.startsWith("Email: ") &&
                    !line.startsWith("Phone: ") &&
                    line.trim() !== ""
                );
                if (messageStartIndex !== -1) {
                  displayMessage = lines.slice(messageStartIndex).join("\n");
                }
              }

              const finalEmail = extractedEmail || msg.email;

              return (
                <li
                  key={msg.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        {msg.subject}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                          <User className="h-3 w-3" /> {msg.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {msg.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={isDeletingMessage}
                          className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {isDeletingMessage ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Remove
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl max-w-sm border-slate-200 bg-white p-6">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif text-lg text-slate-900">
                            Remove Inquiry?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm text-slate-500">
                            This action is permanent. The submission by &ldquo;{msg.name}&rdquo; will be removed from Firestore.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                          <AlertDialogCancel className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 text-xs">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              await deleteMessage(msg.id);
                            }}
                            className="rounded-full bg-red-600 font-semibold text-white hover:bg-red-700 text-xs"
                          >
                            Delete Permanently
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                    <div className="flex flex-col gap-1.5 border-b border-slate-200/60 pb-3 text-xs text-slate-600">
                      {finalEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">Email:</span>
                          <span className="select-all text-slate-900">{finalEmail}</span>
                        </div>
                      )}
                      {extractedPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">Phone:</span>
                          <span className="select-all text-slate-900">{extractedPhone}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pt-0.5">
                      {displayMessage}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
            <Inbox className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">Inbox empty</p>
            <p className="mt-1 text-xs text-slate-400">
              No inbound communication forms have been submitted yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}