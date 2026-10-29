/**
 * The corpus importer is the only path that puts scripture into the app, so its
 * validation is tested end to end through the CLI.
 *
 * These are the guarantees the reader relies on: refs are canonical, nothing
 * duplicates, Sanskrit is actually Devanagari, and copyrighted editions can
 * never be smuggled in.
 */

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPT = path.join(__dirname, '..', 'import-corpus.mjs');

let dir;

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gita-corpus-'));
});

afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

function fixture(name, data) {
  const file = path.join(dir, name);
  fs.writeFileSync(file, JSON.stringify(data), 'utf8');
  return file;
}

function run(input, output, extra = []) {
  return spawnSync(process.execPath, [SCRIPT, input, '--out', output, ...extra], {
    encoding: 'utf8',
  });
}

function verse(overrides = {}) {
  return {
    chapter: 2,
    verse: 47,
    devanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
    iast: 'karmaṇy evādhikāras te mā phaleṣu kadācana |',
    translations: { editorial: 'You have a right to the action, not to its fruit.' },
    ...overrides,
  };
}

describe('a valid dataset', () => {
  it('writes a generated corpus sorted by chapter and verse', () => {
    const input = fixture('valid.json', {
      source: 'Test edition',
      verses: [
        verse({ chapter: 2, verse: 47 }),
        verse({ chapter: 1, verse: 1, devanagari: 'धर्मक्षेत्रे कुरुक्षेत्रे।', iast: 'dharma-kṣetre' }),
      ],
    });
    const out = path.join(dir, 'valid.generated.ts');

    const result = run(input, out);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Imported 2/700 verses');

    const written = fs.readFileSync(out, 'utf8');
    expect(written).toContain('GENERATED FILE');
    expect(written).toContain('Source: Test edition');
    expect(written).toContain('export const GENERATED_VERSES: Verse[] = [');

    // Input order was 2.47 then 1.1; output must be canonical order.
    expect(written.indexOf("ref: '1.1'")).toBeLessThan(written.indexOf("ref: '2.47'"));
  });

  it('accepts a bare array as well as an object with verses', () => {
    const input = fixture('array.json', [verse()]);
    const out = path.join(dir, 'array.generated.ts');

    expect(run(input, out).status).toBe(0);
    expect(fs.readFileSync(out, 'utf8')).toContain("ref: '2.47'");
  });

  it('escapes apostrophes and newlines so the TS file stays valid', () => {
    const input = fixture('escaping.json', {
      verses: [
        verse({
          iast: "dehino 'smin yathā dehe",
          translations: { editorial: "It's a test\nwith two lines" },
        }),
      ],
    });
    const out = path.join(dir, 'escaping.generated.ts');

    expect(run(input, out).status).toBe(0);

    const written = fs.readFileSync(out, 'utf8');
    expect(written).toContain("dehino \\'smin");
    expect(written).toContain("It\\'s a test\\nwith two lines");
  });

  it('reports the coverage gap without failing a partial import', () => {
    const input = fixture('partial.json', { verses: [verse()] });
    const result = run(input, path.join(dir, 'partial.generated.ts'));

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('18 chapter(s) incomplete');
    expect(result.stdout).toContain('chapter  1');
  });
});

describe('rejected datasets', () => {
  function expectRejected(name, data, matcher) {
    const input = fixture(name, data);
    const out = path.join(dir, `${name}.generated.ts`);

    const result = run(input, out);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(matcher);
    expect(fs.existsSync(out)).toBe(false);
  }

  it('rejects a chapter outside 1–18', () => {
    expectRejected('bad-chapter.json', { verses: [verse({ chapter: 19 })] }, /chapter must be/);
  });

  it('rejects a verse beyond the chapter’s length', () => {
    expectRejected(
      'bad-verse.json',
      { verses: [verse({ chapter: 2, verse: 73 })] },
      /has verses 1–72/
    );
  });

  it('rejects duplicate refs', () => {
    expectRejected('duplicate.json', { verses: [verse(), verse()] }, /appears more than once/);
  });

  it('rejects an edition that is not public domain', () => {
    expectRejected(
      'copyright.json',
      { verses: [verse({ translations: { prabhupada: 'still in copyright' } })] },
      /public domain/
    );
  });

  it('rejects Devanagari that is missing or not Devanagari', () => {
    expectRejected('empty-sanskrit.json', { verses: [verse({ devanagari: '' })] }, /devanagari is empty/);
    expectRejected(
      'latin-sanskrit.json',
      { verses: [verse({ devanagari: 'karmaṇy evādhikāras te' })] },
      /no Devanagari characters/
    );
  });

  it('rejects Devanagari mixed into the transliteration', () => {
    expectRejected(
      'mixed-iast.json',
      { verses: [verse({ iast: 'karmaṇy कर्म' })] },
      /must not contain Devanagari/
    );
  });

  it('rejects an unreadable file and invalid JSON', () => {
    const missing = path.join(dir, 'does-not-exist.json');
    const result = spawnSync(process.execPath, [SCRIPT, missing], { encoding: 'utf8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Cannot read/);

    const broken = path.join(dir, 'broken.json');
    fs.writeFileSync(broken, '{ not json', 'utf8');
    const brokenResult = spawnSync(process.execPath, [SCRIPT, broken], { encoding: 'utf8' });
    expect(brokenResult.status).toBe(1);
    expect(brokenResult.stderr).toMatch(/Invalid JSON/);
  });

  it('rejects a dataset with no usable verses', () => {
    const input = fixture('empty.json', { verses: [] });
    const result = run(input, path.join(dir, 'empty.generated.ts'));

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/no usable verses/);
  });
});

describe('--strict', () => {
  it('fails a partial import but still writes what was valid', () => {
    const input = fixture('strict.json', { verses: [verse()] });
    const out = path.join(dir, 'strict.generated.ts');

    const result = run(input, out, ['--strict']);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/--strict/);
    // Documented behaviour: the partial file is written so it can be inspected.
    expect(fs.existsSync(out)).toBe(true);
  });
});
