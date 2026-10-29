/**
 * The ads module decides when the Mobile Ads SDK may start. Policy requires
 * consent to be resolved first, so the order of calls is what these tests pin.
 */

const TEST_UNIT = 'ca-app-pub-3940256099942544/9214589741';
const REAL_UNIT = 'ca-app-pub-1830143198859206/6313077077';

const mockInitialize = jest.fn(() => Promise.resolve([]));
const mockGatherConsent = jest.fn();
const mockGetConsentInfo = jest.fn();
const mockShowPrivacyOptionsForm = jest.fn();

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: () => ({ initialize: mockInitialize }),
  AdsConsent: {
    gatherConsent: (...args: unknown[]) => mockGatherConsent(...args),
    getConsentInfo: (...args: unknown[]) => mockGetConsentInfo(...args),
    showPrivacyOptionsForm: () => mockShowPrivacyOptionsForm(),
  },
  AdsConsentPrivacyOptionsRequirementStatus: { REQUIRED: 'REQUIRED', NOT_REQUIRED: 'NOT_REQUIRED' },
  TestIds: { ADAPTIVE_BANNER: 'ca-app-pub-3940256099942544/9214589741' },
}));

type AdsModule = typeof import('@/lib/ads');

function loadAds(dev = true): AdsModule {
  let mod!: AdsModule;
  const g = globalThis as unknown as { __DEV__: boolean };
  const previous = g.__DEV__;
  g.__DEV__ = dev;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- isolateModules is synchronous
    mod = require('@/lib/ads');
  });
  g.__DEV__ = previous;
  return mod;
}

/** startAds is fire-and-forget; let its promise chain settle. */
const flush = () => new Promise<void>((resolve) => setImmediate(() => resolve()));

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.EXPO_PUBLIC_ADMOB_HOME_BANNER_ID;
  mockGatherConsent.mockResolvedValue({});
  mockGetConsentInfo.mockResolvedValue({ canRequestAds: true });
});

describe('unit ids', () => {
  it('uses Google’s test banner in development builds', () => {
    expect(loadAds(true).adsConfig.unitIds.home).toBe(TEST_UNIT);
  });

  it('uses the real Home banner in release builds', () => {
    expect(loadAds(false).adsConfig.unitIds.home).toBe(REAL_UNIT);
  });

  it('lets the environment override the release unit', () => {
    process.env.EXPO_PUBLIC_ADMOB_HOME_BANNER_ID = 'ca-app-pub-1/2';

    expect(loadAds(false).adsConfig.unitIds.home).toBe('ca-app-pub-1/2');
  });

  it('never reuses a test unit in release builds', () => {
    expect(loadAds(false).adsConfig.unitIds.home).not.toBe(TEST_UNIT);
  });
});

describe('placements', () => {
  it('allows ads on Home only, never in the reader', () => {
    expect(loadAds().adsConfig.placements).toEqual({ home: true });
  });
});

describe('startAds', () => {
  it('gathers consent before initialising the SDK', async () => {
    const order: string[] = [];
    mockGatherConsent.mockImplementation(async () => void order.push('consent'));
    mockInitialize.mockImplementationOnce(async () => {
      order.push('init');
      return [];
    });
    const ads = loadAds();

    ads.startAds();
    await flush();

    expect(order).toEqual(['consent', 'init']);
    expect(ads.useAdsReady.getState().ready).toBe(true);
  });

  it('does not initialise when consent forbids requesting ads', async () => {
    mockGetConsentInfo.mockResolvedValue({ canRequestAds: false });
    const ads = loadAds();

    ads.startAds();
    await flush();

    expect(mockInitialize).not.toHaveBeenCalled();
    expect(ads.useAdsReady.getState().ready).toBe(false);
  });

  it('still starts from stored consent when gathering fails', async () => {
    mockGatherConsent.mockRejectedValue(new Error('offline'));
    const ads = loadAds();

    ads.startAds();
    await flush();

    expect(mockInitialize).toHaveBeenCalledTimes(1);
    expect(ads.useAdsReady.getState().ready).toBe(true);
  });

  it('initialises only once however often it is called', async () => {
    const ads = loadAds();

    ads.startAds();
    ads.startAds();
    await flush();

    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });

  it('stays off, without throwing, when initialisation fails', async () => {
    mockInitialize.mockRejectedValueOnce(new Error('sdk'));
    const ads = loadAds();

    expect(() => ads.startAds()).not.toThrow();
    await flush();

    expect(ads.useAdsReady.getState().ready).toBe(false);
  });
});

describe('privacy options', () => {
  it('flags the entry point as required where the regulation applies', async () => {
    mockGetConsentInfo.mockResolvedValue({
      canRequestAds: true,
      privacyOptionsRequirementStatus: 'REQUIRED',
    });
    const ads = loadAds();

    ads.startAds();
    await flush();

    expect(ads.useAdsReady.getState().privacyOptionsRequired).toBe(true);
  });

  it('hides the entry point elsewhere', async () => {
    mockGetConsentInfo.mockResolvedValue({
      canRequestAds: true,
      privacyOptionsRequirementStatus: 'NOT_REQUIRED',
    });
    const ads = loadAds();

    ads.startAds();
    await flush();

    expect(ads.useAdsReady.getState().privacyOptionsRequired).toBe(false);
  });

  it('shows the form, then starts ads if the new choice allows them', async () => {
    mockGetConsentInfo.mockResolvedValue({ canRequestAds: false });
    const ads = loadAds();
    ads.startAds();
    await flush();
    expect(mockInitialize).not.toHaveBeenCalled();

    mockGetConsentInfo.mockResolvedValue({ canRequestAds: true });
    await ads.showPrivacyOptions();

    expect(mockShowPrivacyOptionsForm).toHaveBeenCalledTimes(1);
    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });
});
