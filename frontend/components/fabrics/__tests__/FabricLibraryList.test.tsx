import { fireEvent, render, screen } from '@testing-library/react';
import FabricLibraryList from '../FabricLibraryList';

const fabric = {
  id: 'f1',
  userId: 'u1',
  name: 'Ruby Cotton',
  color: '#ff0000',
  yardageAvailable: 3,
  yardageReserved: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('FabricLibraryList', () => {
  it('renders empty state', () => {
    render(
      <FabricLibraryList
        fabrics={[]}
        authLoading={false}
        loading={false}
        deletingId={null}
        selectedFabricId={null}
        onSelectFabric={jest.fn()}
        onDeleteFabric={jest.fn().mockResolvedValue(undefined)}
        onQuickUpdateYardage={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByText('No fabrics saved yet.')).toBeInTheDocument();
  });

  it('calls handlers for select, delete, and quick update', () => {
    const onSelectFabric = jest.fn();
    const onDeleteFabric = jest.fn().mockResolvedValue(undefined);
    const onQuickUpdateYardage = jest.fn().mockResolvedValue(undefined);

    render(
      <FabricLibraryList
        fabrics={[fabric]}
        authLoading={false}
        loading={false}
        deletingId={null}
        selectedFabricId="f1"
        onSelectFabric={onSelectFabric}
        onDeleteFabric={onDeleteFabric}
        onQuickUpdateYardage={onQuickUpdateYardage}
      />
    );

    fireEvent.click(screen.getByText('Ruby Cotton'));
    expect(onSelectFabric).toHaveBeenCalledWith('f1');

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDeleteFabric).toHaveBeenCalledWith('f1');

    const quickInput = screen.getByRole('spinbutton');
    fireEvent.change(quickInput, { target: { value: '4.5' } });
    fireEvent.blur(quickInput);
    expect(onQuickUpdateYardage).toHaveBeenCalledWith('f1', 4.5);
  });
});
