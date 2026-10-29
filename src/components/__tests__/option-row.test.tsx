/**
 * OptionRow is the single row type every picker sheet uses, so its selection
 * semantics are worth pinning: screen readers and the sheets both depend on it.
 */

import { fireEvent, render, screen } from '@testing-library/react-native';

import { OptionRow } from '@/components/option-row';

describe('selection state', () => {
  it('exposes the selected row as a checked radio', async () => {
    await render(<OptionRow title="Owner" selected onPress={() => {}} />);

    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('exposes unselected rows as unchecked radios', async () => {
    await render(<OptionRow title="Other" selected={false} onPress={() => {}} />);

    expect(screen.getByRole('radio')).not.toBeChecked();
  });
});

describe('pressing', () => {
  it('fires onPress for an enabled row', async () => {
    const onPress = jest.fn();
    await render(<OptionRow title="Dark" selected={false} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('radio'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses on a disabled row', async () => {
    const onPress = jest.fn();
    await render(<OptionRow title="Hindi" selected={false} onPress={onPress} disabled />);

    await fireEvent.press(screen.getByRole('radio'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('radio')).toBeDisabled();
  });
});
