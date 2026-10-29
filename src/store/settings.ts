/**
 * Reading preferences. Persisted to AsyncStorage so the app opens in exactly
 * the theme and size the reader left it in — no flash of a default theme.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_THEME_ID, type ReadingThemeId } from '@/constants/reading-themes';
import {
  DEFAULT_APP_LANGUAGE,
  DEFAULT_SCRIPT_MODE,
  DEFAULT_TEXT_SIZE,
  DEFAULT_TRANSLATION,
  type ScriptMode,
  type TextSizeId,
  type TranslationId,
} from '@/constants/settings-options';

type SettingsState = {
  themeId: ReadingThemeId;
  textSizeId: TextSizeId;
  translationId: TranslationId;
  scriptMode: ScriptMode;
  appLanguage: string;
  isPremium: boolean;
  /** User's choice to share anonymous usage and crash data. */
  analyticsEnabled: boolean;
  /** False until AsyncStorage has been read; the UI holds the splash until then. */
  hydrated: boolean;

  setTheme: (id: ReadingThemeId) => void;
  setTextSize: (id: TextSizeId) => void;
  setTranslation: (id: TranslationId) => void;
  setScriptMode: (mode: ScriptMode) => void;
  setAppLanguage: (id: string) => void;
  setPremium: (value: boolean) => void;
  setAnalyticsEnabled: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      themeId: DEFAULT_THEME_ID,
      textSizeId: DEFAULT_TEXT_SIZE,
      translationId: DEFAULT_TRANSLATION,
      scriptMode: DEFAULT_SCRIPT_MODE,
      appLanguage: DEFAULT_APP_LANGUAGE,
      isPremium: false,
      analyticsEnabled: true,
      hydrated: false,

      setTheme: (themeId) => set({ themeId }),
      setTextSize: (textSizeId) => set({ textSizeId }),
      setTranslation: (translationId) => set({ translationId }),
      setScriptMode: (scriptMode) => set({ scriptMode }),
      setAppLanguage: (appLanguage) => set({ appLanguage }),
      setPremium: (isPremium) => set({ isPremium }),
      setAnalyticsEnabled: (analyticsEnabled) => set({ analyticsEnabled }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'gita-settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // `hydrated` is runtime state; persisting it would come back as `true`
      // before storage has actually been read on the next launch.
      partialize: ({ hydrated: _hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);
