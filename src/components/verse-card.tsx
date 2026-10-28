import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import {
  HIGHLIGHT_LABELS,
  HIGHLIGHT_ORDER,
  type HighlightColorId,
} from '@/constants/reading-themes';
import { FontFamily, Radius, Space } from '@/constants/theme';
import type { Verse } from '@/data';
import { resolveTranslation } from '@/data';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { successFeedback, tapFeedback } from '@/lib/haptics';
import { useLibrary } from '@/store/library';
import { useSettings } from '@/store/settings';

type Props = {
  verse: Verse;
  /** Show the translation-source note under the English text. */
  showMeta?: boolean;
};

export function VerseCard({ verse, showMeta = true }: Props) {
  const { colors, scale } = useReadingTheme();

  const translationId = useSettings((state) => state.translationId);
  const scriptMode = useSettings((state) => state.scriptMode);

  const highlight = useLibrary((state) => state.highlights[verse.ref]);
  const isBookmarked = useLibrary((state) => Boolean(state.bookmarks[verse.ref]));
  const setHighlight = useLibrary((state) => state.setHighlight);
  const clearHighlight = useLibrary((state) => state.clearHighlight);
  const toggleBookmark = useLibrary((state) => state.toggleBookmark);

  const [paletteOpen, setPaletteOpen] = useState(false);

  const translation = resolveTranslation(verse, translationId);
  const showDevanagari = scriptMode !== 'iast';
  const showIast = scriptMode !== 'devanagari';

  const background = highlight ? colors.highlightFill[highlight.color] : colors.surface;

  const onPickColor = (color: HighlightColorId) => {
    setHighlight(verse.ref, color);
    setPaletteOpen(false);
    successFeedback();
  };

  const onShare = () => {
    tapFeedback();
    const lines = [`${verse.devanagari}`, '', verse.iast];
    if (translation) lines.push('', translation.text);
    lines.push('', `— Bhagavad Gita ${verse.ref}`);
    Share.share({ message: lines.join('\n') }).catch(() => {});
  };

  return (
    <Pressable
      onLongPress={() => {
        tapFeedback();
        setPaletteOpen((open) => !open);
      }}
      delayLongPress={280}
      style={[
        styles.card,
        {
          backgroundColor: background,
          borderColor: highlight ? `${colors.highlightSolid[highlight.color]}66` : colors.border,
        },
      ]}>
      <View style={styles.topRow}>
        <View style={[styles.refChip, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.refText, { color: colors.accent }]}>{verse.ref}</Text>
        </View>

        <View style={styles.topActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark verse'}
            hitSlop={10}
            onPress={() => {
              tapFeedback();
              toggleBookmark(verse.ref);
            }}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.5 : 1 }]}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isBookmarked ? colors.accent : colors.textTertiary}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share verse"
            hitSlop={10}
            onPress={onShare}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.5 : 1 }]}>
            <Ionicons name="share-outline" size={18} color={colors.textTertiary} />
          </Pressable>
        </View>
      </View>

      {showDevanagari ? (
        <Text
          style={[
            styles.devanagari,
            {
              color: colors.text,
              fontSize: 21 * scale,
              lineHeight: 37 * scale,
            },
          ]}>
          {verse.devanagari}
        </Text>
      ) : null}

      {showIast ? (
        <Text
          style={[
            styles.iast,
            {
              color: colors.textSecondary,
              fontSize: 14 * scale,
              lineHeight: 23 * scale,
            },
          ]}>
          {verse.iast}
        </Text>
      ) : null}

      {translation ? (
        <>
          <View style={[styles.rule, { backgroundColor: colors.hairline }]} />
          <Text
            style={[
              styles.translation,
              {
                color: colors.text,
                fontSize: 17.5 * scale,
                lineHeight: 28 * scale,
              },
            ]}>
            {translation.text}
          </Text>
          {showMeta ? (
            <Text style={[styles.meta, { color: colors.textTertiary }]}>
              {translation.isFallback
                ? `${translation.label} · requested edition not loaded for this verse`
                : translation.label}
            </Text>
          ) : null}
        </>
      ) : null}

      {paletteOpen ? (
        <View style={[styles.palette, { borderTopColor: colors.hairline }]}>
          <Text style={[styles.paletteLabel, { color: colors.textTertiary }]}>Highlight</Text>
          <View style={styles.swatches}>
            {HIGHLIGHT_ORDER.map((color) => {
              const active = highlight?.color === color;
              return (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityLabel={`${HIGHLIGHT_LABELS[color]} highlight`}
                  accessibilityState={{ selected: active }}
                  hitSlop={6}
                  onPress={() => onPickColor(color)}
                  style={[
                    styles.swatch,
                    {
                      backgroundColor: colors.highlightSolid[color],
                      borderColor: active ? colors.text : 'transparent',
                    },
                  ]}
                />
              );
            })}
            {highlight ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove highlight"
                hitSlop={6}
                onPress={() => {
                  clearHighlight(verse.ref);
                  setPaletteOpen(false);
                }}
                style={[styles.swatchGhost, { borderColor: colors.border }]}>
                <Ionicons name="close" size={14} color={colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Space.lg,
    gap: Space.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Space.xs,
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: Space.xs },
  refChip: {
    paddingHorizontal: Space.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  refText: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  iconButton: { padding: 4 },
  devanagari: {
    fontFamily: FontFamily.devanagari,
    marginTop: Space.xs,
  },
  iast: {
    fontFamily: FontFamily.serifItalic,
    marginTop: 2,
  },
  rule: { height: StyleSheet.hairlineWidth, marginVertical: Space.sm },
  translation: {
    fontFamily: FontFamily.serif,
  },
  meta: {
    fontFamily: FontFamily.ui,
    fontSize: 11.5,
    marginTop: 6,
    letterSpacing: 0.1,
  },
  palette: {
    marginTop: Space.md,
    paddingTop: Space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  paletteLabel: {
    fontFamily: FontFamily.uiMedium,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  swatches: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  swatch: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    borderWidth: 2,
  },
  swatchGhost: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
