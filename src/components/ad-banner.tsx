import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { Layout } from '@/constants/theme';
import { adsConfig, useAdsReady, type AdPlacement } from '@/lib/ads';
import { useSettings } from '@/store/settings';

type Props = {
  placement: AdPlacement;
};

/**
 * The single AdMob banner. Stays out of the reader, waits for consent and SDK
 * initialisation, and disappears for Premium.
 */
export function AdBanner({ placement }: Props) {
  const isPremium = useSettings((state) => state.isPremium);
  const ready = useAdsReady((state) => state.ready);

  if (isPremium || !ready || !adsConfig.placements[placement]) return null;

  return (
    <View accessibilityLabel="Advertisement" style={styles.container}>
      <BannerAd
        unitId={adsConfig.unitIds[placement]}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Adaptive banners size to the full screen width, so cancel the screen gutter.
  container: { alignItems: 'center', marginHorizontal: -Layout.gutter },
});
