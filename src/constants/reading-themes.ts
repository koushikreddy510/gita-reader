/**
 * The six reading themes. Selecting a theme re-skins every screen, not just the
 * reader — the whole app is tinted by how you like to read.
 *
 * Each theme must supply a complete surface ramp so no component has to fall
 * back to a hardcoded colour:
 *
 *   background → the outermost canvas (behind the header gradient)
 *   sheet      → the main content panel that overlaps the header
 *   surface    → rows and cards sitting on the sheet
 *   surfaceAlt → pressed / nested states
 */

export type ReadingThemeId = 'oled' | 'dark' | 'light' | 'dusk' | 'sepia' | 'green';

export type HighlightColorId = 'amber' | 'rose' | 'sky' | 'violet' | 'sage';

export type ThemeColors = {
  background: string;
  sheet: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  hairline: string;

  text: string;
  textSecondary: string;
  textTertiary: string;

  accent: string;
  accentText: string;
  accentSoft: string;
  gold: string;

  headerFrom: string;
  headerTo: string;

  highlightFill: Record<HighlightColorId, string>;
  highlightSolid: Record<HighlightColorId, string>;
};

export type ReadingTheme = {
  id: ReadingThemeId;
  name: string;
  subtitle: string;
  isLight: boolean;
  /** Miniature three-dot swatch shown in the theme picker. */
  preview: { background: string; dots: [string, string, string] };
  colors: ThemeColors;
};

const HIGHLIGHT_SOLIDS: Record<HighlightColorId, string> = {
  amber: '#E9B44C',
  rose: '#F2779A',
  sky: '#5FBCFF',
  violet: '#A78BFA',
  sage: '#7FD1A6',
};

/** Fills are translucent so they sit under text without hiding it. */
function highlightFills(alpha: string): Record<HighlightColorId, string> {
  return {
    amber: `${HIGHLIGHT_SOLIDS.amber}${alpha}`,
    rose: `${HIGHLIGHT_SOLIDS.rose}${alpha}`,
    sky: `${HIGHLIGHT_SOLIDS.sky}${alpha}`,
    violet: `${HIGHLIGHT_SOLIDS.violet}${alpha}`,
    sage: `${HIGHLIGHT_SOLIDS.sage}${alpha}`,
  };
}

const DARK_HIGHLIGHTS = highlightFills('2E');
const LIGHT_HIGHLIGHTS = highlightFills('4D');

export const READING_THEMES: ReadingTheme[] = [
  {
    id: 'oled',
    name: 'OLED / True Black',
    subtitle: 'Max battery savings, high contrast',
    isLight: false,
    preview: { background: '#000000', dots: ['#000000', '#1F2126', '#6C8CFF'] },
    colors: {
      background: '#000000',
      sheet: '#000000',
      surface: '#101114',
      surfaceAlt: '#191B1F',
      border: '#1F2126',
      hairline: '#191B20',
      text: '#FFFFFF',
      textSecondary: '#9BA1AC',
      textTertiary: '#6B7280',
      accent: '#6C8CFF',
      accentText: '#070A16',
      accentSoft: 'rgba(108, 140, 255, 0.16)',
      gold: '#E9B44C',
      headerFrom: '#1B4BD8',
      headerTo: '#000000',
      highlightFill: DARK_HIGHLIGHTS,
      highlightSolid: HIGHLIGHT_SOLIDS,
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    subtitle: 'Pure black & dark tones',
    isLight: false,
    preview: { background: '#15171B', dots: ['#15171B', '#2A2E35', '#7C93FF'] },
    colors: {
      background: '#0C0D10',
      sheet: '#0C0D10',
      surface: '#16181D',
      surfaceAlt: '#20242A',
      border: '#252930',
      hairline: '#1E2127',
      text: '#F4F5F7',
      textSecondary: '#9BA1AC',
      textTertiary: '#6F7682',
      accent: '#7C93FF',
      accentText: '#0A0D16',
      accentSoft: 'rgba(124, 147, 255, 0.16)',
      gold: '#E9B44C',
      headerFrom: '#173FA8',
      headerTo: '#0C0D10',
      highlightFill: DARK_HIGHLIGHTS,
      highlightSolid: HIGHLIGHT_SOLIDS,
    },
  },
  {
    id: 'light',
    name: 'Light',
    subtitle: 'Classic bright white',
    isLight: true,
    preview: { background: '#FFFFFF', dots: ['#FFFFFF', '#E3E6EC', '#3D63F0'] },
    colors: {
      background: '#FFFFFF',
      sheet: '#FFFFFF',
      surface: '#F5F6F9',
      surfaceAlt: '#EDEFF4',
      border: '#E3E6EC',
      hairline: '#EFF1F5',
      text: '#0B0D12',
      textSecondary: '#5C6472',
      textTertiary: '#8B93A1',
      accent: '#3D63F0',
      accentText: '#FFFFFF',
      accentSoft: 'rgba(61, 99, 240, 0.10)',
      gold: '#B7791F',
      headerFrom: '#3D63F0',
      headerTo: '#FFFFFF',
      highlightFill: LIGHT_HIGHLIGHTS,
      highlightSolid: HIGHLIGHT_SOLIDS,
    },
  },
  {
    id: 'dusk',
    name: 'Dusk / Warm Dark',
    subtitle: "Sepia's night counterpart, low blue light",
    isLight: false,
    preview: { background: '#1F1915', dots: ['#1F1915', '#3A2E25', '#C8965F'] },
    colors: {
      background: '#17120F',
      sheet: '#17120F',
      surface: '#201914',
      surfaceAlt: '#2C231C',
      border: '#332921',
      hairline: '#291F19',
      text: '#F0E4D6',
      textSecondary: '#B6A392',
      textTertiary: '#8A7869',
      accent: '#C8965F',
      accentText: '#17120F',
      accentSoft: 'rgba(200, 150, 95, 0.16)',
      gold: '#E0A860',
      headerFrom: '#3E2C1E',
      headerTo: '#17120F',
      highlightFill: DARK_HIGHLIGHTS,
      highlightSolid: HIGHLIGHT_SOLIDS,
    },
  },
  {
    id: 'sepia',
    name: 'Sepia / Paper',
    subtitle: 'Warm paper tone for easy reading',
    isLight: true,
    preview: { background: '#FBF6EC', dots: ['#FBF6EC', '#E2D6C0', '#8C6A3F'] },
    colors: {
      background: '#F6EFE2',
      sheet: '#F6EFE2',
      surface: '#FBF6EC',
      surfaceAlt: '#F0E7D6',
      border: '#E2D6C0',
      hairline: '#EBE1D0',
      text: '#3B3226',
      textSecondary: '#7A6B57',
      textTertiary: '#9C8B74',
      accent: '#8C6A3F',
      accentText: '#FFF8EC',
      accentSoft: 'rgba(140, 106, 63, 0.12)',
      gold: '#B8873E',
      headerFrom: '#C9A87C',
      headerTo: '#F6EFE2',
      highlightFill: LIGHT_HIGHLIGHTS,
      highlightSolid: HIGHLIGHT_SOLIDS,
    },
  },
  {
    id: 'green',
    name: 'Soft Green',
    subtitle: 'Reduced blue light, e-ink style',
    isLight: true,
    preview: { background: '#F2F7EF', dots: ['#F2F7EF', '#CFDDC7', '#4C7A44'] },
    colors: {
      background: '#E9F0E5',
      sheet: '#E9F0E5',
      surface: '#F2F7EF',
      surfaceAlt: '#DEE9D8',
      border: '#CFDDC7',
      hairline: '#DAE5D4',
      text: '#24301F',
      textSecondary: '#5C6B53',
      textTertiary: '#7E8D74',
      accent: '#4C7A44',
      accentText: '#F4FAF1',
      accentSoft: 'rgba(76, 122, 68, 0.12)',
      gold: '#A8823A',
      headerFrom: '#8FB07F',
      headerTo: '#E9F0E5',
      highlightFill: LIGHT_HIGHLIGHTS,
      highlightSolid: HIGHLIGHT_SOLIDS,
    },
  },
];

export const DEFAULT_THEME_ID: ReadingThemeId = 'oled';

const THEME_BY_ID: Record<ReadingThemeId, ReadingTheme> = READING_THEMES.reduce(
  (acc, theme) => ({ ...acc, [theme.id]: theme }),
  {} as Record<ReadingThemeId, ReadingTheme>
);

export function getTheme(id: string | undefined): ReadingTheme {
  return (id && THEME_BY_ID[id as ReadingThemeId]) || THEME_BY_ID[DEFAULT_THEME_ID];
}

export const HIGHLIGHT_LABELS: Record<HighlightColorId, string> = {
  amber: 'Amber',
  rose: 'Rose',
  sky: 'Sky',
  violet: 'Violet',
  sage: 'Sage',
};

export const HIGHLIGHT_ORDER: HighlightColorId[] = ['amber', 'rose', 'sky', 'violet', 'sage'];
