import { LayoutComputer } from '../layoutComputer';

// Mock the render functions
jest.mock('../../../config/patterns/checkerboard/renderInstructions', () => ({
  renderInstructions: jest.fn(() => [
    'Cut instructions...',
    'Computed layout: 3×4 grid of 12" blocks (36 total squares)',
    'Assembly instructions...'
  ])
}));

jest.mock('../../../config/patterns/four-patch/renderInstructions', () => ({
  renderInstructions: jest.fn(() => [
    'Cut instructions...',
    'Computed layout: 4×5 grid of 10" blocks (20 total squares)',
    'Assembly instructions...'
  ])
}));

jest.mock('../../../config/patterns/nine-patch/renderInstructions', () => ({
  renderInstructions: jest.fn(() => [
    'Cut instructions...',
    'Computed layout: 5×6 grid of 12" blocks (30 total squares)',
    'Assembly instructions...'
  ])
}));

describe('LayoutComputer', () => {
  describe('computeAccurateLayout', () => {
    it('should compute layout for checkerboard pattern', () => {
      const result = LayoutComputer.computeAccurateLayout(
        'checkerboard',
        '60×72 inches',
        ['Fabric 1', 'Fabric 2'],
        'default'
      );

      expect(result).toBe('3×4 grid of 12" blocks (36 total squares)');
    });

    it('should compute layout for four-patch pattern', () => {
      const result = LayoutComputer.computeAccurateLayout(
        'four-patch',
        '60×72 inches',
        ['Fabric 1', 'Fabric 2'],
        'default'
      );

      expect(result).toBe('4×5 grid of 10" blocks (20 total squares)');
    });

    it('should compute layout for nine-patch pattern', () => {
      const result = LayoutComputer.computeAccurateLayout(
        'nine-patch',
        '60×72 inches',
        ['Fabric 1', 'Fabric 2'],
        'default'
      );

      expect(result).toBe('5×6 grid of 12" blocks (30 total squares)');
    });

    it('should handle case-insensitive pattern names', () => {
      const result = LayoutComputer.computeAccurateLayout(
        'CHECKERBOARD',
        '60×72 inches',
        ['Fabric 1', 'Fabric 2'],
        'default'
      );

      expect(result).toBe('3×4 grid of 12" blocks (36 total squares)');
    });

    it('should return null for unsupported pattern', () => {
      const result = LayoutComputer.computeAccurateLayout(
        'unsupported-pattern',
        '60×72 inches',
        ['Fabric 1', 'Fabric 2'],
        'default'
      );

      expect(result).toBeNull();
    });

    it('should use default fabric names when empty array provided', () => {
      const result = LayoutComputer.computeAccurateLayout(
        'checkerboard',
        '60×72 inches',
        [],
        'default'
      );

      expect(result).toBe('3×4 grid of 12" blocks (36 total squares)');
    });
  });

  describe('enhanceLayout', () => {
    it('should combine computed and descriptive layouts', () => {
      const computed = '3×4 grid of 12" blocks';
      const claude = 'Classic checkerboard alternation (Fabric 1 on even positions)';
      const result = LayoutComputer.enhanceLayout(computed, claude, ['Fabric 1', 'Fabric 2']);

      expect(result).toContain('Classic checkerboard alternation');
      expect(result).toContain('3×4 grid of 12" blocks');
    });

    it('should return computed layout when no descriptive elements found', () => {
      const computed = '3×4 grid of 12" blocks';
      const claude = 'Simple layout';
      const result = LayoutComputer.enhanceLayout(computed, claude, ['Fabric 1']);

      expect(result).toBe('3×4 grid of 12" blocks');
    });

    it('should return Claude layout when no computed layout', () => {
      const result = LayoutComputer.enhanceLayout(null, 'Custom layout', ['Fabric 1']);
      expect(result).toBe('Custom layout');
    });

    it('should return default when both are missing', () => {
      const result = LayoutComputer.enhanceLayout(null, '', ['Fabric 1']);
      expect(result).toBe('Arranged in a grid pattern');
    });

    it('should extract alternation patterns from Claude description', () => {
      const computed = '5×6 grid';
      const claude = 'Alternating squares pattern with checkerboard layout';
      const result = LayoutComputer.enhanceLayout(computed, claude, ['Fabric 1', 'Fabric 2']);

      expect(result).toContain('5×6 grid');
    });
  });
});
