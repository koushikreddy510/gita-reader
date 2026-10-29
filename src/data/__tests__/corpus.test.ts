/**
 * Invariants for the bundled text and the query layer.
 *
 * These are the tests that should fail loudly if someone "tidies" the corpus,
 * changes the fallback rules, or loosens the search folding.
 */

import {
  CHAPTERS,
  TOTAL_VERSES,
  VERSES,
  getChapter,
  getLoadedCount,
  getVerse,
  getVerseOfTheDay,
  getVersesForChapter,
  resolveTranslation,
  searchVerses,
} from '@/data';
import { SEED_VERSES, type Verse } from '@/data/corpus';
import { getTranslation, type TranslationId } from '@/constants/settings-options';

/** The canonical 700-verse recension, hard-coded here on purpose. */
const CANONICAL_COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78];

const DEVANAGARI = /[\u0900-\u097F]/;

function makeVerse(overrides: Partial<Verse> = {}): Verse {
  return {
    ref: '9.9',
    chapter: 9,
    verse: 9,
    devanagari: 'क',
    iast: 'ka',
    translations: { editorial: 'plain english', telang: 'telang english' },
    ...overrides,
  };
}

describe('chapter metadata', () => {
  it('describes exactly 18 chapters, numbered 1..18 in order', () => {
    expect(CHAPTERS).toHaveLength(18);
    expect(CHAPTERS.map((chapter) => chapter.number)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 1)
    );
  });

  it('uses the canonical verse counts and totals 700', () => {
    expect(CHAPTERS.map((chapter) => chapter.verseCount)).toEqual(CANONICAL_COUNTS);
    expect(CHAPTERS.reduce((sum, chapter) => sum + chapter.verseCount, 0)).toBe(700);
    expect(TOTAL_VERSES).toBe(700);
  });

  it('gives every chapter a name, a summary and at least one theme', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.transliteration.trim()).not.toBe('');
      expect(chapter.english.trim()).not.toBe('');
      expect(chapter.summary.trim().length).toBeGreaterThan(20);
      expect(chapter.themes.length).toBeGreaterThan(0);
    }
  });

  it('returns undefined outside 1..18 instead of throwing', () => {
    for (const value of [0, -1, 19, 99, Number.NaN]) {
      expect(getChapter(value)).toBeUndefined();
    }
  });
});

describe('bundled verses', () => {
  it('has at least one verse, with unique refs that match chapter and verse', () => {
    expect(VERSES.length).toBeGreaterThan(0);

    const refs = new Set<string>();
    for (const verse of VERSES) {
      expect(verse.ref).toBe(`${verse.chapter}.${verse.verse}`);
      expect(refs.has(verse.ref)).toBe(false);
      refs.add(verse.ref);
    }
  });

  it('keeps every verse inside its chapter, as declared by the metadata', () => {
    for (const verse of VERSES) {
      const chapter = getChapter(verse.chapter);
      expect(chapter).toBeDefined();
      expect(verse.verse).toBeGreaterThanOrEqual(1);
      expect(verse.verse).toBeLessThanOrEqual(chapter!.verseCount);
    }
  });

  it('ships Devanagari and IAST in the right scripts', () => {
    for (const verse of VERSES) {
      expect(verse.devanagari.trim()).not.toBe('');
      expect(DEVANAGARI.test(verse.devanagari)).toBe(true);
      // A Latin letter inside the Sanskrit line means a corrupt import.
      expect(/[A-Za-z]/.test(verse.devanagari.replace(/[\u0900-\u097F\s।॥|’'".,;:!?0-9—-]/g, ''))).toBe(
        false
      );
      expect(verse.iast.trim()).not.toBe('');
      expect(DEVANAGARI.test(verse.iast)).toBe(false);
    }
  });

  it('keeps the seed usable as a translation fallback', () => {
    // The seed is what the reader shows when nothing was imported; if its
    // editorial column disappears, every seed verse renders Sanskrit only.
    expect(SEED_VERSES.length).toBeGreaterThan(0);
    for (const verse of SEED_VERSES) {
      expect((verse.translations.editorial ?? '').trim()).not.toBe('');
    }
  });

  it('reports the loaded count per chapter consistently with the corpus', () => {
    const expected = VERSES.reduce<Record<number, number>>((acc, verse) => {
      acc[verse.chapter] = (acc[verse.chapter] ?? 0) + 1;
      return acc;
    }, {});

    for (const chapter of CHAPTERS) {
      expect(getLoadedCount(chapter.number)).toBe(expected[chapter.number] ?? 0);
      expect(getLoadedCount(chapter.number)).toBeLessThanOrEqual(chapter.verseCount);
    }
    expect(getLoadedCount(99)).toBe(0);
  });
});

describe('verse queries', () => {
  it('looks a verse up by ref and misses safely', () => {
    const bundled = VERSES[0];
    expect(getVerse(bundled.ref)).toBe(bundled);
    expect(getVerse('99.1')).toBeUndefined();
    expect(getVerse('')).toBeUndefined();
  });

  it('returns a chapter’s verses sorted by verse number', () => {
    for (const chapter of CHAPTERS) {
      const verses = getVersesForChapter(chapter.number);
      const numbers = verses.map((verse) => verse.verse);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      expect(new Set(numbers).size).toBe(numbers.length);
    }
  });

  it('returns an empty list for a chapter with nothing bundled', () => {
    expect(getVersesForChapter(0)).toEqual([]);
    expect(getVersesForChapter(99)).toEqual([]);
  });
});

describe('resolveTranslation', () => {
  it('returns null when translations are switched off', () => {
    expect(resolveTranslation(makeVerse(), 'none')).toBeNull();
  });

  it('returns the requested edition without a fallback flag', () => {
    const resolved = resolveTranslation(makeVerse(), 'telang')!;
    expect(resolved.text).toBe('telang english');
    expect(resolved.label).toBe(getTranslation('telang').name);
    expect(resolved.isFallback).toBe(false);
  });

  it('falls back to the editorial column and says so', () => {
    const resolved = resolveTranslation(makeVerse(), 'arnold')!;
    expect(resolved.text).toBe('plain english');
    expect(resolved.label).toBe(getTranslation('editorial').name);
    expect(resolved.isFallback).toBe(true);
  });

  it('returns null when neither the requested nor the editorial column exists', () => {
    expect(resolveTranslation(makeVerse({ translations: { arnold: 'arnold only' } }), 'telang')).toBeNull();
    expect(resolveTranslation(makeVerse({ translations: {} }), 'editorial')).toBeNull();
  });

  it('never confuses a missing edition with the editorial one', () => {
    // Requesting 'editorial' must never be reported as a fallback.
    const resolved = resolveTranslation(makeVerse(), 'editorial')!;
    expect(resolved.isFallback).toBe(false);
  });

  it('resolves every bundled verse to something printable', () => {
    for (const verse of VERSES) {
      const resolved = resolveTranslation(verse, 'editorial');
      expect(resolved).not.toBeNull();
      expect(resolved!.text.trim()).not.toBe('');
    }
  });
});

describe('searchVerses', () => {
  it('ignores queries shorter than two characters', () => {
    expect(searchVerses('')).toEqual([]);
    expect(searchVerses('a')).toEqual([]);
    expect(searchVerses('   ')).toEqual([]);
  });

  it('returns nothing for a query that cannot match', () => {
    expect(searchVerses('zzzzqqqq')).toEqual([]);
  });

  it('finds a verse by a word from its English translation, case-insensitively', () => {
    const sample = SEED_VERSES.map((verse) => ({
      verse,
      text: verse.translations.editorial ?? '',
    })).find(({ text }) => /[A-Za-z]{6,}/.test(text))!;

    const word = sample.text.match(/[A-Za-z]{6,}/)![0];
    const lower = searchVerses(word.toLowerCase()).map((hit) => hit.verse.ref);
    const upper = searchVerses(word.toUpperCase()).map((hit) => hit.verse.ref);

    expect(lower).toContain(sample.verse.ref);
    expect(upper).toEqual(lower);
  });

  it('matches IAST regardless of diacritics', () => {
    const sample = SEED_VERSES.find((verse) => /[āīūṛṇṣṭḥṃ]/.test(verse.iast))!;
    expect(sample).toBeDefined();

    const word = sample.iast.match(/[A-Za-zāīūṛṇṣṭḥṃ]{5,}/)![0];
    const folded = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const refs = searchVerses(folded).map((hit) => hit.verse.ref);
    expect(refs).toContain(sample.ref);
  });

  it('matches Devanagari and tags the hit as Sanskrit', () => {
    const sample = SEED_VERSES.find((verse) => verse.devanagari.replace(/\n/g, '').length > 8)!;
    const needle = sample.devanagari.replace(/\n/g, '').slice(0, 4);

    const hits = searchVerses(needle);
    const hit = hits.find((candidate) => candidate.verse.ref === sample.ref);

    expect(hit).toBeDefined();
    expect(hit!.matchedField).toBe('sanskrit');
  });

  it('respects the result limit', () => {
    const unlimit = searchVerses('th', 500);
    if (unlimit.length > 3) {
      expect(searchVerses('th', 3)).toHaveLength(3);
    }
    expect(searchVerses('th', 1).length).toBeLessThanOrEqual(1);
  });
});

describe('getVerseOfTheDay', () => {
  it('is stable within one calendar day', () => {
    const morning = new Date(2026, 0, 15, 6, 30);
    const evening = new Date(2026, 0, 15, 23, 59);
    expect(getVerseOfTheDay(morning).ref).toBe(getVerseOfTheDay(evening).ref);
  });

  it('changes at local midnight', () => {
    const today = getVerseOfTheDay(new Date(2026, 0, 15, 23, 59));
    const tomorrow = getVerseOfTheDay(new Date(2026, 0, 16, 0, 1));

    expect(tomorrow.ref).not.toBe(today.ref);
  });

  it('always returns a verse from the corpus', () => {
    for (let day = 0; day < 40; day += 1) {
      const verse: Verse = getVerseOfTheDay(new Date(2026, 0, 1 + day));
      expect(VERSES).toContain(verse);
    }
  });
});

describe('translation catalogue', () => {
  it('keeps every selectable id resolvable', () => {
    const ids: TranslationId[] = ['editorial', 'arnold', 'telang', 'wilkins', 'none'];
    for (const id of ids) {
      expect(getTranslation(id).id).toBe(id);
    }
  });

  it('falls back to the default entry for an unknown id', () => {
    expect(getTranslation('klingon').id).toBe('editorial');
    expect(getTranslation(undefined).id).toBe('editorial');
  });
});
