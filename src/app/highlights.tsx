import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { VerseCard } from '@/components/verse-card';
import { getVerse } from '@/data';
import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';
import { useLibrary } from '@/store/library';

type Tab = 'highlights' | 'bookmarks';

export default function SavedScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const router = useRouter();
  const { colors } = useReadingTheme();

  const [tab, setTab] = useState<Tab>(params.tab === 'bookmarks' ? 'bookmarks' : 'highlights');

  const highlights = useLibrary((state) => state.highlights);
  const bookmarks = useLibrary((state) => state.bookmarks);

  const verses = useMemo(() => {
    const refs =
      tab === 'highlights'
        ? Object.values(highlights)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((highlight) => highlight.ref)
        : Object.entries(bookmarks)
            .sort((a, b) => b[1] - a[1])
            .map(([ref]) => ref);

    return refs.map((ref) => getVerse(ref)).filter((verse) => verse !== undefined);
  }, [tab, highlights, bookmarks]);

  const isEmpty = verses.length === 0;

  return (
    <ScreenShell
      showBack
      variant="plain"
      title="Saved"
      subtitle={`${Object.keys(highlights).length} highlights · ${Object.keys(bookmarks).length} bookmarks`}>
      <View style={styles.segmentWrap}>
        <View style={[styles.segment, { backgroundColor: colors.surfaceAlt }]}>
          {(['highlights', 'bookmarks'] as const).map((value) => {
            const active = tab === value;
            return (
              <Pressable
                key={value}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  tapFeedback();
                  setTab(value);
                }}
                style={[styles.segmentItem, active && { backgroundColor: colors.sheet }]}>
                <Text
                  style={[
                    styles.segmentLabel,
                    { color: active ? colors.text : colors.textSecondary },
                  ]}>
                  {value === 'highlights' ? 'Highlights' : 'Bookmarks'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons
              name={tab === 'highlights' ? 'color-wand-outline' : 'bookmark-outline'}
              size={26}
              color={colors.accent}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {tab === 'highlights' ? 'No Highlights Yet' : 'No Bookmarks Yet'}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            {tab === 'highlights'
              ? 'Long press any verse in the reader to highlight it with beautiful colours and build your personal scripture library.'
              : 'Tap the bookmark icon on any verse to keep it close.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              tapFeedback();
              router.push('/chapters');
            }}
            style={({ pressed }) => [
              styles.emptyButton,
              { backgroundColor: colors.accent, opacity: pressed ? 0.75 : 1 },
            ]}>
            <Ionicons name="arrow-back" size={16} color={colors.accentText} />
            <Text style={[styles.emptyButtonLabel, { color: colors.accentText }]}>
              Go to chapters
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={verses}
          keyExtractor={(verse) => verse.ref}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <VerseCard verse={item} />}
          ItemSeparatorComponent={() => <View style={{ height: Space.md }} />}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  segmentWrap: { paddingHorizontal: Layout.gutter, paddingTop: Space.sm },
  segment: { flexDirection: 'row', padding: 4, borderRadius: Radius.pill },
  segmentItem: {
    flex: 1,
    height: 38,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLabel: { fontFamily: FontFamily.uiSemibold, fontSize: 13.5 },
  list: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Space.lg,
    paddingBottom: Space.xxxl,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.md,
    padding: Space.xl,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontFamily: FontFamily.uiBold, fontSize: 21, letterSpacing: -0.4 },
  emptyBody: {
    fontFamily: FontFamily.ui,
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingHorizontal: Space.xl,
    paddingVertical: Space.md,
    borderRadius: Radius.md,
    marginTop: Space.sm,
  },
  emptyButtonLabel: { fontFamily: FontFamily.uiSemibold, fontSize: 15 },
});
