"use client";

import Link from "next/link";
import { ShieldAlert, Mail } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function DemoModeNotice() {
  const demoNoticeOpen = useAuthStore((s) => s.demoNoticeOpen);
  const demoNoticeAction = useAuthStore((s) => s.demoNoticeAction);
  const closeDemoNotice = useAuthStore((s) => s.closeDemoNotice);

  return (
    <Dialog
      open={demoNoticeOpen}
      onOpenChange={(open) => {
        if (!open) closeDemoNotice();
      }}
    >
      <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
            <ShieldAlert className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle className="text-center font-serif text-lg text-slate-900">
            Action not allowed
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-500">
            {`You're not allowed to ${demoNoticeAction} in demo mode. For authorization, please contact the admin.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="-mx-6 -mb-6 mt-2 flex flex-col-reverse gap-2 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <button
              type="button"
              onClick={closeDemoNotice}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Close
            </button>
          </DialogClose>
          <Link
            href="/contact"
            onClick={closeDemoNotice}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Mail className="h-4 w-4" />
            Contact admin
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}