import type { AppearanceMode } from "@/lib/timeTheme";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

type ThemeStore = {
  appearanceMode: AppearanceMode;
  setAppearanceMode: (appearanceMode: AppearanceMode) => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      appearanceMode: "auto",
      setAppearanceMode: (appearanceMode) => set({ appearanceMode }),
    }),
    {
      name: "portfolio-os-appearance",
      partialize: (state) => ({ appearanceMode: state.appearanceMode }),
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
    },
  ),
);
