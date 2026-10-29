import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '@/components/progress-bar';
import { ScreenShell, useScreenContentPadding } from '@/components/screen-shell';
import { VerseCard } from '@/components/verse-card';
import { AdBanner } from '@/components/ad-banner';
import { CHAPTERS, TOTAL_VERSES, VERSES, getChapter, getVerseOfTheDay } from '@/data';
import { FontFamily, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';
import { formatShortDate } from '@/lib/format';
import { useLibrary } from '@/store/library';
import { useSettings } from '@/store/settings';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useReadingTheme();
  const contentPadding = useScreenContentPadding(true);

  const isPremium = useSettings((state) => state.isPremium);

  const lastRead = useLibrary((state) => state.lastRead);
  const readCount = useLibrary((state) => Object.keys(state.read).length);
  const highlightCount = useLibrary((state) => Object.keys(state.highlights).length);
  const bookmarkCount = useLibrary((state) => Object.keys(state.bookmarks).length);

  // Recomputed only when the screen mounts; a day boundary mid-session is not
  // worth a timer that would re-render the whole feed.
  const daily = useMemo(() => getVerseOfTheDay(), []);

  const continueChapter = lastRead ? getChapter(lastRead.chapter) : undefined;
  const overallProgress = readCount / TOTAL_VERSES;

  return (
    <ScreenShell
      title="Bhagavad Gita"
      subtitle={`${CHAPTERS.length} chapters · ${TOTAL_VERSES} verses`}
      right={
        isPremium ? (
          <View style={[styles.crownPill, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name="star" size={12} color={colors.gold} />
            <Text style={[styles.crownText, { color: colors.gold }]}>PRO</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Unlock premium"
            onPress={() => {
              tapFeedback();
              router.push('/subscription');
            }}
            style={({ pressed }) => [
              styles.crownButton,
              {
                borderColor: `${colors.gold}66`,
                backgroundColor: `${colors.gold}14`,
                opacity: pressed ? 0.6 : 1,
              },
            ]}>
            <Ionicons name="star" size={16} color={colors.gold} />
          </Pressable>
        )
      }>
      <ScrollView
        contentContainerStyle={[styles.content, contentPadding]}
        showsVerticalScrollIndicator={false}>
        {/* Continue reading ------------------------------------------------- */}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            tapFeedback();
            if (lastRead)
              router.push({
                pathname: '/chapter/[number]',
                params: { number: String(lastRead.chapter), verse: String(lastRead.verse) },
              });
            else router.push({ pathname: '/chapter/[number]', params: { number: '1' } });
          }}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.eyebrow, { color: colors.textTertiary }]}>
              {lastRead ? 'CONTINUE READING' : 'BEGIN HERE'}
            </Text>
            <Ionicons name="arrow-forward" size={15} color={colors.accent} />
          </View>

          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {continueChapter ? continueChapter.transliteration : getChapter(1)?.transliteration}
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            {continueChapter
              ? `Chapter ${continueChapter.number} · ${continueChapter.english}`
              : 'The Despondency of Arjuna'}
          </Text>

          <View style={styles.progressBlock}>
            <ProgressBar
              value={
                continueChapter && lastRead && continueChapter.verseCount > 0
                  ? lastRead.verse / continueChapter.verseCount
                  : 0
              }
            />
            <Text style={[styles.caption, { color: colors.textTertiary }]}>
              {lastRead
                ? `Verse ${lastRead.verse} of ${continueChapter?.verseCount ?? 0}`
                : `${readCount} of ${TOTAL_VERSES} verses read`}
            </Text>
          </View>
        </Pressable>

        {/* Shloka of the day ----------------------------------------------- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Shloka of the Day</Text>
          <Text style={[styles.sectionMeta, { color: colors.textTertiary }]}>
            {formatShortDate()}
          </Text>
        </View>

        <VerseCard verse={daily} />

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            tapFeedback();
            router.push({
              pathname: '/chapter/[number]',
              params: { number: String(daily.chapter), verse: String(daily.verse) },
            });
          }}
          style={({ pressed }) => [
            styles.textButton,
            { backgroundColor: colors.accentSoft, opacity: pressed ? 0.7 : 1 },
          ]}>
          <Text style={[styles.textButtonLabel, { color: colors.accent }]}>Read in context</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.accent} />
        </Pressable>

        {/* Progress -------------------------------------------------------- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
        </View>

        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{readCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>read</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.hairline }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{highlightCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>highlighted</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.hairline }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{bookmarkCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>saved</Text>
            </View>
          </View>

          <ProgressBar value={overallProgress} height={8} />
          <Text style={[styles.caption, { color: colors.textTertiary }]}>
            {Math.round(overallProgress * 100)}% of the Gita
          </Text>
        </View>

        {/* Shortcuts ------------------------------------------------------- */}
        <View style={styles.shortcutRow}>
          <Shortcut
            icon="color-wand-outline"
            label="Highlights"
            count={highlightCount}
            onPress={() => router.push('/highlights')}
          />
          <Shortcut
            icon="bookmark-outline"
            label="Saved"
            count={bookmarkCount}
            onPress={() => router.push('/highlights?tab=bookmarks')}
          />
        </View>

        <AdBanner placement="home" />

        {VERSES.length < TOTAL_VERSES ? (
          <View
            style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textTertiary} />
            <Text style={[styles.noteText, { color: colors.textTertiary }]}>
              {VERSES.length} of {TOTAL_VERSES} verses are bundled so far. The rest arrive with the
              corpus import.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </ScreenShell>
  );
}

function Shortcut({
  icon,
  label,
  count,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  count: number;
  onPress: () => void;
}) {
  const { colors } = useReadingTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.shortcut,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <Ionicons name={icon} size={19} color={colors.accent} />
      <Text style={[styles.shortcutLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.shortcutCount, { color: colors.textTertiary }]}>{count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: Space.md },
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Space.lg,
    gap: Space.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontFamily: FontFamily.serifMedium,
    fontSize: 24,
    letterSpacing: -0.3,
    marginTop: Space.xs,
  },
  cardSubtitle: { fontFamily: FontFamily.ui, fontSize: 13.5 },
  progressBlock: { marginTop: Space.sm, gap: 6 },
  caption: { fontFamily: FontFamily.ui, fontSize: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: Space.lg,
    marginBottom: Space.xs,
  },
  sectionTitle: {
    fontFamily: FontFamily.uiBold,
    fontSize: 19,
    letterSpacing: -0.4,
  },
  sectionMeta: { fontFamily: FontFamily.uiMedium, fontSize: 12.5 },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Space.md,
    borderRadius: Radius.md,
  },
  textButtonLabel: { fontFamily: FontFamily.uiSemibold, fontSize: 14 },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Space.md,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: FontFamily.uiBold, fontSize: 22, letterSpacing: -0.6 },
  statLabel: { fontFamily: FontFamily.ui, fontSize: 11.5 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 26 },
  shortcutRow: { flexDirection: 'row', gap: Space.md, marginTop: Space.xs },
  shortcut: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    padding: Space.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  shortcutLabel: { fontFamily: FontFamily.uiSemibold, fontSize: 14, flex: 1 },
  shortcutCount: { fontFamily: FontFamily.uiSemibold, fontSize: 13 },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.sm,
    padding: Space.md,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: Space.md,
  },
  noteText: { flex: 1, fontFamily: FontFamily.ui, fontSize: 12, lineHeight: 17 },
  crownButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  crownText: { fontFamily: FontFamily.uiBold, fontSize: 11, letterSpacing: 0.6 },
});
