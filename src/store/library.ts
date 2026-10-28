/**
 * Everything the reader has marked for themselves: highlights, bookmarks,
 * which verses they have opened, and where they last left off.
 *
 * Keyed by ref ("2.47") so it never drifts from the corpus.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { HighlightColorId } from '@/constants/reading-themes';

export type Highlight = {
  ref: string;
  color: HighlightColorId;
  createdAt: number;
};

export type LastRead = {
  ref: string;
  chapter: number;
  verse: number;
  at: number;
};

type LibraryState = {
  highlights: Record<string, Highlight>;
  bookmarks: Record<string, number>;
  read: Record<string, number>;
  lastRead: LastRead | null;
  hydrated: boolean;

  setHighlight: (ref: string, color: HighlightColorId) => void;
  clearHighlight: (ref: string) => void;
  toggleBookmark: (ref: string) => void;
  markRead: (ref: string) => void;
  setLastRead: (chapter: number, verse: number) => void;
  reset: () => void;
  setHydrated: (value: boolean) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set) => ({
      highlights: {},
      bookmarks: {},
      read: {},
      lastRead: null,
      hydrated: false,

      setHighlight: (ref, color) =>
        set((state) => ({
          highlights: { ...state.highlights, [ref]: { ref, color, createdAt: Date.now() } },
        })),

      clearHighlight: (ref) =>
        set((state) => {
          const next = { ...state.highlights };
          delete next[ref];
          return { highlights: next };
        }),

      toggleBookmark: (ref) =>
        set((state) => {
          const next = { ...state.bookmarks };
          if (next[ref]) delete next[ref];
          else next[ref] = Date.now();
          return { bookmarks: next };
        }),

      markRead: (ref) =>
        set((state) => (state.read[ref] ? state : { read: { ...state.read, [ref]: Date.now() } })),

      setLastRead: (chapter, verse) =>
        set({
          lastRead: { chapter, verse, ref: `${chapter}.${verse}`, at: Date.now() },
        }),

      reset: () => set({ highlights: {}, bookmarks: {}, read: {}, lastRead: null }),

      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'gita-library',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: ({ hydrated: _hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);

// ---------------------------------------------------------------------------
// Selectors — plain functions so they can be used outside React too.
// ---------------------------------------------------------------------------

function countRefsWithPrefix(refs: string[], chapter: number): number {
  const prefix = `${chapter}.`;
  let count = 0;
  for (const ref of refs) if (ref.startsWith(prefix)) count += 1;
  return count;
}

export function selectChapterReadCount(state: LibraryState, chapter: number): number {
  return countRefsWithPrefix(Object.keys(state.read), chapter);
}

export function selectChapterHighlightCount(state: LibraryState, chapter: number): number {
  return countRefsWithPrefix(Object.keys(state.highlights), chapter);
}

export function selectTotalHighlights(state: LibraryState): number {
  return Object.keys(state.highlights).length;
}

export function selectTotalBookmarks(state: LibraryState): number {
  return Object.keys(state.bookmarks).length;
}
