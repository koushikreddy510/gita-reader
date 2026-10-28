/**
 * Design tokens shared by every surface in the app.
 *
 * Colour comes from the active *reading* theme (see `reading-themes.ts`) so the
 * whole UI warms/cools with the reader's choice. Everything here is
 * colour-free: fonts, spacing, radii, motion.
 */

export const FontFamily = {
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemibold: 'Inter_600SemiBold',
  uiBold: 'Inter_700Bold',
  serif: 'EBGaramond_400Regular',
  serifItalic: 'EBGaramond_400Regular_Italic',
  serifMedium: 'EBGaramond_500Medium',
  devanagari: 'NotoSerifDevanagari_400Regular',
  devanagariMedium: 'NotoSerifDevanagari_500Medium',
  devanagariSemibold: 'NotoSerifDevanagari_600SemiBold',
} as const;

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  sheet: 28,
  pill: 999,
} as const;

export const Layout = {
  gutter: 20,
  /** Breathing room left at the bottom of a scroll view that sits above the nav. */
  navClearance: 28,
  /** Phone-first design: past this the sheet centres instead of stretching. */
  maxContentWidth: 560,
} as const;

export const Motion = {
  quick: 140,
  base: 220,
} as const;
