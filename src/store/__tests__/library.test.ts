/**
 * Library store: everything the reader marks for themselves.
 *
 * The store is persisted, so these tests also pin what lands in storage — a
 * careless `partialize` change would silently resurrect stale state on launch.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  selectChapterHighlightCount,
  selectChapterReadCount,
  selectTotalBookmarks,
  selectTotalHighlights,
  useLibrary,
} from '@/store/library';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(async () => {
  useLibrary.setState({
    highlights: {},
    bookmarks: {},
    read: {},
    lastRead: null,
    hydrated: false,
  });
  await AsyncStorage.clear();
});

describe('highlights', () => {
  it('stores a colour and a timestamp per ref', () => {
    useLibrary.getState().setHighlight('2.47', 'amber');

    const highlight = useLibrary.getState().highlights['2.47'];
    expect(highlight).toBeDefined();
    expect(highlight.color).toBe('amber');
    expect(highlight.ref).toBe('2.47');
    expect(typeof highlight.createdAt).toBe('number');
    expect(highlight.createdAt).toBeGreaterThan(0);
  });

  it('replaces the colour instead of duplicating the verse', () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(1_000);
    useLibrary.getState().setHighlight('2.47', 'amber');
    now.mockReturnValue(2_000);
    useLibrary.getState().setHighlight('2.47', 'rose');

    const highlights = useLibrary.getState().highlights;
    expect(Object.keys(highlights)).toEqual(['2.47']);
    expect(highlights['2.47'].color).toBe('rose');
    expect(highlights['2.47'].createdAt).toBe(2_000);
    now.mockRestore();
  });

  it('removes a highlight and ignores unknown refs', () => {
    useLibrary.getState().setHighlight('2.47', 'sky');
    useLibrary.getState().clearHighlight('2.47');
    expect(useLibrary.getState().highlights['2.47']).toBeUndefined();

    expect(() => useLibrary.getState().clearHighlight('9.99')).not.toThrow();
    expect(useLibrary.getState().highlights).toEqual({});
  });
});

describe('bookmarks', () => {
  it('toggles on and off', () => {
    useLibrary.getState().toggleBookmark('12.13');
    expect(useLibrary.getState().bookmarks['12.13']).toBeGreaterThan(0);

    useLibrary.getState().toggleBookmark('12.13');
    expect(useLibrary.getState().bookmarks['12.13']).toBeUndefined();
  });

  it('keeps bookmarks independent of highlights', () => {
    useLibrary.getState().toggleBookmark('12.13');
    useLibrary.getState().setHighlight('12.13', 'sage');
    useLibrary.getState().clearHighlight('12.13');

    expect(useLibrary.getState().bookmarks['12.13']).toBeGreaterThan(0);
  });
});

describe('read tracking', () => {
  it('records a verse once, even when it is viewed repeatedly', () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(5_000);
    useLibrary.getState().markRead('1.1');
    now.mockReturnValue(9_000);
    useLibrary.getState().markRead('1.1');

    expect(Object.keys(useLibrary.getState().read)).toEqual(['1.1']);
    // The first timestamp is kept: re-reading must not reorder history.
    expect(useLibrary.getState().read['1.1']).toBe(5_000);
    now.mockRestore();
  });

  it('remembers the last read position as chapter, verse and ref', () => {
    useLibrary.getState().setLastRead(3, 35);

    expect(useLibrary.getState().lastRead).toMatchObject({
      chapter: 3,
      verse: 35,
      ref: '3.35',
    });
  });
});

describe('reset', () => {
  it('clears highlights, bookmarks, progress and the last position', () => {
    useLibrary.getState().setHighlight('2.47', 'amber');
    useLibrary.getState().toggleBookmark('2.47');
    useLibrary.getState().markRead('2.47');
    useLibrary.getState().setLastRead(2, 47);

    useLibrary.getState().reset();

    const state = useLibrary.getState();
    expect(state.highlights).toEqual({});
    expect(state.bookmarks).toEqual({});
    expect(state.read).toEqual({});
    expect(state.lastRead).toBeNull();
  });
});

describe('selectors', () => {
  beforeEach(() => {
    useLibrary.setState({
      read: { '1.1': 1, '1.2': 1, '2.47': 1, '11.1': 1 },
      highlights: { '1.1': { ref: '1.1', color: 'amber', createdAt: 1 }, '3.3': { ref: '3.3', color: 'rose', createdAt: 2 } },
      bookmarks: { '1.1': 1, '18.66': 1 },
    });
  });

  it('counts per chapter without mixing up 1, 11 and 18', () => {
    const state = useLibrary.getState();
    expect(selectChapterReadCount(state, 1)).toBe(2);
    expect(selectChapterReadCount(state, 11)).toBe(1);
    expect(selectChapterReadCount(state, 2)).toBe(1);
    expect(selectChapterReadCount(state, 18)).toBe(0);
  });

  it('counts highlights per chapter and in total', () => {
    const state = useLibrary.getState();
    expect(selectChapterHighlightCount(state, 1)).toBe(1);
    expect(selectChapterHighlightCount(state, 3)).toBe(1);
    expect(selectChapterHighlightCount(state, 2)).toBe(0);
    expect(selectTotalHighlights(state)).toBe(2);
  });

  it('counts bookmarks in total', () => {
    expect(selectTotalBookmarks(useLibrary.getState())).toBe(2);
  });
});

describe('persistence', () => {
  it('writes to the gita-library key and never persists the hydration flag', async () => {
    useLibrary.getState().setHighlight('2.47', 'amber');
    await flush();

    const raw = await AsyncStorage.getItem('gita-library');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.state.highlights['2.47'].color).toBe('amber');
    expect(parsed.state).not.toHaveProperty('hydrated');
  });
});
