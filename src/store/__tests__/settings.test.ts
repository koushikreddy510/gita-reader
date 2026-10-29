/**
 * Settings store: the preferences that change what the reader looks like.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_THEME_ID } from '@/constants/reading-themes';
import {
  DEFAULT_APP_LANGUAGE,
  DEFAULT_SCRIPT_MODE,
  DEFAULT_TEXT_SIZE,
  DEFAULT_TRANSLATION,
} from '@/constants/settings-options';
import { useSettings } from '@/store/settings';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(async () => {
  useSettings.setState({
    themeId: DEFAULT_THEME_ID,
    textSizeId: DEFAULT_TEXT_SIZE,
    translationId: DEFAULT_TRANSLATION,
    scriptMode: DEFAULT_SCRIPT_MODE,
    appLanguage: DEFAULT_APP_LANGUAGE,
    isPremium: false,
    hydrated: false,
  });
  await AsyncStorage.clear();
});

describe('defaults', () => {
  it('opens in OLED, medium text, plain English and Devanagari+IAST', () => {
    const state = useSettings.getState();
    expect(state.themeId).toBe('oled');
    expect(state.textSizeId).toBe('medium');
    expect(state.translationId).toBe('editorial');
    expect(state.scriptMode).toBe('both');
    expect(state.appLanguage).toBe('en');
  });

  it('is not premium until something says so', () => {
    expect(useSettings.getState().isPremium).toBe(false);
  });

  it('starts unhydrated so the UI can hold the splash', () => {
    expect(useSettings.getState().hydrated).toBe(false);
    useSettings.getState().setHydrated(true);
    expect(useSettings.getState().hydrated).toBe(true);
  });
});

describe('setters', () => {
  it('stores each preference independently', () => {
    useSettings.getState().setTheme('sepia');
    useSettings.getState().setTextSize('xlarge');
    useSettings.getState().setTranslation('telang');
    useSettings.getState().setScriptMode('iast');
    useSettings.getState().setAppLanguage('hi');

    const state = useSettings.getState();
    expect(state.themeId).toBe('sepia');
    expect(state.textSizeId).toBe('xlarge');
    expect(state.translationId).toBe('telang');
    expect(state.scriptMode).toBe('iast');
    expect(state.appLanguage).toBe('hi');
  });

  it('tracks the premium flag', () => {
    useSettings.getState().setPremium(true);
    expect(useSettings.getState().isPremium).toBe(true);
    useSettings.getState().setPremium(false);
    expect(useSettings.getState().isPremium).toBe(false);
  });
});

describe('persistence', () => {
  it('persists preferences but not the hydration flag', async () => {
    useSettings.getState().setTheme('sepia');
    await flush();

    const raw = await AsyncStorage.getItem('gita-settings');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(1);
    expect(parsed.state.themeId).toBe('sepia');
    expect(parsed.state).not.toHaveProperty('hydrated');
  });
});
