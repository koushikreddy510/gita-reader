import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_500Medium,
} from '@expo-google-fonts/eb-garamond';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  NotoSerifDevanagari_400Regular,
  NotoSerifDevanagari_500Medium,
  NotoSerifDevanagari_600SemiBold,
} from '@expo-google-fonts/noto-serif-devanagari';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useReadingTheme } from '@/hooks/use-reading-theme';
import { useLibrary } from '@/store/library';
import { useSettings } from '@/store/settings';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    EBGaramond_400Regular,
    EBGaramond_400Regular_Italic,
    EBGaramond_500Medium,
    NotoSerifDevanagari_400Regular,
    NotoSerifDevanagari_500Medium,
    NotoSerifDevanagari_600SemiBold,
  });

  const settingsHydrated = useSettings((state) => state.hydrated);
  const libraryHydrated = useLibrary((state) => state.hydrated);
  const { colors, isLight } = useReadingTheme();

  // If a font fails to load we still show the app — unreadable Devanagari is
  // worse than a slightly wrong font, but a blank screen is worse than both.
  const ready = (fontsLoaded || Boolean(fontError)) && settingsHydrated && libraryHydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={isLight ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chapter/[number]" />
        <Stack.Screen name="highlights" />
        <Stack.Screen
          name="subscription"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
