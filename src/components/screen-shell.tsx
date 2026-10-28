import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';

type Props = {
  title: string;
  subtitle?: string;
  /** Small label above the title, e.g. "CHAPTER 2". */
  eyebrow?: string;
  /**
   * `gradient` paints the blue header wash behind the title (Settings, Home).
   * `plain` keeps the header on the theme background (reading screens).
   */
  variant?: 'gradient' | 'plain';
  showBack?: boolean;
  right?: ReactNode;
  /** Rendered inside the header, below the title row — e.g. a search field. */
  headerExtra?: ReactNode;
  children: ReactNode;
};

export function ScreenShell({
  title,
  subtitle,
  eyebrow,
  variant = 'gradient',
  showBack,
  right,
  headerExtra,
  children,
}: Props) {
  const { colors, isLight } = useReadingTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const onHeader = isLight ? colors.text : '#FFFFFF';
  const onHeaderMuted = isLight ? 'rgba(15, 18, 26, 0.62)' : 'rgba(255, 255, 255, 0.72)';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {variant === 'gradient' ? (
        <LinearGradient
          colors={[colors.headerFrom, colors.headerTo]}
          locations={[0, 0.92]}
          start={{ x: 0.05, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
          pointerEvents="none"
        />
      ) : null}

      <View style={styles.headerOuter}>
        <View style={[styles.header, { paddingTop: insets.top + Space.md }]}>
          {showBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
              onPress={() => {
                tapFeedback();
                if (router.canGoBack()) router.back();
                else router.replace('/');
              }}
              style={({ pressed }) => [
                styles.backButton,
                {
                  borderColor: isLight ? 'rgba(15, 18, 26, 0.14)' : 'rgba(255, 255, 255, 0.18)',
                  opacity: pressed ? 0.6 : 1,
                },
              ]}>
              <Ionicons name="arrow-back" size={18} color={onHeader} />
            </Pressable>
          ) : null}

          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              {eyebrow ? (
                <Text style={[styles.eyebrow, { color: onHeaderMuted }]}>
                  {eyebrow.toUpperCase()}
                </Text>
              ) : null}
              <Text numberOfLines={2} style={[styles.title, { color: onHeader }]}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={[styles.subtitle, { color: onHeaderMuted }]}>{subtitle}</Text>
              ) : null}
            </View>
            {right ? <View style={styles.right}>{right}</View> : null}
          </View>

          {headerExtra ? <View style={styles.headerExtra}>{headerExtra}</View> : null}
        </View>
      </View>

      <View style={[styles.sheet, { backgroundColor: colors.sheet }]}>
        <View style={styles.sheetInner}>{children}</View>
      </View>
    </View>
  );
}

/** Padding for a screen's scroll content. */
export function useScreenContentPadding(withNav = false) {
  return {
    paddingHorizontal: Layout.gutter,
    paddingTop: Space.lg,
    paddingBottom: withNav ? Layout.navClearance : Space.xxxl,
  };
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  gradient: { height: 320 },
  headerOuter: { width: '100%', alignItems: 'center' },
  header: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    paddingHorizontal: Layout.gutter,
    paddingBottom: Space.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  titleBlock: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.uiBold,
    fontSize: 32,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontFamily: FontFamily.ui,
    fontSize: 14,
    marginTop: 2,
  },
  right: { paddingTop: Space.xs },
  headerExtra: { marginTop: Space.lg },
  sheet: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    marginTop: Space.md,
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
    overflow: 'hidden',
  },
  sheetInner: { flex: 1 },
});
