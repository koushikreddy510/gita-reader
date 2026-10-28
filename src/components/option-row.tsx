import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { selectFeedback } from '@/lib/haptics';

type Props = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress?: () => void;
  /** Badge, swatch, or sample glyph shown in the leading tile. */
  leading?: ReactNode;
  /** Replaces the checkmark — e.g. a "Soon" tag. */
  trailing?: ReactNode;
  disabled?: boolean;
};

/** A single selectable option: theme, text size, translation, language. */
export function OptionRow({
  title,
  subtitle,
  selected,
  onPress,
  leading,
  trailing,
  disabled,
}: Props) {
  const { colors } = useReadingTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      // react-native-web 0.21 emits nothing from `accessibilityState`, so the
      // ARIA prop is what actually reaches the DOM there; native keeps `disabled`.
      aria-checked={selected}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        selectFeedback();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected ? colors.accentSoft : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
          opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
        },
      ]}>
      {leading ? (
        <View style={[styles.leading, { backgroundColor: colors.surfaceAlt }]}>{leading}</View>
      ) : null}

      <View style={styles.text}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: selected ? colors.accent : colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing ??
        (selected ? (
          <View style={[styles.check, { backgroundColor: colors.accent }]}>
            <Ionicons name="checkmark" size={13} color={colors.accentText} />
          </View>
        ) : (
          <View style={[styles.radio, { borderColor: colors.border }]} />
        ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingHorizontal: Space.md,
    paddingVertical: Space.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 68,
  },
  leading: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: FontFamily.uiSemibold, fontSize: 16, letterSpacing: -0.2 },
  subtitle: { fontFamily: FontFamily.ui, fontSize: 13 },
  check: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
});
