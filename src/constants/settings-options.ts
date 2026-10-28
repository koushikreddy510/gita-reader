/**
 * User-selectable preferences and the option lists the pickers render.
 */

export type TextSizeId = 'small' | 'medium' | 'large' | 'xlarge';

export type TextSizeOption = {
  id: TextSizeId;
  name: string;
  subtitle: string;
  /** Multiplier applied to reading + body type. Titles stay fixed so layout holds. */
  factor: number;
  label: string;
};

export const TEXT_SIZES: TextSizeOption[] = [
  { id: 'small', name: 'Small', subtitle: 'Compact size', factor: 0.88, label: '88%' },
  { id: 'medium', name: 'Medium', subtitle: 'Standard default', factor: 1, label: '100%' },
  { id: 'large', name: 'Large', subtitle: 'Enhanced readability', factor: 1.14, label: '114%' },
  {
    id: 'xlarge',
    name: 'Extra Large',
    subtitle: 'Maximum visibility',
    factor: 1.28,
    label: '128%',
  },
];

export const DEFAULT_TEXT_SIZE: TextSizeId = 'medium';

export function getTextSize(id: string | undefined): TextSizeOption {
  return TEXT_SIZES.find((size) => size.id === id) ?? TEXT_SIZES[1];
}

// ---------------------------------------------------------------------------
// Translations
//
// Every entry here must be public domain. Sanskrit is PD by age; these English
// renderings are all 18th/19th century. Anything modern (Prabhupada/BBT,
// Gita Press, Radhakrishnan) needs a licence and must not be added until one is
// in hand — see BHAGAVAD_GITA_APP_RESEARCH.md, "Content accuracy".
// ---------------------------------------------------------------------------

export type TranslationId = 'editorial' | 'arnold' | 'telang' | 'wilkins' | 'none';

export type TranslationOption = {
  id: TranslationId;
  name: string;
  subtitle: string;
  year?: number;
  badge: string;
};

export const TRANSLATIONS: TranslationOption[] = [
  {
    id: 'editorial',
    name: 'Plain English',
    subtitle: 'Working draft — pending review',
    badge: 'EN',
  },
  {
    id: 'arnold',
    name: 'Edwin Arnold',
    subtitle: 'The Song Celestial — verse rendering',
    year: 1885,
    badge: 'EN',
  },
  {
    id: 'telang',
    name: 'K. T. Telang',
    subtitle: 'Sacred Books of the East — prose',
    year: 1882,
    badge: 'EN',
  },
  {
    id: 'wilkins',
    name: 'Charles Wilkins',
    subtitle: 'The first English translation',
    year: 1785,
    badge: 'EN',
  },
  {
    id: 'none',
    name: 'Sanskrit only',
    subtitle: 'Devanagari and transliteration, no translation',
    badge: 'SA',
  },
];

export const DEFAULT_TRANSLATION: TranslationId = 'editorial';

export function getTranslation(id: string | undefined): TranslationOption {
  return TRANSLATIONS.find((t) => t.id === id) ?? TRANSLATIONS[0];
}

// ---------------------------------------------------------------------------
// Script
// ---------------------------------------------------------------------------

export type ScriptMode = 'devanagari' | 'iast' | 'both';

export const SCRIPT_MODES: { id: ScriptMode; name: string; subtitle: string }[] = [
  { id: 'both', name: 'Devanagari + IAST', subtitle: 'Original with romanised transliteration' },
  { id: 'devanagari', name: 'Devanagari only', subtitle: 'देवनागरी' },
  { id: 'iast', name: 'IAST only', subtitle: 'Roman transliteration with diacritics' },
];

export const DEFAULT_SCRIPT_MODE: ScriptMode = 'both';

// ---------------------------------------------------------------------------
// App language
//
// Only English UI strings exist today. The rest of the list is here so the
// picker matches the shape of the final app; selecting a pending language is
// blocked rather than silently doing nothing.
// ---------------------------------------------------------------------------

export type AppLanguageOption = {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  available: boolean;
};

export const APP_LANGUAGES: AppLanguageOption[] = [
  { id: 'en', name: 'English', nativeName: 'English', code: 'EN', available: true },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', code: 'HI', available: false },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', code: 'BN', available: false },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', code: 'TA', available: false },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', code: 'TE', available: false },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', code: 'MR', available: false },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'GU', available: false },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'KN', available: false },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', code: 'ML', available: false },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'PA', available: false },
];

export const DEFAULT_APP_LANGUAGE = 'en';

export function getAppLanguage(id: string | undefined): AppLanguageOption {
  return APP_LANGUAGES.find((l) => l.id === id) ?? APP_LANGUAGES[0];
}
