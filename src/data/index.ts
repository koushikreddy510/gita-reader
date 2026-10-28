/**
 * Read-only query layer over the corpus. Everything here is synchronous and
 * in-memory — the whole Gita is a few hundred kilobytes, so there is no reason
 * to make the reader wait on a database on first launch.
 */

import { CHAPTERS, TOTAL_VERSES, getChapter } from '@/constants/chapters';
import { getTranslation, type TranslationId } from '@/constants/settings-options';

import { VERSES, type Verse } from './corpus';

export { VERSES, TOTAL_VERSES, CHAPTERS, getChapter };
export type { Verse };

const BY_REF = new Map<string, Verse>(VERSES.map((verse) => [verse.ref, verse]));

const BY_CHAPTER = VERSES.reduce<Record<number, Verse[]>>((acc, verse) => {
  (acc[verse.chapter] ??= []).push(verse);
  return acc;
}, {});

for (const list of Object.values(BY_CHAPTER)) {
  list.sort((a, b) => a.verse - b.verse);
}

export function getVerse(ref: string): Verse | undefined {
  return BY_REF.get(ref);
}

export function getVersesForChapter(chapter: number): Verse[] {
  return BY_CHAPTER[chapter] ?? [];
}

/** How many verses of this chapter the bundled corpus actually contains. */
export function getLoadedCount(chapter: number): number {
  return BY_CHAPTER[chapter]?.length ?? 0;
}

export function getAllLoadedRefs(): string[] {
  return VERSES.map((verse) => verse.ref);
}

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

export type ResolvedTranslation = {
  text: string;
  /** Name of the translation actually shown. */
  label: string;
  /** True when the requested edition has no text for this verse yet. */
  isFallback: boolean;
};

export function resolveTranslation(
  verse: Verse,
  translationId: TranslationId
): ResolvedTranslation | null {
  if (translationId === 'none') return null;

  const direct = verse.translations[translationId];
  if (direct) {
    return { text: direct, label: getTranslation(translationId).name, isFallback: false };
  }

  // The corpus is only partially populated, so fall back rather than showing a
  // blank verse. The UI tags the result so this is never silently misleading.
  const fallback = verse.translations.editorial;
  if (!fallback) return null;

  return { text: fallback, label: getTranslation('editorial').name, isFallback: true };
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

const COMBINING_MARKS = /[\u0300-\u036f]/g;

/** "karmaṇy" → "karmany". Latin only: Devanagari vowel signs are marks too. */
function foldLatin(input: string): string {
  return input.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();
}

const SEARCH_INDEX = VERSES.map((verse) => ({
  verse,
  devanagari: verse.devanagari,
  latin: foldLatin([verse.iast, ...Object.values(verse.translations)].join(' ')),
}));

export type SearchHit = { verse: Verse; matchedField: 'sanskrit' | 'translation' };

export function searchVerses(query: string, limit = 60): SearchHit[] {
  const raw = query.trim();
  if (raw.length < 2) return [];

  const isDevanagari = /[\u0900-\u097F]/.test(raw);
  const needle = isDevanagari ? raw : foldLatin(raw);

  const hits: SearchHit[] = [];
  for (const entry of SEARCH_INDEX) {
    if (isDevanagari) {
      if (entry.devanagari.includes(needle)) {
        hits.push({ verse: entry.verse, matchedField: 'sanskrit' });
      }
    } else if (entry.latin.includes(needle)) {
      hits.push({ verse: entry.verse, matchedField: 'translation' });
    }
    if (hits.length >= limit) break;
  }
  return hits;
}

// ---------------------------------------------------------------------------
// Daily verse
// ---------------------------------------------------------------------------

const MS_PER_DAY = 86_400_000;

/**
 * Deterministic across devices and app launches: the same calendar day yields
 * the same verse for everyone, and it changes at local midnight.
 */
export function getVerseOfTheDay(now: Date = new Date()): Verse {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayIndex = Math.floor(startOfDay / MS_PER_DAY);
  return VERSES[dayIndex % VERSES.length];
}
