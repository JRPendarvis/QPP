import { formatYardage } from '../formatters';

describe('formatters', () => {
  it('formats yardage with two decimals', () => {
    expect(formatYardage(1)).toBe('1.00 yd');
    expect(formatYardage(2.345)).toBe('2.35 yd');
  });
});
