import { create } from "zustand";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  currentUser: AuthUser | null;
  setUser: (user: AuthUser | null) => void;

  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;

  demoNoticeOpen: boolean;
  demoNoticeAction: string;
  openDemoNotice: (action: string) => void;
  closeDemoNotice: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  setUser: (user) => set({ currentUser: user }),
  isDemoMode: false,
  enterDemoMode: () => set({ isDemoMode: true }),
  exitDemoMode: () => set({ isDemoMode: false, demoNoticeOpen: false }),
  demoNoticeOpen: false,
  demoNoticeAction: "",
  openDemoNotice: (action) =>
    set({ demoNoticeOpen: true, demoNoticeAction: action }),
  closeDemoNotice: () => set({ demoNoticeOpen: false }),
}));
