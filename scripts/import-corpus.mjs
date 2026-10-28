#!/usr/bin/env node
/**
 * Turns a verse dataset into `src/data/corpus.generated.ts`.
 *
 *   node scripts/import-corpus.mjs corpus/gita.json
 *   node scripts/import-corpus.mjs corpus/gita.json --strict
 *
 * Input — a single JSON file:
 *
 *   {
 *     "source": "citation for the text and translations",
 *     "verses": [
 *       {
 *         "chapter": 1,
 *         "verse": 1,
 *         "devanagari": "धर्मक्षेत्रे कुरुक्षेत्रे …",
 *         "iast": "dharma-kṣetre kurukṣetre …",
 *         "translations": { "editorial": "…", "arnold": "…" }
 *       }
 *     ]
 *   }
 *
 * Only public-domain translations may be imported: `editorial`, `arnold`,
 * `telang`, `wilkins`. Anything still in copyright (Gita Press, BBT,
 * Radhakrishnan) needs a licence first and is rejected here.
 *
 * `--strict` exits non-zero unless all 700 verses are present. Without it, a
 * partial import is written and the gaps are listed — useful while assembling
 * the corpus chapter by chapter.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DEFAULT = path.join(ROOT, 'src/data/corpus.generated.ts');

/** Mirrors `src/constants/chapters.ts` — the canonical 700-verse recension. */
const VERSE_COUNTS = [
  47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78,
];
const TOTAL = VERSE_COUNTS.reduce((sum, count) => sum + count, 0);

const TRANSLATION_IDS = new Set(['editorial', 'arnold', 'telang', 'wilkins']);

const DEVANAGARI = /[\u0900-\u097F]/;
const MIXED_SCRIPT = /[\u0900-\u097F][\s\S]*[A-Za-z]|[A-Za-z][\s\S]*[\u0900-\u097F]/;

const problems = [];
const warnings = [];
const fail = (message) => problems.push(message);

function parseArgs(argv) {
  const args = { input: null, out: OUT_DEFAULT, strict: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--strict') args.strict = true;
    else if (arg === '--out') args.out = path.resolve(argv[(i += 1)] ?? '');
    else if (!args.input) args.input = path.resolve(arg);
    else fail(`Unexpected argument: ${arg}`);
  }
  if (!args.input) fail('Usage: node scripts/import-corpus.mjs <dataset.json> [--strict]');
  return args;
}

async function readDataset(file) {
  let raw;
  try {
    raw = await readFile(file, 'utf8');
  } catch (error) {
    fail(`Cannot read ${file}: ${error.message}`);
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(`Invalid JSON in ${file}: ${error.message}`);
    return null;
  }

  const verses = Array.isArray(parsed) ? parsed : parsed?.verses;
  if (!Array.isArray(verses)) {
    fail('Dataset must be an array, or an object with a "verses" array.');
    return null;
  }
  return { source: parsed?.source, verses };
}

function normaliseText(value) {
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim() : '';
}

function validate(dataset) {
  const seen = new Set();
  const clean = [];

  dataset.verses.forEach((entry, index) => {
    const where = `verses[${index}]`;
    if (!entry || typeof entry !== 'object') {
      fail(`${where} is not an object.`);
      return;
    }

    const chapter = Number(entry.chapter);
    const verse = Number(entry.verse);
    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 18) {
      fail(`${where}: chapter must be an integer 1–18 (got ${JSON.stringify(entry.chapter)}).`);
      return;
    }
    const chapterCount = VERSE_COUNTS[chapter - 1];
    if (!Number.isInteger(verse) || verse < 1 || verse > chapterCount) {
      fail(`${where}: chapter ${chapter} has verses 1–${chapterCount} (got ${JSON.stringify(entry.verse)}).`);
      return;
    }

    const ref = `${chapter}.${verse}`;
    if (seen.has(ref)) {
      fail(`${ref} appears more than once.`);
      return;
    }
    seen.add(ref);

    const devanagari = normaliseText(entry.devanagari);
    const iast = normaliseText(entry.iast);

    if (!devanagari) fail(`${ref}: devanagari is empty.`);
    else if (!DEVANAGARI.test(devanagari)) fail(`${ref}: devanagari contains no Devanagari characters.`);
    else if (MIXED_SCRIPT.test(devanagari)) fail(`${ref}: devanagari mixes Latin letters into the Sanskrit.`);

    if (!iast) warnings.push(`${ref}: no iast transliteration.`);
    else if (DEVANAGARI.test(iast)) fail(`${ref}: iast must not contain Devanagari characters.`);

    const translations = {};
    const rawTranslations = entry.translations ?? {};
    if (typeof rawTranslations !== 'object' || Array.isArray(rawTranslations)) {
      fail(`${ref}: translations must be an object keyed by edition id.`);
    } else {
      for (const [id, value] of Object.entries(rawTranslations)) {
        if (!TRANSLATION_IDS.has(id)) {
          fail(`${ref}: unknown translation "${id}" — only ${[...TRANSLATION_IDS].join(', ')} are public domain.`);
          continue;
        }
        const text = normaliseText(value);
        if (!text) fail(`${ref}: translation "${id}" is empty.`);
        else translations[id] = text;
      }
    }

    if (Object.keys(translations).length === 0) {
      warnings.push(`${ref}: no English translation — the reader will show Sanskrit only.`);
    }

    clean.push({ ref, chapter, verse, devanagari, iast, translations });
  });

  clean.sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);
  return clean;
}

function coverageReport(verses) {
  const byChapter = new Map();
  for (const verse of verses) byChapter.set(verse.chapter, (byChapter.get(verse.chapter) ?? 0) + 1);

  const rows = VERSE_COUNTS.map((count, index) => {
    const chapter = index + 1;
    const have = byChapter.get(chapter) ?? 0;
    return { chapter, have, count, complete: have === count };
  });

  const lines = rows.map(
    (row) =>
      `  chapter ${String(row.chapter).padStart(2)}  ${String(row.have).padStart(3)}/${String(row.count).padEnd(3)} ${row.complete ? 'complete' : `${row.count - row.have} missing`}`
  );

  return { rows, lines, imported: verses.length };
}

const q = (value) =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;

function render(verses, source, report) {
  const stamp = new Date().toISOString().slice(0, 10);
  const header = [
    '/**',
    ' * GENERATED FILE — do not edit by hand.',
    ' *',
    ' * Produced by `node scripts/import-corpus.mjs`. Re-run the importer instead of',
    ' * editing here; hand edits are lost on the next import.',
    ' *',
    ` * Imported: ${stamp} · ${report.imported}/${TOTAL} verses`,
    ` * Source: ${source ? source.replace(/\s+/g, ' ') : 'not stated in the dataset'}`,
    ' */',
    '',
    "import type { Verse } from './verses';",
    '',
    'export const GENERATED_VERSES: Verse[] = [',
  ];

  const body = verses.map((verse) => {
    const translations = Object.entries(verse.translations)
      .map(([id, text]) => `${id}: ${q(text)}`)
      .join(', ');
    return [
      '  {',
      `    ref: ${q(verse.ref)},`,
      `    chapter: ${verse.chapter},`,
      `    verse: ${verse.verse},`,
      `    devanagari: ${q(verse.devanagari)},`,
      `    iast: ${q(verse.iast)},`,
      `    translations: { ${translations} },`,
      '  },',
    ].join('\n');
  });

  return [...header, ...body, '];', ''].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (problems.length > 0) {
    console.error(problems.map((problem) => `✗ ${problem}`).join('\n'));
    process.exit(1);
  }

  const dataset = await readDataset(args.input);
  if (!dataset || problems.length > 0) {
    console.error(problems.map((problem) => `✗ ${problem}`).join('\n'));
    process.exit(1);
  }

  const verses = validate(dataset);
  const report = coverageReport(verses);

  if (problems.length > 0) {
    console.error(problems.map((problem) => `✗ ${problem}`).join('\n'));
    console.error(`\nNothing written: ${problems.length} problem(s) in ${args.input}.`);
    process.exit(1);
  }

  if (report.imported === 0) {
    console.error('✗ The dataset contains no usable verses. Nothing written.');
    process.exit(1);
  }

  await writeFile(args.out, render(verses, dataset.source, report), 'utf8');

  console.log(`✓ Imported ${report.imported}/${TOTAL} verses → ${path.relative(ROOT, args.out)}`);
  console.log(report.lines.join('\n'));

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s):`);
    console.log(warnings.slice(0, 20).map((warning) => `  · ${warning}`).join('\n'));
    if (warnings.length > 20) console.log(`  · …and ${warnings.length - 20} more`);
  }

  const incomplete = report.rows.filter((row) => !row.complete);
  if (incomplete.length > 0) {
    const message = `${incomplete.length} chapter(s) incomplete — the reader shows "${report.imported} of 700 bundled".`;
    if (args.strict) {
      console.error(`\n✗ ${message} (--strict)`);
      process.exit(1);
    }
    console.log(`\n! ${message}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
