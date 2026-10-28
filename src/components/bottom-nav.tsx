import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { selectFeedback } from '@/lib/haptics';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_META: Record<string, { label: string; icon: IconName; activeIcon: IconName }> = {
  index: { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  chapters: { label: 'Read', icon: 'book-outline', activeIcon: 'book' },
  search: { label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  settings: { label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
};

/**
 * Floating pill navigation. Replaces the default tab bar so the active item can
 * carry its label while the rest stay icon-only — the shape from the reference
 * design, and it keeps four destinations legible on a phone.
 */
export function BottomNav({ state, navigateToTab, insets }: BottomTabBarProps) {
  const { colors } = useReadingTheme();

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.sheet, paddingBottom: Math.max(insets.bottom, Space.sm) },
      ]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}>
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;

          const focused = state.index === index;

          const onPress = () => {
            if (focused) return;
            selectFeedback();
            navigateToTab(route.key);
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              onPress={onPress}
              style={({ pressed }) => [
                styles.item,
                focused && { backgroundColor: colors.accentSoft },
                pressed && !focused && { opacity: 0.55 },
              ]}>
              <Ionicons
                name={focused ? meta.activeIcon : meta.icon}
                size={20}
                color={focused ? colors.accent : colors.textSecondary}
              />
              {focused ? (
                <Text style={[styles.label, { color: colors.accent }]} numberOfLines={1}>
                  {meta.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Space.sm,
  },
  bar: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  item: {
    flex: 1,
    height: 46,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  label: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
