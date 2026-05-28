import { folders } from "@/data/folders";
import type { FolderId, WindowId, WindowSize } from "@/types/portfolio";
import { create } from "zustand";

export type WindowPosition = {
  x: number;
  y: number;
};

export type DesktopWindow = {
  id: WindowId;
  title: string;
  type: "folder" | "project" | "resume" | "contact";
  isOpen: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
};

export type DesktopStore = {
  hasUnlocked: boolean;
  activeWindowId: WindowId | null;
  windows: DesktopWindow[];
  unlock: () => void;
  openWindow: (id: WindowId, title?: string) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, position: WindowPosition) => void;
};

const BASE_Z_INDEX = 100;
const WINDOW_STAGGER = 28;
const DEFAULT_WINDOW_POSITION: WindowPosition = {
  x: 96,
  y: 72,
};
const DEFAULT_WINDOW_SIZE: WindowSize = {
  width: 760,
  height: 560,
};
const DEFAULT_PROJECT_WINDOW_SIZE: WindowSize = {
  width: 900,
  height: 640,
};

const folderById = new Map<FolderId, (typeof folders)[number]>(
  folders.map((folder) => [folder.id, folder]),
);

function isFolderId(id: WindowId): id is FolderId {
  return folderById.has(id as FolderId);
}

function getNextZIndex(windows: DesktopWindow[]) {
  return Math.max(BASE_Z_INDEX, ...windows.map((window) => window.zIndex)) + 1;
}

function getDefaultWindowTitle(id: WindowId, title?: string) {
  if (title) {
    return title;
  }

  if (isFolderId(id)) {
    return folderById.get(id)?.title ?? id;
  }

  return "Project Detail";
}

function getDefaultWindowSize(id: WindowId): WindowSize {
  if (isFolderId(id)) {
    return folderById.get(id)?.defaultWindowSize ?? DEFAULT_WINDOW_SIZE;
  }

  return DEFAULT_PROJECT_WINDOW_SIZE;
}

function getWindowType(id: WindowId): DesktopWindow["type"] {
  if (id === "resume") {
    return "resume";
  }

  if (id === "contact") {
    return "contact";
  }

  if (id.startsWith("project-")) {
    return "project";
  }

  return "folder";
}

function getDefaultWindowPosition(windowCount: number): WindowPosition {
  const offset = (windowCount % 6) * WINDOW_STAGGER;

  return {
    x: DEFAULT_WINDOW_POSITION.x + offset,
    y: DEFAULT_WINDOW_POSITION.y + offset,
  };
}

function getTopWindow(windows: DesktopWindow[]) {
  return windows.reduce<DesktopWindow | null>((topWindow, window) => {
    if (!topWindow || window.zIndex > topWindow.zIndex) {
      return window;
    }

    return topWindow;
  }, null);
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  hasUnlocked: false,
  activeWindowId: null,
  windows: [],

  unlock: () => {
    set({ hasUnlocked: true });
  },

  openWindow: (id, title) => {
    set((state) => {
      const zIndex = getNextZIndex(state.windows);
      const existingWindow = state.windows.find((window) => window.id === id);

      if (existingWindow) {
        return {
          activeWindowId: id,
          windows: state.windows.map((window) =>
            window.id === id
              ? {
                  ...window,
                  title: title ?? window.title,
                  zIndex,
                }
              : window,
          ),
        };
      }

      return {
        activeWindowId: id,
        windows: [
          ...state.windows,
          {
            id,
            isOpen: true,
            title: getDefaultWindowTitle(id, title),
            type: getWindowType(id),
            position: getDefaultWindowPosition(state.windows.length),
            size: getDefaultWindowSize(id),
            zIndex,
          },
        ],
      };
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const windows = state.windows.filter((window) => window.id !== id);

      if (state.activeWindowId !== id) {
        return { windows };
      }

      return {
        activeWindowId: getTopWindow(windows)?.id ?? null,
        windows,
      };
    });
  },

  focusWindow: (id) => {
    set((state) => {
      const existingWindow = state.windows.find((window) => window.id === id);

      if (!existingWindow) {
        return {};
      }

      const zIndex = getNextZIndex(state.windows);

      return {
        activeWindowId: id,
        windows: state.windows.map((window) =>
          window.id === id
            ? {
                ...window,
                zIndex,
              }
            : window,
        ),
      };
    });
  },

  moveWindow: (id, position) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              position,
            }
          : window,
      ),
    }));
  },
}));
