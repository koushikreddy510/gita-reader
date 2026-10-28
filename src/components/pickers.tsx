import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { getVerse } from '@/data';
import { READING_THEMES } from '@/constants/reading-themes';
import {
  APP_LANGUAGES,
  SCRIPT_MODES,
  TEXT_SIZES,
  TRANSLATIONS,
} from '@/constants/settings-options';
import { FontFamily, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { useSettings } from '@/store/settings';

import { OptionRow } from './option-row';
import { Sheet } from './sheet';

type SheetProps = { visible: boolean; onClose: () => void };

// ---------------------------------------------------------------------------
// Reading theme
// ---------------------------------------------------------------------------

function ThemeSwatch({ colors }: { colors: [string, string, string] }) {
  return (
    <View style={[styles.swatch, { backgroundColor: colors[0] }]}>
      <View style={styles.swatchDots}>
        {colors.map((color) => (
          <View key={color} style={[styles.swatchDot, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  );
}

export function ThemeSheet({ visible, onClose }: SheetProps) {
  const { themeId, setTheme } = useSettings();

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Reading Theme & Color"
      subtitle="Select your preferred colour scheme for reading">
      {READING_THEMES.map((theme) => (
        <OptionRow
          key={theme.id}
          title={theme.name}
          subtitle={theme.subtitle}
          selected={themeId === theme.id}
          leading={<ThemeSwatch colors={theme.preview.dots} />}
          onPress={() => {
            setTheme(theme.id);
            onClose();
          }}
        />
      ))}
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Text size
// ---------------------------------------------------------------------------

export function TextSizeSheet({ visible, onClose }: SheetProps) {
  const { textSizeId, setTextSize } = useSettings();
  const { colors, scale } = useReadingTheme();
  const preview = getVerse('2.47');

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Text Size Preference"
      subtitle="Choose your preferred reading text size for all screens">
      {TEXT_SIZES.map((size) => (
        <OptionRow
          key={size.id}
          title={size.name}
          subtitle={`${size.subtitle} · ${size.label}`}
          selected={textSizeId === size.id}
          leading={
            <Text style={[styles.aa, { color: colors.text, fontSize: 13 + size.factor * 6 }]}>
              Aa
            </Text>
          }
          onPress={() => {
            setTextSize(size.id);
            onClose();
          }}
        />
      ))}

      {preview ? (
        <View style={[styles.preview, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[styles.previewLabel, { color: colors.textTertiary }]}>
            SAMPLE LIVE PREVIEW
          </Text>
          <Text
            style={[
              styles.previewText,
              { color: colors.text, fontSize: 17.5 * scale, lineHeight: 27 * scale },
            ]}>
            {preview.translations.editorial}
          </Text>
          <Text style={[styles.previewRef, { color: colors.textSecondary }]}>
            — Bhagavad Gita {preview.ref}
          </Text>
        </View>
      ) : null}
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Translation
// ---------------------------------------------------------------------------

export function TranslationSheet({ visible, onClose }: SheetProps) {
  const { translationId, setTranslation } = useSettings();
  const { colors } = useReadingTheme();

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Translation"
      subtitle="Only public-domain editions are bundled. Sanskrit is always shown in the original.">
      {TRANSLATIONS.map((translation) => (
        <OptionRow
          key={translation.id}
          title={translation.name}
          subtitle={
            translation.year
              ? `${translation.subtitle} · ${translation.year}`
              : translation.subtitle
          }
          selected={translationId === translation.id}
          leading={
            <Text style={[styles.badge, { color: colors.accent }]}>{translation.badge}</Text>
          }
          onPress={() => {
            setTranslation(translation.id);
            onClose();
          }}
        />
      ))}
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Script
// ---------------------------------------------------------------------------

export function ScriptSheet({ visible, onClose }: SheetProps) {
  const { scriptMode, setScriptMode } = useSettings();
  const { colors } = useReadingTheme();

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Script"
      subtitle="How the Sanskrit is displayed in the reader">
      {SCRIPT_MODES.map((mode) => (
        <OptionRow
          key={mode.id}
          title={mode.name}
          subtitle={mode.subtitle}
          selected={scriptMode === mode.id}
          leading={
            <Text
              style={[
                styles.badge,
                {
                  color: colors.accent,
                  fontFamily:
                    mode.id === 'iast' ? FontFamily.serifItalic : FontFamily.devanagariMedium,
                  fontSize: mode.id === 'iast' ? 15 : 13,
                },
              ]}>
              {mode.id === 'iast' ? 'Aa' : mode.id === 'devanagari' ? 'देव' : 'द/A'}
            </Text>
          }
          onPress={() => {
            setScriptMode(mode.id);
            onClose();
          }}
        />
      ))}
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// App language
// ---------------------------------------------------------------------------

export function AppLanguageSheet({ visible, onClose }: SheetProps) {
  const { appLanguage, setAppLanguage } = useSettings();
  const { colors } = useReadingTheme();
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const languages = needle
    ? APP_LANGUAGES.filter(
        (language) =>
          language.name.toLowerCase().includes(needle) ||
          language.nativeName.includes(query.trim()) ||
          language.code.toLowerCase().includes(needle)
      )
    : APP_LANGUAGES;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Select Language"
      subtitle="Choose your preferred app language">
      <View
        style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={16} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search language…"
          placeholderTextColor={colors.textTertiary}
          style={[styles.searchInput, { color: colors.text }]}
          autoCorrect={false}
        />
      </View>

      {languages.map((language) => (
        <OptionRow
          key={language.id}
          title={language.name}
          subtitle={language.nativeName}
          selected={appLanguage === language.id}
          disabled={!language.available}
          leading={
            <Text
              style={[
                styles.badge,
                { color: language.available ? colors.accent : colors.textTertiary },
              ]}>
              {language.code}
            </Text>
          }
          trailing={
            language.available ? undefined : (
              <Text style={[styles.soon, { color: colors.textTertiary }]}>Soon</Text>
            )
          }
          onPress={() => {
            setAppLanguage(language.id);
            onClose();
          }}
        />
      ))}

      {languages.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No language matches “{query.trim()}”.
        </Text>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  swatch: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchDots: { flexDirection: 'row', gap: 3 },
  swatchDot: { width: 5, height: 5, borderRadius: 3 },
  aa: { fontFamily: FontFamily.uiBold, letterSpacing: -0.5 },
  badge: {
    fontFamily: FontFamily.uiBold,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  preview: {
    marginTop: Space.md,
    padding: Space.lg,
    borderRadius: Radius.lg,
    gap: Space.sm,
  },
  previewLabel: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 10.5,
    letterSpacing: 1.1,
  },
  previewText: { fontFamily: FontFamily.serif },
  previewRef: { fontFamily: FontFamily.uiMedium, fontSize: 12 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingHorizontal: Space.md,
    height: 46,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Space.xs,
  },
  searchInput: { flex: 1, fontFamily: FontFamily.ui, fontSize: 15, paddingVertical: 0 },
  soon: { fontFamily: FontFamily.uiSemibold, fontSize: 11, letterSpacing: 0.5 },
  empty: {
    fontFamily: FontFamily.ui,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: Space.lg,
  },
});
