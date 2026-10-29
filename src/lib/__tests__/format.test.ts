import { formatRelative, formatShortDate, initials } from '@/lib/format';

describe('formatShortDate', () => {
  it('formats a date without relying on Intl', () => {
    expect(formatShortDate(new Date(2026, 0, 15))).toBe('Thursday, Jan 15');
  });

  it('handles the first day of a month and of the year', () => {
    expect(formatShortDate(new Date(2026, 0, 1))).toBe('Thursday, Jan 1');
    expect(formatShortDate(new Date(2026, 11, 31))).toBe('Thursday, Dec 31');
  });
});

describe('formatRelative', () => {
  const NOW = new Date(2026, 5, 15, 12, 0, 0).getTime();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls anything under a minute "just now"', () => {
    expect(formatRelative(NOW)).toBe('just now');
    expect(formatRelative(NOW - 59_000)).toBe('just now');
  });

  it('counts minutes, hours and days', () => {
    expect(formatRelative(NOW - 60_000)).toBe('1m ago');
    expect(formatRelative(NOW - 59 * 60_000)).toBe('59m ago');
    expect(formatRelative(NOW - 60 * 60_000)).toBe('1h ago');
    expect(formatRelative(NOW - 23 * 3_600_000)).toBe('23h ago');
    expect(formatRelative(NOW - 24 * 3_600_000)).toBe('1d ago');
    expect(formatRelative(NOW - 6 * 86_400_000)).toBe('6d ago');
  });

  it('switches to a calendar date after a week', () => {
    // 8 June 2026 is a Monday.
    expect(formatRelative(NOW - 7 * 86_400_000)).toBe('Monday, Jun 8');
  });
});

describe('initials', () => {
  it('takes the first letter, uppercased', () => {
    expect(initials('koushik')).toBe('K');
    expect(initials('Arjuna')).toBe('A');
  });

  it('ignores surrounding whitespace', () => {
    expect(initials('   krishna   ')).toBe('K');
  });

  it('falls back to a placeholder for empty names', () => {
    expect(initials('')).toBe('?');
    expect(initials('   ')).toBe('?');
  });
});
