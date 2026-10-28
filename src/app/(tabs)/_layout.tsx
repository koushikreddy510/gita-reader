import { Tabs } from 'expo-router/js-tabs';

import { BottomNav } from '@/components/bottom-nav';
import { useReadingTheme } from '@/hooks/use-reading-theme';

export default function TabsLayout() {
  const { colors } = useReadingTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
      tabBar={(props) => <BottomNav {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="chapters" options={{ title: 'Read' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
