import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/**
 * Bottom sheet used by every preference picker.
 *
 * Deliberately a plain Modal rather than a gesture library: each sheet is a
 * short list of options, so there is nothing to drag and no reason to add a
 * dependency that has to be kept in step with reanimated.
 */
export function Sheet({ visible, onClose, title, subtitle, children }: Props) {
  const { colors } = useReadingTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={[styles.panel, { backgroundColor: colors.sheet }]}>
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              {subtitle ? (
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={onClose}
              style={({ pressed }) => [
                styles.close,
                { backgroundColor: colors.surfaceAlt, opacity: pressed ? 0.6 : 1 },
              ]}>
              <Ionicons name="close" size={17} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Math.max(insets.bottom, Space.lg) + Space.lg },
            ]}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
  },
  panel: {
    maxHeight: '88%',
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
    paddingTop: Space.sm,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: Radius.pill,
    alignSelf: 'center',
    marginBottom: Space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
    paddingHorizontal: Layout.gutter,
    paddingBottom: Space.lg,
  },
  headerText: { flex: 1, gap: 4 },
  title: { fontFamily: FontFamily.uiBold, fontSize: 22, letterSpacing: -0.5 },
  subtitle: { fontFamily: FontFamily.ui, fontSize: 14, lineHeight: 20 },
  close: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: Layout.gutter, gap: Space.sm },
});
