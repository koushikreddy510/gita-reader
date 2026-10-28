import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function SectionLabel({ children }: { children: ReactNode }) {
  const { colors } = useReadingTheme();
  return (
    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  );
}

/** Rounded card that groups rows together. */
export function SettingsGroup({ children }: { children: ReactNode }) {
  const { colors } = useReadingTheme();
  return (
    <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {children}
    </View>
  );
}

type RowProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  /** Short right-aligned value, e.g. "OLED" or "100%". */
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  /** Gold treatment for the premium upsell. */
  highlight?: boolean;
  last?: boolean;
};

export function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showChevron = true,
  highlight,
  last,
}: RowProps) {
  const { colors } = useReadingTheme();
  const iconTint = highlight ? colors.gold : colors.accent;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.hairline,
        },
        pressed && onPress ? { backgroundColor: colors.surfaceAlt } : null,
      ]}>
      <View style={[styles.iconTile, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name={icon} size={19} color={iconTint} />
      </View>

      <View style={styles.rowText}>
        <Text numberOfLines={1} style={[styles.rowTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <View style={[styles.valueChip, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[styles.valueText, { color: colors.accent }]}>{value}</Text>
        </View>
      ) : null}

      {showChevron ? (
        <Ionicons name="chevron-forward" size={17} color={colors.textTertiary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 12,
    letterSpacing: 0.9,
    marginBottom: Space.sm,
    marginLeft: Space.xs,
  },
  group: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingHorizontal: Space.md,
    paddingVertical: 14,
    minHeight: 62,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: FontFamily.uiSemibold, fontSize: 15.5, letterSpacing: -0.2 },
  rowSubtitle: { fontFamily: FontFamily.ui, fontSize: 12.5 },
  valueChip: {
    paddingHorizontal: Space.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm - 2,
  },
  valueText: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
});
