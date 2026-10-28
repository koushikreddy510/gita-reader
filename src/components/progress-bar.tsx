import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';

type Props = {
  /** 0–1 */
  value: number;
  height?: number;
  tint?: string;
};

export function ProgressBar({ value, height = 6, tint }: Props) {
  const { colors } = useReadingTheme();
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      style={[styles.track, { height, backgroundColor: colors.surfaceAlt, borderRadius: height }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: tint ?? colors.accent,
            borderRadius: height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden', borderRadius: Radius.pill },
  fill: { height: '100%' },
});
