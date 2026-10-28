import { getTheme } from '@/constants/reading-themes';
import { getTextSize } from '@/constants/settings-options';
import { useSettings } from '@/store/settings';

/**
 * The single place components read colours and type scale from.
 *
 * `scale` is applied to reading and body copy only — headings keep their own
 * sizes so the layout doesn't reflow when someone picks Extra Large.
 */
export function useReadingTheme() {
  const themeId = useSettings((state) => state.themeId);
  const textSizeId = useSettings((state) => state.textSizeId);

  const theme = getTheme(themeId);
  const size = getTextSize(textSizeId);

  return {
    theme,
    colors: theme.colors,
    isLight: theme.isLight,
    scale: size.factor,
    sizeLabel: size.label,
  };
}
