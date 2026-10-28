import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppLanguageSheet,
  ScriptSheet,
  TextSizeSheet,
  ThemeSheet,
  TranslationSheet,
} from '@/components/pickers';
import { ScreenShell, useScreenContentPadding } from '@/components/screen-shell';
import { SectionLabel, SettingsGroup, SettingsRow } from '@/components/settings-row';
import { CHAPTERS, TOTAL_VERSES, VERSES } from '@/data';
import { getTheme } from '@/constants/reading-themes';
import { getAppLanguage, getTextSize, getTranslation } from '@/constants/settings-options';
import { FontFamily, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';
import { useLibrary } from '@/store/library';
import { useSettings } from '@/store/settings';

type SheetName = 'theme' | 'textSize' | 'translation' | 'script' | 'language' | null;

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useReadingTheme();
  const contentPadding = useScreenContentPadding(true);

  const settings = useSettings();
  const resetLibrary = useLibrary((state) => state.reset);
  const readCount = useLibrary((state) => Object.keys(state.read).length);
  const highlightCount = useLibrary((state) => Object.keys(state.highlights).length);
  const bookmarkCount = useLibrary((state) => Object.keys(state.bookmarks).length);

  const [sheet, setSheet] = useState<SheetName>(null);

  const theme = getTheme(settings.themeId);
  const textSize = getTextSize(settings.textSizeId);
  const translation = getTranslation(settings.translationId);
  const appLanguage = getAppLanguage(settings.appLanguage);

  const scriptLabel =
    settings.scriptMode === 'both' ? 'द+A' : settings.scriptMode === 'iast' ? 'IAST' : 'देव';

  return (
    <ScreenShell title="Settings" subtitle="Reading, language and study preferences">
      <ScrollView
        contentContainerStyle={[styles.content, contentPadding]}
        showsVerticalScrollIndicator={false}>
        {/* Profile --------------------------------------------------------- */}
        <View
          style={[styles.profile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.avatarLetter, { color: colors.accent }]}>गी</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: colors.text }]}>Reader</Text>
            <Text style={[styles.profileMeta, { color: colors.textSecondary }]}>
              {readCount} verses read · {highlightCount} highlights · {bookmarkCount} saved
            </Text>
          </View>
        </View>

        {/* Premium --------------------------------------------------------- */}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            tapFeedback();
            router.push('/subscription');
          }}
          style={({ pressed }) => [
            styles.premium,
            {
              backgroundColor: `${colors.gold}0F`,
              borderColor: `${colors.gold}80`,
              opacity: pressed ? 0.75 : 1,
            },
          ]}>
          <View style={[styles.premiumIcon, { backgroundColor: `${colors.gold}1F` }]}>
            <Ionicons name="star" size={18} color={colors.gold} />
          </View>

          <View style={styles.premiumText}>
            <View style={styles.premiumTitleRow}>
              <Text style={[styles.premiumTitle, { color: colors.text }]}>
                {settings.isPremium ? 'Premium Active' : 'Unlock Premium'}
              </Text>
              <View style={[styles.proBadge, { backgroundColor: colors.gold }]}>
                <Text style={[styles.proBadgeText, { color: '#1A1206' }]}>PRO</Text>
              </View>
            </View>
            <Text style={[styles.premiumSubtitle, { color: colors.textSecondary }]}>
              {settings.isPremium
                ? 'Thank you for supporting the app'
                : 'Ad-free, offline translations & study tools'}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={17} color={colors.gold} />
        </Pressable>

        {/* Settings -------------------------------------------------------- */}
        <SectionLabel>Settings & Info</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            icon="bookmark-outline"
            title="Saved Verses & Highlights"
            subtitle={`${highlightCount + bookmarkCount} items`}
            onPress={() => router.push('/highlights')}
          />
          <SettingsRow
            icon="color-palette-outline"
            title="Theme & Colors"
            subtitle={theme.isLight ? 'Light reading surface' : 'Low-light reading surface'}
            value={theme.name.split(' / ')[0]}
            onPress={() => setSheet('theme')}
          />
          <SettingsRow
            icon="language-outline"
            title="Translation"
            subtitle={translation.name}
            value={translation.badge}
            onPress={() => setSheet('translation')}
          />
          <SettingsRow
            icon="text-outline"
            title="Script"
            subtitle="How Sanskrit is displayed"
            value={scriptLabel}
            onPress={() => setSheet('script')}
          />
          <SettingsRow
            icon="globe-outline"
            title="App Language"
            subtitle={appLanguage.name}
            value={appLanguage.code}
            onPress={() => setSheet('language')}
          />
          <SettingsRow
            icon="resize-outline"
            title="Text Size"
            subtitle={textSize.subtitle}
            value={textSize.name.split(' ')[0]}
            onPress={() => setSheet('textSize')}
          />
          <SettingsRow
            icon="star-outline"
            title="Rate App"
            last
            onPress={() =>
              Alert.alert('Rate App', 'Store review prompts arrive once the app is published.')
            }
          />
        </SettingsGroup>

        {/* Content --------------------------------------------------------- */}
        <View style={styles.sectionGap}>
          <SectionLabel>Content</SectionLabel>
        </View>
        <SettingsGroup>
          <SettingsRow
            icon="library-outline"
            title="Corpus"
            subtitle={`${VERSES.length} of ${TOTAL_VERSES} verses bundled`}
            showChevron={false}
          />
          <SettingsRow
            icon="list-outline"
            title="Chapters"
            subtitle={`${CHAPTERS.length} chapters`}
            showChevron={false}
            last
          />
        </SettingsGroup>

        {/* Local data ------------------------------------------------------ */}
        <View style={styles.sectionGap}>
          <SectionLabel>This Device</SectionLabel>
        </View>
        <SettingsGroup>
          <SettingsRow
            icon="trash-outline"
            title="Clear Reading Data"
            subtitle="Highlights, bookmarks and progress"
            showChevron={false}
            last
            onPress={() =>
              Alert.alert(
                'Clear reading data?',
                'This removes every highlight, bookmark and progress mark stored on this device. It cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                      resetLibrary();
                      Alert.alert('Cleared', 'Your local reading data has been removed.');
                    },
                  },
                ]
              )
            }
          />
        </SettingsGroup>

        <Text style={[styles.version, { color: colors.textTertiary }]}>
          Gita Reader {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </ScrollView>

      <ThemeSheet visible={sheet === 'theme'} onClose={() => setSheet(null)} />
      <TextSizeSheet visible={sheet === 'textSize'} onClose={() => setSheet(null)} />
      <TranslationSheet visible={sheet === 'translation'} onClose={() => setSheet(null)} />
      <ScriptSheet visible={sheet === 'script'} onClose={() => setSheet(null)} />
      <AppLanguageSheet visible={sheet === 'language'} onClose={() => setSheet(null)} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { gap: Space.md },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.lg,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontFamily: FontFamily.devanagariSemibold, fontSize: 20 },
  profileText: { flex: 1, gap: 3 },
  profileName: { fontFamily: FontFamily.uiBold, fontSize: 19, letterSpacing: -0.4 },
  profileMeta: { fontFamily: FontFamily.ui, fontSize: 12.5 },
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  premiumIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: { flex: 1, gap: 3 },
  premiumTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  premiumTitle: { fontFamily: FontFamily.uiBold, fontSize: 16.5, letterSpacing: -0.3 },
  proBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  proBadgeText: { fontFamily: FontFamily.uiBold, fontSize: 10, letterSpacing: 0.6 },
  premiumSubtitle: { fontFamily: FontFamily.ui, fontSize: 12.5 },
  sectionGap: { marginTop: Space.lg },
  version: {
    fontFamily: FontFamily.ui,
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: Space.xl,
  },
});
