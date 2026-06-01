import { folders } from "@/data/folders";
import type {
  FolderId,
  WindowId,
  WindowSize,
  WindowSizePreset,
} from "@/types/portfolio";
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
  isMinimized: boolean;
  isMaximized: boolean;
  isFilled: boolean;
  position: WindowPosition;
  size: WindowSize;
  restorePosition: WindowPosition | null;
  restoreSize: WindowSize | null;
  fillRestorePosition: WindowPosition | null;
  fillRestoreSize: WindowSize | null;
  zIndex: number;
};

export type DesktopStore = {
  hasUnlocked: boolean;
  activeWindowId: WindowId | null;
  windows: DesktopWindow[];
  unlock: () => void;
  lock: () => void;
  openWindow: (id: WindowId, title?: string) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, position: WindowPosition) => void;
  toggleMinimize: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  toggleFill: (id: WindowId) => void;
  resizeWindow: (id: WindowId, size: WindowSize) => void;
  resizeWindowFrame: (id: WindowId, position: WindowPosition, size: WindowSize) => void;
};

const BASE_Z_INDEX = 100;
const WINDOW_STAGGER = 28;
const DESKTOP_EDGE_INSET = 16;
const MENU_BAR_HEIGHT = 32;
const DOCK_RESERVED_HEIGHT = 112;
const MIN_WINDOW_SIZE: WindowSize = {
  width: 360,
  height: 280,
};
const DEFAULT_WINDOW_POSITION: WindowPosition = {
  x: 96,
  y: 72,
};
const DEFAULT_WINDOW_SIZE: WindowSizePreset = {
  widthRatio: 0.58,
  heightRatio: 0.68,
  minWidth: 620,
  minHeight: 480,
  maxWidth: 760,
  maxHeight: 560,
};
const DEFAULT_PROJECT_WINDOW_SIZE: WindowSizePreset = {
  widthRatio: 0.68,
  heightRatio: 0.72,
  minWidth: 720,
  minHeight: 520,
  maxWidth: 900,
  maxHeight: 640,
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

function clampNumber(value: number, min: number, max: number) {
  const roundedMax = Math.round(max);
  const roundedMin = Math.min(Math.round(min), roundedMax);

  return Math.min(roundedMax, Math.max(roundedMin, Math.round(value)));
}

function resolveWindowSizePreset(
  preset: WindowSizePreset,
  position: WindowPosition,
): WindowSize {
  const viewport = getViewportSize();
  const maxWidth = Math.max(
    MIN_WINDOW_SIZE.width,
    viewport.width - position.x - DESKTOP_EDGE_INSET,
  );
  const maxHeight = Math.max(
    MIN_WINDOW_SIZE.height,
    viewport.height - position.y - DOCK_RESERVED_HEIGHT,
  );

  return {
    width: clampNumber(
      viewport.width * preset.widthRatio,
      Math.max(MIN_WINDOW_SIZE.width, preset.minWidth),
      Math.min(maxWidth, preset.maxWidth),
    ),
    height: clampNumber(
      viewport.height * preset.heightRatio,
      Math.max(MIN_WINDOW_SIZE.height, preset.minHeight),
      Math.min(maxHeight, preset.maxHeight),
    ),
  };
}

function getDefaultWindowSize(
  id: WindowId,
  position: WindowPosition,
): WindowSize {
  if (isFolderId(id)) {
    return resolveWindowSizePreset(
      folderById.get(id)?.defaultWindowSize ?? DEFAULT_WINDOW_SIZE,
      position,
    );
  }

  return resolveWindowSizePreset(DEFAULT_PROJECT_WINDOW_SIZE, position);
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
  return windows
    .filter((window) => !window.isMinimized)
    .reduce<DesktopWindow | null>((topWindow, window) => {
      if (!topWindow || window.zIndex > topWindow.zIndex) {
        return window;
      }

      return topWindow;
    }, null);
}

function getViewportSize(): WindowSize {
  if (typeof window === "undefined") {
    return {
      width: 1280,
      height: 800,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getMaximizedWindowBounds() {
  const viewport = getViewportSize();
  const width = Math.max(
    MIN_WINDOW_SIZE.width,
    viewport.width,
  );
  const height = Math.max(
    MIN_WINDOW_SIZE.height,
    viewport.height,
  );

  return {
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  };
}

function getFilledWindowBounds() {
  const viewport = getViewportSize();
  const width = Math.max(
    MIN_WINDOW_SIZE.width,
    viewport.width - DESKTOP_EDGE_INSET * 2,
  );
  const height = Math.max(
    MIN_WINDOW_SIZE.height,
    viewport.height - MENU_BAR_HEIGHT - DOCK_RESERVED_HEIGHT - DESKTOP_EDGE_INSET * 2,
  );

  return {
    position: {
      x: DESKTOP_EDGE_INSET,
      y: MENU_BAR_HEIGHT + DESKTOP_EDGE_INSET,
    },
    size: {
      width,
      height,
    },
  };
}

function clampWindowSize(position: WindowPosition, size: WindowSize): WindowSize {
  const viewport = getViewportSize();
  const maxWidth = Math.max(
    MIN_WINDOW_SIZE.width,
    viewport.width - position.x - DESKTOP_EDGE_INSET,
  );
  const maxHeight = Math.max(
    MIN_WINDOW_SIZE.height,
    viewport.height - position.y - DESKTOP_EDGE_INSET,
  );

  return {
    width: Math.min(maxWidth, Math.max(MIN_WINDOW_SIZE.width, Math.round(size.width))),
    height: Math.min(
      maxHeight,
      Math.max(MIN_WINDOW_SIZE.height, Math.round(size.height)),
    ),
  };
}

function clampWindowFrame(
  position: WindowPosition,
  size: WindowSize,
): { position: WindowPosition; size: WindowSize } {
  const viewport = getViewportSize();
  const x = clampNumber(
    position.x,
    0,
    Math.max(0, viewport.width - MIN_WINDOW_SIZE.width),
  );
  const y = clampNumber(
    position.y,
    0,
    Math.max(0, viewport.height - MIN_WINDOW_SIZE.height),
  );
  const clampedPosition = { x, y };

  return {
    position: clampedPosition,
    size: clampWindowSize(clampedPosition, size),
  };
}

function getManuallyResizedWindow(
  window: DesktopWindow,
  position: WindowPosition,
  size: WindowSize,
): DesktopWindow {
  const frame = clampWindowFrame(position, size);

  return {
    ...window,
    isMaximized: false,
    isFilled: false,
    position: frame.position,
    size: frame.size,
    restorePosition: null,
    restoreSize: null,
    fillRestorePosition: null,
    fillRestoreSize: null,
  };
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  hasUnlocked: false,
  activeWindowId: null,
  windows: [],

  unlock: () => {
    set({ hasUnlocked: true });
  },

  lock: () => {
    set({ hasUnlocked: false });
  },

  openWindow: (id, title) => {
    set((state) => {
      const zIndex = getNextZIndex(state.windows);
      const existingWindow = state.windows.find((window) => window.id === id);
      const position = getDefaultWindowPosition(state.windows.length);

      if (existingWindow) {
        return {
          activeWindowId: id,
          windows: state.windows.map((window) =>
            window.id === id
              ? {
                ...window,
                title: title ?? window.title,
                isMinimized: false,
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
            isMinimized: false,
            isMaximized: false,
            isFilled: false,
            title: getDefaultWindowTitle(id, title),
            type: getWindowType(id),
            position,
            size: getDefaultWindowSize(id, position),
            restorePosition: null,
            restoreSize: null,
            fillRestorePosition: null,
            fillRestoreSize: null,
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

      if (existingWindow.isMinimized) {
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
              isFilled: false,
              fillRestorePosition: null,
              fillRestoreSize: null,
            }
          : window,
      ),
    }));
  },

  toggleMinimize: (id) => {
    set((state) => {
      const existingWindow = state.windows.find((window) => window.id === id);

      if (!existingWindow) {
        return {};
      }

      const zIndex = getNextZIndex(state.windows);
      const isRestoring = existingWindow.isMinimized;
      const windows = state.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              isMinimized: !window.isMinimized,
              zIndex: isRestoring ? zIndex : window.zIndex,
            }
          : window,
      );

      return {
        activeWindowId: isRestoring
          ? id
          : state.activeWindowId === id
            ? getTopWindow(windows)?.id ?? null
            : state.activeWindowId,
        windows,
      };
    });
  },

  restoreWindow: (id) => {
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
                isMinimized: false,
                zIndex,
              }
            : window,
        ),
      };
    });
  },

  toggleFill: (id) => {
    set((state) => {
      const existingWindow = state.windows.find((window) => window.id === id);

      if (!existingWindow || existingWindow.isMaximized) {
        return {};
      }

      const zIndex = getNextZIndex(state.windows);

      if (existingWindow.isFilled) {
        return {
          activeWindowId: id,
          windows: state.windows.map((window) =>
            window.id === id
              ? {
                  ...window,
                  isFilled: false,
                  isMinimized: false,
                  position: window.fillRestorePosition ?? window.position,
                  size: window.fillRestoreSize ?? window.size,
                  fillRestorePosition: null,
                  fillRestoreSize: null,
                  zIndex,
                }
              : window,
          ),
        };
      }

      const filledBounds = getFilledWindowBounds();

      return {
        activeWindowId: id,
        windows: state.windows.map((window) =>
          window.id === id
            ? {
                ...window,
                isFilled: true,
                isMinimized: false,
                position: filledBounds.position,
                size: filledBounds.size,
                fillRestorePosition: window.position,
                fillRestoreSize: window.size,
                zIndex,
              }
            : window,
        ),
      };
    });
  },

  toggleMaximize: (id) => {
    set((state) => {
      const existingWindow = state.windows.find((window) => window.id === id);

      if (!existingWindow) {
        return {};
      }

      const zIndex = getNextZIndex(state.windows);

      if (existingWindow.isMaximized) {
        return {
          activeWindowId: id,
          windows: state.windows.map((window) =>
            window.id === id
              ? {
                  ...window,
                  isMaximized: false,
                  isFilled: false,
                  isMinimized: false,
                  position: window.restorePosition ?? window.position,
                  size: window.restoreSize ?? window.size,
                  restorePosition: null,
                  restoreSize: null,
                  fillRestorePosition: null,
                  fillRestoreSize: null,
                  zIndex,
                }
              : window,
          ),
        };
      }

      const maximizedBounds = getMaximizedWindowBounds();

      return {
        activeWindowId: id,
        windows: state.windows.map((window) =>
          window.id === id
            ? {
                ...window,
                isMaximized: true,
                isFilled: false,
                isMinimized: false,
                position: maximizedBounds.position,
                size: maximizedBounds.size,
                restorePosition: window.position,
                restoreSize: window.size,
                fillRestorePosition: null,
                fillRestoreSize: null,
                zIndex,
              }
            : window,
        ),
      };
    });
  },

  resizeWindow: (id, size) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id
          ? getManuallyResizedWindow(window, window.position, size)
          : window,
      ),
    }));
  },

  resizeWindowFrame: (id, position, size) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id
          ? getManuallyResizedWindow(window, position, size)
          : window,
      ),
    }));
  },
}));
