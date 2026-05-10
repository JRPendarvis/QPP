import { buildRequirementPayload, formatYardage } from '../formatters';

describe('formatters', () => {
  it('formats yardage with two decimals', () => {
    expect(formatYardage(1)).toBe('1.00 yd');
    expect(formatYardage(2.345)).toBe('2.35 yd');
  });

  it('builds payload and filters invalid requirements', () => {
    const payload = buildRequirementPayload([
      { fabricId: 'f1', requiredYardage: '2.5' },
      { fabricId: '', requiredYardage: '1' },
      { fabricId: 'f3', requiredYardage: '0' },
      { fabricId: 'f4', requiredYardage: 'abc' },
    ]);

    expect(payload).toEqual([{ fabricId: 'f1', requiredYardage: 2.5 }]);
  });
});
