import { act, fireEvent, render, screen } from '@testing-library/react';
import FabricCreateForm from '../FabricCreateForm';

describe('FabricCreateForm', () => {
  it('calls onCreate with normalized payload', async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    render(<FabricCreateForm loading={false} onCreate={onCreate} />);

    fireEvent.change(screen.getByPlaceholderText('Fabric name'), { target: { value: 'Ruby Cotton' } });
    fireEvent.change(screen.getByLabelText('Yardage Available'), { target: { value: '1.75' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save Fabric' }));
    });

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ruby Cotton',
        yardageAvailable: 1.75,
      })
    );
  });
});
