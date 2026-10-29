/**
 * The verse card is the reading surface: script modes, translation fallback,
 * highlighting, bookmarks and sharing all hang off it.
 *
 * @testing-library/react-native v14 renders and dispatches asynchronously, so
 * every interaction is awaited.
 */

import { fireEvent, render, screen } from '@testing-library/react-native';
import { Share } from 'react-native';

import { VerseCard } from '@/components/verse-card';
import { getTheme } from '@/constants/reading-themes';
import { SEED_VERSES } from '@/data/corpus';
import { useLibrary } from '@/store/library';
import { useSettings } from '@/store/settings';

const verse = SEED_VERSES.find((candidate) => candidate.translations.editorial)!;
const editorial = verse.translations.editorial!;
const card = () => screen.getByTestId(`verse-${verse.ref}`);

beforeEach(() => {
  useLibrary.setState({
    highlights: {},
    bookmarks: {},
    read: {},
    lastRead: null,
    hydrated: true,
  });
  useSettings.setState({
    themeId: 'oled',
    textSizeId: 'medium',
    translationId: 'editorial',
    scriptMode: 'both',
    appLanguage: 'en',
    isPremium: false,
    hydrated: true,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('rendering', () => {
  it('shows the ref, Sanskrit, transliteration, translation and its attribution', async () => {
    await render(<VerseCard verse={verse} />);

    expect(screen.getByText(verse.ref)).toBeTruthy();
    expect(screen.getByText(verse.devanagari)).toBeTruthy();
    expect(screen.getByText(verse.iast)).toBeTruthy();
    expect(screen.getByText(editorial)).toBeTruthy();
    expect(screen.getByText('Plain English')).toBeTruthy();
  });

  it('hides the Devanagari line in IAST-only mode', async () => {
    useSettings.setState({ scriptMode: 'iast' });
    await render(<VerseCard verse={verse} />);

    expect(screen.queryByText(verse.devanagari)).toBeNull();
    expect(screen.getByText(verse.iast)).toBeTruthy();
  });

  it('hides the transliteration in Devanagari-only mode', async () => {
    useSettings.setState({ scriptMode: 'devanagari' });
    await render(<VerseCard verse={verse} />);

    expect(screen.getByText(verse.devanagari)).toBeTruthy();
    expect(screen.queryByText(verse.iast)).toBeNull();
  });

  it('drops the translation entirely when translations are off', async () => {
    useSettings.setState({ translationId: 'none' });
    await render(<VerseCard verse={verse} />);

    expect(screen.queryByText(editorial)).toBeNull();
    expect(screen.queryByText('Plain English')).toBeNull();
    // The Sanskrit must survive that choice.
    expect(screen.getByText(verse.devanagari)).toBeTruthy();
  });

  it('says so when the requested edition is not loaded for this verse', async () => {
    useSettings.setState({ translationId: 'arnold' });
    await render(<VerseCard verse={verse} />);

    expect(screen.getByText(editorial)).toBeTruthy();
    expect(screen.getByText(/requested edition not loaded for this verse/)).toBeTruthy();
  });

  it('lets the caller suppress the attribution line', async () => {
    await render(<VerseCard verse={verse} showMeta={false} />);

    expect(screen.getByText(editorial)).toBeTruthy();
    expect(screen.queryByText('Plain English')).toBeNull();
  });
});

describe('highlighting', () => {
  it('opens the palette on long press and closes it after a colour is picked', async () => {
    await render(<VerseCard verse={verse} />);
    expect(screen.queryByTestId('swatch-rose')).toBeNull();

    await fireEvent(card(), 'longPress');
    expect(screen.getByTestId('swatch-rose')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('swatch-rose'));

    expect(useLibrary.getState().highlights[verse.ref].color).toBe('rose');
    expect(screen.queryByTestId('swatch-rose')).toBeNull();
  });

  it('paints the card with the theme’s highlight fill', async () => {
    useLibrary.setState({
      highlights: { [verse.ref]: { ref: verse.ref, color: 'rose', createdAt: 1 } },
    });

    await render(<VerseCard verse={verse} />);

    const expected = getTheme('oled').colors.highlightFill.rose;
    expect(card()).toHaveStyle({ backgroundColor: expected });
  });

  it('offers a way to remove an existing highlight', async () => {
    useLibrary.setState({
      highlights: { [verse.ref]: { ref: verse.ref, color: 'sage', createdAt: 1 } },
    });

    await render(<VerseCard verse={verse} />);
    await fireEvent(card(), 'longPress');
    await fireEvent.press(screen.getByTestId(`clear-highlight-${verse.ref}`));

    expect(useLibrary.getState().highlights[verse.ref]).toBeUndefined();
  });
});

describe('bookmarks', () => {
  it('toggles the bookmark and its accessibility label', async () => {
    await render(<VerseCard verse={verse} />);

    expect(screen.getByTestId(`bookmark-${verse.ref}`).props.accessibilityLabel).toBe(
      'Bookmark verse'
    );

    await fireEvent.press(screen.getByTestId(`bookmark-${verse.ref}`));
    expect(useLibrary.getState().bookmarks[verse.ref]).toBeGreaterThan(0);
    expect(screen.getByTestId(`bookmark-${verse.ref}`).props.accessibilityLabel).toBe(
      'Remove bookmark'
    );

    await fireEvent.press(screen.getByTestId(`bookmark-${verse.ref}`));
    expect(useLibrary.getState().bookmarks[verse.ref]).toBeUndefined();
    expect(screen.getByTestId(`bookmark-${verse.ref}`).props.accessibilityLabel).toBe(
      'Bookmark verse'
    );
  });
});

describe('sharing', () => {
  it('shares Sanskrit, transliteration, translation and the citation', async () => {
    const share = jest
      .spyOn(Share, 'share')
      .mockResolvedValue({ action: 'sharedAction', activityType: undefined });

    await render(<VerseCard verse={verse} />);
    await fireEvent.press(screen.getByLabelText('Share verse'));

    expect(share).toHaveBeenCalledTimes(1);
    const message = String(share.mock.calls[0][0].message);

    expect(message).toContain(verse.devanagari);
    expect(message).toContain(verse.iast);
    expect(message).toContain(editorial);
    expect(message).toContain(`— Bhagavad Gita ${verse.ref}`);
  });

  it('does not crash when the share sheet is dismissed', async () => {
    jest.spyOn(Share, 'share').mockRejectedValue(new Error('dismissed'));

    await render(<VerseCard verse={verse} />);
    await expect(fireEvent.press(screen.getByLabelText('Share verse'))).resolves.toBeUndefined();
  });
});
