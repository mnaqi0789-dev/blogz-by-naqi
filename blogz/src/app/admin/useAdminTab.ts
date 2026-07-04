"use client";

import { useState } from "react";

export type AdminTab = "create" | "manage";

const STORAGE_KEY = "blogz-admin-tab";

function readStoredTab(): AdminTab {
  if (typeof window === "undefined") return "create";
  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  return stored === "create" || stored === "manage" ? stored : "create";
}

export function useAdminTab() {
  const [tab, setTabState] = useState<AdminTab>(readStoredTab);

  const setTab = (next: AdminTab) => {
    setTabState(next);
    window.sessionStorage.setItem(STORAGE_KEY, next);
  };

  return { tab, setTab };
}