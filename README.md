# Gita Reader

An offline-first Bhagavad Gita reader: all 700 verses in Devanagari + IAST, public-domain English translations, six reading themes, highlighting, bookmarks and search. Built with Expo Router and React Native — one codebase for iOS, Android and web.

This is **App 1** of two. The second app (short-form reels of verses and dialogues) is a separate product with its own content pipeline; its research notes are deliberately kept out of this repository.

## Run it

```bash
npm install
npx expo start          # then press i / a / w, or scan the QR with Expo Go
```

Useful checks:

```bash
npx tsc --noEmit        # typecheck
npx expo lint           # lint
npx expo export --platform ios   # verify the bundle compiles
```

## What is in the app

| Screen | Route | Notes |
| --- | --- | --- |
| Home | `/` | Continue reading, verse of the day, streak + progress |
| Chapters | `/chapters` | All 18 chapters, expandable verse grid, search by name/theme |
| Reader | `/chapter/[number]` | Verse list for a chapter, long-press to highlight, tap a grid chip to jump |
| Search | `/search` | Sanskrit (Devanagari), IAST and English, diacritic-insensitive |
| Saved | `/highlights` | Highlights and bookmarks, two tabs |
| Settings | `/settings` | Theme, translation, script, app language, text size |
| Premium | `/subscription` | Plan picker — a **UI shell**, not a store integration |

State lives on the device in two persisted stores (`gita-settings`, `gita-library`, both AsyncStorage). There is no account, no network call and no analytics; the app works in airplane mode.

## Project layout

```
src/
  app/                 routes (expo-router) — screens only
  components/          screen shell, verse card, sheets, option rows, nav
  constants/           chapters metadata, reading themes, settings options, tokens
  data/                corpus + query layer (search, daily verse, translations)
  hooks/               use-reading-theme (theme + text scale)
  store/               zustand stores (settings, library)
scripts/import-corpus.mjs
```

Design tokens live in `src/constants/theme.ts`; colour schemes in `src/constants/reading-themes.ts`. Components never hard-code a colour — they read `useReadingTheme()`.

## Content status — read this before shipping

**The bundled corpus is a draft.** `src/data/verses.ts` holds ~40 curated verses (2–3 per chapter) with an editorial English column written as placeholder. It exists so every screen has something real to render. It is *not* the Gita.

The app reads `src/data/corpus.ts`, which prefers `corpus.generated.ts` when it has content and falls back to the seed otherwise. To load the real text:

1. Put a dataset on disk, e.g. `corpus/gita.json`:

   ```json
   {
     "source": "citation for text + translations",
     "verses": [
       {
         "chapter": 2,
         "verse": 47,
         "devanagari": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
         "iast": "karmaṇy evādhikāras te mā phaleṣu kadācana |",
         "translations": { "editorial": "…", "arnold": "…", "telang": "…", "wilkins": "…" }
       }
     ]
   }
   ```

2. Import it:

   ```bash
   node scripts/import-corpus.mjs corpus/gita.json            # partial import is fine
   node scripts/import-corpus.mjs corpus/gita.json --strict    # fails unless all 700 are present
   ```

The importer validates against the canonical 700-verse recension (47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78), rejects duplicate and out-of-range refs, rejects Sanskrit with Latin letters mixed in, and refuses translation ids that are not public domain. It prints a per-chapter coverage table and never writes a file when validation fails.

Only public-domain English editions are allowed: **Edwin Arnold (1885)**, **K. T. Telang (1882)**, **Charles Wilkins (1785)**, plus our own editorial column. Gita Press, BBT/Prabhupada and Radhakrishnan are still in copyright and need a licence before they can appear.

Sanskrit itself is public domain, but it must still be proofread: a dropped virama changes a word. Have someone who reads Devanagari check every line before release.

## Known gaps

- **Corpus**: partial, as described above. This is the one blocker to a shippable v1.
- **Premium**: the plan picker is UI only — no `react-native-iap` / RevenueCat, no receipt validation, no restore. `settings.isPremium` is a local flag used for demos.
- **App language**: the picker lists Hindi, Bengali, Telugu and others, but only English is selectable. The strings are not extracted into a translation layer yet.
- **Scripts**: Devanagari and IAST render; a third script (Telugu, Gujarati) would need another font and a mapping table.
- **Audio**: not built. Would need per-verse recitation files and a player in `verse-card`.

## Conventions

- TypeScript strict, no `any`; check `npx tsc --noEmit` before calling work done.
- Screens compose `ScreenShell`; they do not draw their own background or header.
- Every colour comes from the active theme, so a new theme only needs an entry in `reading-themes.ts`.
- Keep `src/app/` for routes only — anything reusable belongs in `components/`, `hooks/` or `lib/`.
