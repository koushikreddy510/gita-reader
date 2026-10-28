import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { ProgressBar } from '@/components/progress-bar';
import { ScreenShell } from '@/components/screen-shell';
import { CHAPTERS, TOTAL_VERSES, getLoadedCount, getVersesForChapter } from '@/data';
import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';
import { useLibrary } from '@/store/library';

const COLUMNS = 6;
const CHIP_GAP = 8;
const CARD_PADDING = 14;

export default function ChaptersScreen() {
  const router = useRouter();
  const { colors } = useReadingTheme();
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<number[]>([1]);

  const read = useLibrary((state) => state.read);

  // Any verse keyed by "3.42" belongs to chapter 3 — cheaper than a selector
  // per chapter, and the list only re-renders when a verse is first opened.
  const readByChapter = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const ref of Object.keys(read)) {
      const chapter = Number(ref.split('.')[0]);
      if (Number.isFinite(chapter)) counts[chapter] = (counts[chapter] ?? 0) + 1;
    }
    return counts;
  }, [read]);

  const needle = query.trim().toLowerCase();
  const chapters = useMemo(() => {
    if (!needle) return CHAPTERS;
    return CHAPTERS.filter(
      (chapter) =>
        chapter.transliteration.toLowerCase().includes(needle) ||
        chapter.english.toLowerCase().includes(needle) ||
        String(chapter.number) === needle ||
        chapter.themes.some((theme) => theme.includes(needle))
    );
  }, [needle]);

  const availableGridWidth = Math.min(width, Layout.maxContentWidth);
  const gridWidth = availableGridWidth - Layout.gutter * 2 - CARD_PADDING * 2;
  // Floor, not round: fractional chip widths overflow by a pixel per column and
  // push the last chip onto a new row.
  const chipWidth = Math.floor((gridWidth - CHIP_GAP * (COLUMNS - 1)) / COLUMNS);

  const toggle = (number: number) => {
    tapFeedback();
    setExpanded((current) =>
      current.includes(number) ? current.filter((n) => n !== number) : [...current, number]
    );
  };

  return (
    <ScreenShell
      title="Chapters"
      subtitle={`${CHAPTERS.length} chapters · ${TOTAL_VERSES} verses`}
      variant="plain"
      headerExtra={
        <View
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search chapters, themes…"
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.text }]}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable accessibilityLabel="Clear search" hitSlop={8} onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
            </Pressable>
          ) : null}
        </View>
      }>
      <FlatList
        data={chapters}
        keyExtractor={(chapter) => String(chapter.number)}
        // Eighteen rows is nothing to mount, and virtualising them means the last
        // chapters can stay unrendered until a scroll event arrives — which never
        // happens on web when the tab is backgrounded. Render them all.
        initialNumToRender={CHAPTERS.length}
        contentContainerStyle={[styles.list, { paddingBottom: Space.xxxl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No chapter matches “{query.trim()}”.
          </Text>
        }
        renderItem={({ item: chapter }) => {
          const isOpen = expanded.includes(chapter.number);
          const readCount = readByChapter[chapter.number] ?? 0;
          const loaded = getLoadedCount(chapter.number);
          const loadedVerses = getVersesForChapter(chapter.number);
          const loadedNumbers = new Set(loadedVerses.map((verse) => verse.verse));

          return (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={`Chapter ${chapter.number}, ${chapter.english}`}
                onPress={() => toggle(chapter.number)}
                style={styles.header}>
                <View style={[styles.numberBadge, { backgroundColor: colors.accentSoft }]}>
                  <Text style={[styles.numberText, { color: colors.accent }]}>
                    {chapter.number}
                  </Text>
                </View>

                <View style={styles.headerText}>
                  <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
                    {chapter.transliteration}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {chapter.english}
                  </Text>
                </View>

                <Text style={[styles.count, { color: colors.textTertiary }]}>
                  {readCount}/{chapter.verseCount} read
                </Text>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textTertiary}
                />
              </Pressable>

              <View style={styles.progressWrap}>
                <ProgressBar
                  value={chapter.verseCount ? readCount / chapter.verseCount : 0}
                  height={4}
                />
              </View>

              {isOpen ? (
                <View style={styles.body}>
                  <View style={styles.grid}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Chapter ${chapter.number} introduction`}
                      onPress={() => {
                        tapFeedback();
                        router.push({
                          pathname: '/chapter/[number]',
                          params: { number: String(chapter.number) },
                        });
                      }}
                      style={({ pressed }) => [
                        styles.chip,
                        {
                          width: chipWidth,
                          backgroundColor: colors.accentSoft,
                          borderColor: 'transparent',
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}>
                      <Text style={[styles.chipIntro, { color: colors.accent }]}>Intro</Text>
                    </Pressable>

                    {Array.from({ length: chapter.verseCount }, (_, index) => index + 1).map(
                      (verseNumber) => {
                        const isLoaded = loadedNumbers.has(verseNumber);
                        const isRead = Object.prototype.hasOwnProperty.call(
                          read,
                          `${chapter.number}.${verseNumber}`
                        );

                        return (
                          <Pressable
                            key={verseNumber}
                            accessibilityRole="button"
                            accessibilityLabel={`Verse ${chapter.number}.${verseNumber}${
                              isLoaded ? '' : ', not bundled yet'
                            }`}
                            accessibilityState={{ disabled: !isLoaded, selected: isRead }}
                            disabled={!isLoaded}
                            onPress={() => {
                              tapFeedback();
                              router.push({
                                pathname: '/chapter/[number]',
                                params: {
                                  number: String(chapter.number),
                                  verse: String(verseNumber),
                                },
                              });
                            }}
                            style={({ pressed }) => [
                              styles.chip,
                              {
                                width: chipWidth,
                                backgroundColor: isRead
                                  ? colors.accentSoft
                                  : isLoaded
                                    ? colors.surfaceAlt
                                    : 'transparent',
                                borderColor: isRead
                                  ? `${colors.accent}55`
                                  : isLoaded
                                    ? 'transparent'
                                    : colors.border,
                                opacity: pressed && isLoaded ? 0.6 : 1,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.chipText,
                                {
                                  color: isRead
                                    ? colors.accent
                                    : isLoaded
                                      ? colors.textSecondary
                                      : colors.textTertiary,
                                },
                              ]}>
                              {verseNumber}
                            </Text>
                          </Pressable>
                        );
                      }
                    )}
                  </View>

                  <Text style={[styles.bodyNote, { color: colors.textTertiary }]}>
                    {loaded < chapter.verseCount
                      ? `${loaded} of ${chapter.verseCount} verses bundled · dimmed chips arrive with the corpus import`
                      : chapter.summary}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingHorizontal: Space.md,
    height: 46,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: { flex: 1, fontFamily: FontFamily.ui, fontSize: 15, paddingVertical: 0 },
  list: { paddingHorizontal: Layout.gutter, paddingTop: Space.md, gap: Space.md },
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: CARD_PADDING,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontFamily: FontFamily.uiBold, fontSize: 16 },
  headerText: { flex: 1, gap: 2 },
  title: { fontFamily: FontFamily.uiSemibold, fontSize: 15.5, letterSpacing: -0.2 },
  subtitle: { fontFamily: FontFamily.ui, fontSize: 12.5 },
  count: { fontFamily: FontFamily.uiMedium, fontSize: 12 },
  progressWrap: { marginTop: Space.md },
  body: { marginTop: Space.md, gap: Space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: CHIP_GAP },
  chip: {
    height: 44,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { fontFamily: FontFamily.uiSemibold, fontSize: 14 },
  chipIntro: { fontFamily: FontFamily.uiBold, fontSize: 11.5, letterSpacing: 0.2 },
  bodyNote: { fontFamily: FontFamily.ui, fontSize: 11.5, lineHeight: 17 },
  empty: {
    fontFamily: FontFamily.ui,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: Space.xxxl,
  },
});
