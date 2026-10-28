import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type ListViewToken } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { VerseCard } from '@/components/verse-card';
import { getChapter, getVersesForChapter } from '@/data';
import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';
import { useLibrary } from '@/store/library';

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ number: string; verse?: string }>();
  const router = useRouter();
  const { colors, scale } = useReadingTheme();

  const chapterNumber = Number(params.number);
  const chapter = getChapter(chapterNumber);
  const verses = getVersesForChapter(chapterNumber);

  const listRef = useRef<FlatList<(typeof verses)[number]>>(null);

  const markRead = useLibrary((state) => state.markRead);
  const setLastRead = useLibrary((state) => state.setLastRead);

  const targetVerse = params.verse ? Number(params.verse) : undefined;

  // Remember where the reader is. Falls back to the first bundled verse when the
  // requested one is not in the corpus yet.
  useEffect(() => {
    if (!chapter) return;
    const start =
      targetVerse && verses.some((v) => v.verse === targetVerse) ? targetVerse : verses[0]?.verse;
    if (start) setLastRead(chapter.number, start);
  }, [chapter, targetVerse, verses, setLastRead]);

  // Jump to the verse the reader tapped. The list has variable row heights, so
  // scrollToIndex can fail before layout — onScrollToIndexFailed retries.
  useEffect(() => {
    if (!targetVerse) return;
    const index = verses.findIndex((verse) => verse.verse === targetVerse);
    if (index < 0) return;

    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0.05 });
    }, 120);
    return () => clearTimeout(timer);
  }, [targetVerse, verses]);

  // Stable identity is required by FlatList, and `markRead` is a stable store
  // action — so a plain useCallback is enough and avoids the ref-during-render
  // trap.
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ListViewToken[] }) => {
      for (const entry of viewableItems) {
        const item = entry.item as { ref?: string } | undefined;
        if (item?.ref) markRead(item.ref);
      }
    },
    [markRead]
  );

  // A verse counts as read only once it has been *fully* on screen for over a
  // second. A looser threshold marks several verses the instant a chapter
  // opens, which makes the "x of 47" counter look like it is inflating itself.
  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 100, minimumViewTime: 1200 }),
    []
  );

  if (!chapter) {
    return (
      <ScreenShell title="Not found" showBack variant="plain">
        <View style={styles.center}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No such chapter</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            The Gita has eighteen chapters.
          </Text>
        </View>
      </ScreenShell>
    );
  }

  const nextChapter = chapter.number < 18 ? getChapter(chapter.number + 1) : undefined;

  return (
    <ScreenShell
      showBack
      variant="plain"
      eyebrow={`Chapter ${chapter.number}`}
      title={chapter.transliteration}
      subtitle={chapter.english}>
      <FlatList
        ref={listRef}
        data={verses}
        keyExtractor={(verse) => verse.ref}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={({ index }) => {
          setTimeout(() => {
            listRef.current?.scrollToOffset({ offset: index * 280, animated: false });
          }, 90);
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.summary, { color: colors.textSecondary }]}>{chapter.summary}</Text>

            <View style={styles.themeRow}>
              {chapter.themes.map((theme) => (
                <View
                  key={theme}
                  style={[styles.themeChip, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.themeText, { color: colors.textSecondary }]}>{theme}</Text>
                </View>
              ))}
              <View style={[styles.themeChip, { backgroundColor: colors.accentSoft }]}>
                <Text style={[styles.themeText, { color: colors.accent }]}>
                  {verses.length} of {chapter.verseCount} bundled
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => <VerseCard verse={item} />}
        ItemSeparatorComponent={() => <View style={{ height: Space.md }} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="hourglass-outline" size={26} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Corpus pending</Text>
            <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
              None of chapter {chapter.number}&apos;s verses are bundled yet. They arrive with the
              corpus import — the layout is ready for them.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={[styles.footerNote, { color: colors.textTertiary, fontSize: 12 * scale }]}>
              Long-press any verse to highlight it.
            </Text>

            {nextChapter ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  tapFeedback();
                  router.push({
                    pathname: '/chapter/[number]',
                    params: { number: String(nextChapter.number) },
                  });
                }}
                style={({ pressed }) => [
                  styles.nextButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}>
                <View style={styles.nextText}>
                  <Text style={[styles.nextLabel, { color: colors.textTertiary }]}>
                    NEXT · CHAPTER {nextChapter.number}
                  </Text>
                  <Text style={[styles.nextTitle, { color: colors.text }]}>
                    {nextChapter.transliteration}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={colors.accent} />
              </Pressable>
            ) : null}
          </View>
        }
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Space.lg,
    paddingBottom: Space.xxxl,
  },
  header: { gap: Space.md, marginBottom: Space.lg },
  summary: { fontFamily: FontFamily.serif, fontSize: 16.5, lineHeight: 25 },
  themeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  themeChip: {
    paddingHorizontal: Space.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  themeText: { fontFamily: FontFamily.uiMedium, fontSize: 11.5, letterSpacing: 0.2 },
  emptyCard: { alignItems: 'center', gap: Space.sm, paddingVertical: Space.xxxl },
  emptyTitle: { fontFamily: FontFamily.uiBold, fontSize: 17 },
  emptyBody: {
    fontFamily: FontFamily.ui,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Space.sm },
  footer: { marginTop: Space.xl, gap: Space.lg },
  footerNote: { textAlign: 'center' },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  nextText: { flex: 1, gap: 3 },
  nextLabel: { fontFamily: FontFamily.uiSemibold, fontSize: 10.5, letterSpacing: 1 },
  nextTitle: { fontFamily: FontFamily.uiSemibold, fontSize: 15 },
});
