import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptics are a nice-to-have that must never throw. On web and on devices with
 * the setting disabled these calls reject or no-op, so every call is swallowed.
 */

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export function tapFeedback() {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function selectFeedback() {
  if (!enabled) return;
  Haptics.selectionAsync().catch(() => {});
}

export function successFeedback() {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
