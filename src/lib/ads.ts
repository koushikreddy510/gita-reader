import mobileAds, {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
  TestIds,
} from 'react-native-google-mobile-ads';
import { create } from 'zustand';

/**
 * Ad configuration. AdMob IDs are client-side identifiers, not secrets.
 *
 * Debug builds always use Google's test unit so we can never click or
 * impress a live ad while developing. Release builds use the real Home banner
 * unit; EXPO_PUBLIC_ADMOB_HOME_BANNER_ID overrides it.
 * The App ID lives in app.json under the react-native-google-mobile-ads plugin.
 */
export const adsConfig = {
  /** Ads are limited to discovery surfaces; never place them in chapter reading. */
  placements: {
    home: true,
  },
  unitIds: {
    home: __DEV__
      ? TestIds.ADAPTIVE_BANNER
      : (process.env.EXPO_PUBLIC_ADMOB_HOME_BANNER_ID ?? 'ca-app-pub-1830143198859206/6313077077'),
  },
};

export type AdPlacement = keyof typeof adsConfig.placements;

type AdsState = {
  /** True once consent has been resolved and the Mobile Ads SDK is initialised. */
  ready: boolean;
  /** True where the user must be able to reopen their consent choice (EEA/UK/CH). */
  privacyOptionsRequired: boolean;
  /** True once the consent status for this launch is known (even if ads are off). */
  consentResolved: boolean;
};

export const useAdsReady = create<AdsState>(() => ({
  ready: false,
  privacyOptionsRequired: false,
  consentResolved: false,
}));

let started = false;

async function initializeIfAllowed() {
  const { canRequestAds, privacyOptionsRequirementStatus } = await AdsConsent.getConsentInfo();
  useAdsReady.setState({
    privacyOptionsRequired:
      privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED,
    consentResolved: true,
  });
  // Re-check after the await: another call may have started the SDK meanwhile.
  if (!canRequestAds || started) return;
  started = true;
  await mobileAds().initialize();
  useAdsReady.setState({ ready: true });
}

/**
 * Gathers UMP consent (shows Google's form where required, e.g. EEA/UK), then
 * initialises the SDK. Safe to call once at app start; failures leave ads off.
 */
export function startAds() {
  AdsConsent.gatherConsent()
    .catch(() => {})
    // Even when gathering fails, the UMP SDK may hold last session's consent.
    .then(initializeIfAllowed)
    .catch(() => {});
}

/** Reopens Google's consent form so the user can change or withdraw their choice. */
export async function showPrivacyOptions() {
  await AdsConsent.showPrivacyOptionsForm();
  await initializeIfAllowed();
}
