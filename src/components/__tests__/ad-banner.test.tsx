/**
 * The banner must be invisible unless every condition for showing an ad holds:
 * consent/SDK ready, not Premium, and a placement that allows ads.
 */

import { render, screen } from '@testing-library/react-native';

import { AdBanner } from '@/components/ad-banner';
import { useAdsReady } from '@/lib/ads';
import { useSettings } from '@/store/settings';

jest.mock('react-native-google-mobile-ads', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factories run before imports
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: () => ({ initialize: jest.fn() }),
    AdsConsent: { gatherConsent: jest.fn(), getConsentInfo: jest.fn() },
    AdsConsentPrivacyOptionsRequirementStatus: { REQUIRED: 'REQUIRED' },
    TestIds: { ADAPTIVE_BANNER: 'test-unit' },
    BannerAdSize: { LARGE_ANCHORED_ADAPTIVE_BANNER: 'LARGE_ANCHORED_ADAPTIVE_BANNER' },
    BannerAd: ({ unitId, size }: { unitId: string; size: string }) => (
      <Text testID="banner">{`${unitId}|${size}`}</Text>
    ),
  };
});

beforeEach(() => {
  useAdsReady.setState({ ready: true, privacyOptionsRequired: false });
  useSettings.setState({ isPremium: false });
});

it('shows the banner once ads are ready for a free user', async () => {
  await render(<AdBanner placement="home" />);

  expect(screen.getByTestId('banner')).toHaveTextContent(
    'test-unit|LARGE_ANCHORED_ADAPTIVE_BANNER',
  );
});

it('renders nothing before consent and SDK initialisation finish', async () => {
  useAdsReady.setState({ ready: false, privacyOptionsRequired: false });

  await render(<AdBanner placement="home" />);

  expect(screen.queryByTestId('banner')).toBeNull();
});

it('renders nothing for Premium users', async () => {
  useSettings.setState({ isPremium: true });

  await render(<AdBanner placement="home" />);

  expect(screen.queryByTestId('banner')).toBeNull();
});
