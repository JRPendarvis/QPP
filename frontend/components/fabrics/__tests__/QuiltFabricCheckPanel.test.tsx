import { fireEvent, render, screen } from '@testing-library/react';
import QuiltFabricCheckPanel from '../QuiltFabricCheckPanel';

const fabrics = [
  {
    id: 'f1',
    userId: 'u1',
    name: 'Ruby Cotton',
    color: '#ff0000',
    yardageAvailable: 3,
    yardageReserved: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('QuiltFabricCheckPanel', () => {
  it('adds a requirement row', () => {
    const onRequirementsChange = jest.fn();

    render(
      <QuiltFabricCheckPanel
        fabrics={fabrics}
        selectedFabricId={null}
        quiltName=""
        requirements={[]}
        availabilityResult={null}
        onQuiltNameChange={jest.fn()}
        onRequirementsChange={onRequirementsChange}
        onRunAvailabilityCheck={jest.fn().mockResolvedValue(undefined)}
        onStartQuilt={jest.fn().mockResolvedValue(undefined)}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add Fabric Requirement' }));
    expect(onRequirementsChange).toHaveBeenCalledWith([{ fabricId: 'f1', requiredYardage: '1' }]);
  });

  it('calls check and start actions', () => {
    const onRunAvailabilityCheck = jest.fn().mockResolvedValue(undefined);
    const onStartQuilt = jest.fn().mockResolvedValue(undefined);

    render(
      <QuiltFabricCheckPanel
        fabrics={fabrics}
        selectedFabricId={'f1'}
        quiltName="Test Quilt"
        requirements={[{ fabricId: 'f1', requiredYardage: '1.5' }]}
        availabilityResult={{
          hasShortage: false,
          statement: 'You have enough fabric to make this quilt.',
          summary: { totalRequired: 1.5, totalAvailable: 2, totalShortage: 0 },
          breakdown: [],
        }}
        onQuiltNameChange={jest.fn()}
        onRequirementsChange={jest.fn()}
        onRunAvailabilityCheck={onRunAvailabilityCheck}
        onStartQuilt={onStartQuilt}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(onRunAvailabilityCheck).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Start Quilt (Reserve Fabric)' }));
    expect(onStartQuilt).toHaveBeenCalled();
  });
});
