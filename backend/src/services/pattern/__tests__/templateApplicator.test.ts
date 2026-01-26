import { TemplateApplicator } from '../templateApplicator';
import { Fabric } from '../../../types/Fabric';

// Mock console.log to avoid noise in test output
global.console.log = jest.fn();

describe('TemplateApplicator', () => {
  const mockSolidFabrics: Fabric[] = [
    { color: '#FF0000', type: 'solid' },
    { color: '#00FF00', type: 'solid' },
    { color: '#0000FF', type: 'solid' },
  ];

  const mockPrintedFabrics: Fabric[] = [
    { color: '#FF0000', type: 'printed', image: 'data:image...' },
    { color: '#00FF00', type: 'solid' },
  ];

  describe('apply', () => {
    it('should replace color placeholders with solid colors', () => {
      const template = '<rect fill="COLOR1"/><rect fill="COLOR2"/>';
      
      const result = TemplateApplicator.apply(
        template,
        mockSolidFabrics,
        mockSolidFabrics,
        undefined
      );

      expect(result).toContain('#FF0000');
      expect(result).toContain('#00FF00');
    });

    it('should use pattern URL for printed fabrics', () => {
      const template = '<rect fill="COLOR1"/><rect fill="COLOR2"/>';
      
      const result = TemplateApplicator.apply(
        template,
        mockPrintedFabrics,
        mockPrintedFabrics,
        undefined
      );

      expect(result).toContain('url(#fabricImage0)');
      expect(result).toContain('#00FF00');
    });

    it('should use pattern-specific template when getTemplate provided', () => {
      const mockPatternDef = {
        getTemplate: jest.fn().mockReturnValue('<circle fill="COLOR1"/>'),
      };

      const result = TemplateApplicator.apply(
        '<rect fill="COLOR1"/>',
        mockSolidFabrics,
        mockSolidFabrics,
        mockPatternDef as any
      );

      expect(mockPatternDef.getTemplate).toHaveBeenCalledWith(['#FF0000', '#00FF00', '#0000FF']);
      expect(result).toContain('circle');
      expect(result).not.toContain('rect');
    });

    it('should remove svg tags from template', () => {
      const template = '<svg width="100"><rect fill="COLOR1"/></svg>';
      
      const result = TemplateApplicator.apply(
        template,
        mockSolidFabrics,
        mockSolidFabrics,
        undefined
      );

      expect(result).not.toContain('<svg');
      expect(result).not.toContain('</svg>');
      expect(result).toContain('rect');
    });

    it('should add default strokes when not present', () => {
      const template = '<rect fill="COLOR1"/>';
      
      const result = TemplateApplicator.apply(
        template,
        mockSolidFabrics,
        mockSolidFabrics,
        undefined
      );

      expect(result).toContain('stroke="rgba(0,0,0,0.1)"');
      expect(result).toContain('stroke-width="0.5"');
    });

    it('should not add strokes when already present', () => {
      const template = '<rect fill="COLOR1" stroke="black"/>';
      
      const result = TemplateApplicator.apply(
        template,
        mockSolidFabrics,
        mockSolidFabrics,
        undefined
      );

      // Should not add default stroke since stroke is present
      expect(result).not.toContain('stroke="rgba(0,0,0,0.1)"');
      expect(result).toContain('stroke="black"');
    });

    it('should replace all 8 color placeholders', () => {
      const template = 'COLOR1 COLOR2 COLOR3 COLOR4 COLOR5 COLOR6 COLOR7 COLOR8';
      
      const result = TemplateApplicator.apply(
        template,
        mockSolidFabrics,
        mockSolidFabrics,
        undefined
      );

      expect(result).not.toContain('COLOR1');
      expect(result).not.toContain('COLOR8');
      expect(result).toContain('#FF0000');
    });

    it('should fallback to first fabric when blockFabrics is shorter', () => {
      const template = '<rect fill="COLOR8"/>';
      const shortFabrics = mockSolidFabrics.slice(0, 2);
      
      const result = TemplateApplicator.apply(
        template,
        shortFabrics,
        mockSolidFabrics,
        undefined
      );

      // COLOR8 should use first fabric from allFabrics
      expect(result).toContain('#FF0000');
    });

    it('should add strokes to multiple SVG element types', () => {
      const template = '<rect fill="COLOR1"/><polygon points=""/><path d=""/><circle cx="50"/>';
      
      const result = TemplateApplicator.apply(
        template,
        mockSolidFabrics,
        mockSolidFabrics,
        undefined
      );

      expect(result.match(/stroke="rgba\(0,0,0,0\.1\)"/g)?.length).toBe(4);
    });

    it('should handle case-insensitive svg tag removal', () => {
      const template = '<SVG width="100"><RECT fill="COLOR1"/></SVG>';
      
      const result = TemplateApplicator.apply(
        template,
        mockSolidFabrics,
        mockSolidFabrics,
        undefined
      );

      expect(result).not.toContain('<SVG');
      expect(result).not.toContain('</SVG>');
    });

    it('should handle printed fabric not in allFabrics array', () => {
      const printedFabric: Fabric = { color: '#FFFFFF', type: 'printed', image: 'data:image...' };
      
      const result = TemplateApplicator.apply(
        '<rect fill="COLOR1"/>',
        [printedFabric],
        mockSolidFabrics,
        undefined
      );

      // indexOf returns -1 when not found, should still create pattern URL
      expect(result).toContain('url(#fabricImage-1)');
    });

    it('should handle printed fabric without image property', () => {
      const printedNoImage: Fabric = { color: '#FF0000', type: 'printed' };
      
      const result = TemplateApplicator.apply(
        '<rect fill="COLOR1"/>',
        [printedNoImage],
        [printedNoImage],
        undefined
      );

      // Should fallback to color when printed fabric has no image
      expect(result).toContain('#FF0000');
    });
  });
});
