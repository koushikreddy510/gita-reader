import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { CHAPTERS, getChapter, getVerse, searchVerses } from '@/data';
import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';

const POPULAR_REFS = ['2.47', '2.20', '4.7', '12.13', '18.66'];

export default function SearchScreen() {
  const router = useRouter();
  const { colors, scale } = useReadingTheme();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchVerses(query, 40), [query]);
  const trimmed = query.trim();

  const popular = useMemo(
    () => POPULAR_REFS.map((ref) => getVerse(ref)).filter((verse) => verse !== undefined),
    []
  );

  const themes = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const chapter of CHAPTERS) {
      for (const theme of chapter.themes) {
        if (!seen.has(theme)) {
          seen.add(theme);
          list.push(theme);
        }
      }
    }
    return list;
  }, []);

  const openVerse = (chapter: number, verse: number) => {
    tapFeedback();
    router.push({
      pathname: '/chapter/[number]',
      params: { number: String(chapter), verse: String(verse) },
    });
  };

  return (
    <ScreenShell
      title="Search"
      subtitle="Search Sanskrit, transliteration or translation"
      variant="plain"
      headerExtra={
        <View
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={17} color={colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="karma, शान्ति, duty, 2.47…"
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.text }]}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 ? (
            <Pressable accessibilityLabel="Clear search" hitSlop={8} onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={17} color={colors.textTertiary} />
            </Pressable>
          ) : null}
        </View>
      }>
      {trimmed.length < 2 ? (
        <FlatList
          data={popular}
          keyExtractor={(verse) => verse.ref}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.intro}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                BROWSE BY THEME
              </Text>
              <View style={styles.themeRow}>
                {themes.map((theme) => (
                  <Pressable
                    key={theme}
                    accessibilityRole="button"
                    onPress={() => setQuery(theme)}
                    style={({ pressed }) => [
                      styles.themeChip,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}>
                    <Text style={[styles.themeText, { color: colors.text }]}>{theme}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.sectionLabel, styles.spaced, { color: colors.textSecondary }]}>
                POPULAR VERSES
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ResultRow
              ref_={item.ref}
              chapterName={getChapter(item.chapter)?.english ?? ''}
              snippet={item.translations.editorial ?? item.iast}
              onPress={() => openVerse(item.chapter, item.verse)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: Space.sm }} />}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(hit) => hit.verse.ref}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {results.length === 0
                ? 'NO MATCHES'
                : `${results.length} ${results.length === 1 ? 'VERSE' : 'VERSES'}`}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search" size={26} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing found</Text>
              <Text
                style={[styles.emptyBody, { color: colors.textSecondary, fontSize: 13.5 * scale }]}>
                Try a Sanskrit word, a transliteration like “dharma”, or an English phrase. Only
                bundled verses are searchable so far.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ResultRow
              ref_={item.verse.ref}
              chapterName={getChapter(item.verse.chapter)?.english ?? ''}
              snippet={
                item.matchedField === 'sanskrit'
                  ? item.verse.devanagari.replace(/\n/g, ' ')
                  : (item.verse.translations.editorial ?? item.verse.iast)
              }
              isSanskrit={item.matchedField === 'sanskrit'}
              onPress={() => openVerse(item.verse.chapter, item.verse.verse)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: Space.sm }} />}
        />
      )}
    </ScreenShell>
  );
}

function ResultRow({
  ref_,
  chapterName,
  snippet,
  isSanskrit,
  onPress,
}: {
  ref_: string;
  chapterName: string;
  snippet: string;
  isSanskrit?: boolean;
  onPress: () => void;
}) {
  const { colors } = useReadingTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.result,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <View style={[styles.refChip, { backgroundColor: colors.accentSoft }]}>
        <Text style={[styles.refText, { color: colors.accent }]}>{ref_}</Text>
      </View>

      <View style={styles.resultText}>
        <Text
          numberOfLines={2}
          style={[
            isSanskrit ? styles.resultSanskrit : styles.resultSnippet,
            { color: colors.text },
          ]}>
          {snippet}
        </Text>
        <Text numberOfLines={1} style={[styles.resultMeta, { color: colors.textTertiary }]}>
          {chapterName}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingHorizontal: Space.md,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: { flex: 1, fontFamily: FontFamily.ui, fontSize: 15, paddingVertical: 0 },
  list: { paddingHorizontal: Layout.gutter, paddingTop: Space.lg, paddingBottom: Space.xxxl },
  intro: { gap: Space.sm },
  sectionLabel: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 11.5,
    letterSpacing: 1.1,
    marginBottom: Space.xs,
  },
  spaced: { marginTop: Space.xl },
  themeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  themeChip: {
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  themeText: { fontFamily: FontFamily.uiMedium, fontSize: 13 },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  refChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Space.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  refText: { fontFamily: FontFamily.uiSemibold, fontSize: 11.5 },
  resultText: { flex: 1, gap: 3 },
  resultSnippet: { fontFamily: FontFamily.serif, fontSize: 15, lineHeight: 21 },
  resultSanskrit: { fontFamily: FontFamily.devanagari, fontSize: 15, lineHeight: 26 },
  resultMeta: { fontFamily: FontFamily.ui, fontSize: 11.5 },
  empty: { alignItems: 'center', gap: Space.sm, paddingVertical: Space.xxxl },
  emptyTitle: { fontFamily: FontFamily.uiBold, fontSize: 17 },
  emptyBody: {
    fontFamily: FontFamily.ui,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
});
