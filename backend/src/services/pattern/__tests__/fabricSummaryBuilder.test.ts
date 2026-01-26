// src/services/pattern/__tests__/fabricSummaryBuilder.test.ts

import { FabricSummaryBuilder } from '../fabricSummaryBuilder';
import { FabricAnalysis, RoleAssignments } from '../promptFormatter';

describe('FabricSummaryBuilder', () => {
  describe('buildFabricSummary', () => {
    it('should format single fabric correctly', () => {
      const fabrics: FabricAnalysis[] = [{
        fabricIndex: 0,
        description: 'Blue floral print',
        type: 'printed',
        value: 'medium',
        printScale: 'medium',
        dominantColor: '#0000FF',
      }];

      const result = FabricSummaryBuilder.buildFabricSummary(fabrics);
      expect(result).toBe('- Fabric 0: Blue floral print (medium value, medium print)');
    });

    it('should format multiple fabrics with newlines', () => {
      const fabrics: FabricAnalysis[] = [
        {
          fabricIndex: 0,
          description: 'Red solid',
          type: 'solid',
          value: 'dark',
          printScale: 'solid',
          dominantColor: '#FF0000',
        },
        {
          fabricIndex: 1,
          description: 'Yellow polka dots',
          type: 'printed',
          value: 'light',
          printScale: 'small',
          dominantColor: '#FFFF00',
        },
      ];

      const result = FabricSummaryBuilder.buildFabricSummary(fabrics);
      expect(result).toContain('- Fabric 0: Red solid (dark value, solid print)');
      expect(result).toContain('- Fabric 1: Yellow polka dots (light value, small print)');
      expect(result.split('\n').length).toBe(2);
    });

    it('should handle empty fabric array', () => {
      const result = FabricSummaryBuilder.buildFabricSummary([]);
      expect(result).toBe('');
    });

    it('should format all value types correctly', () => {
      const fabrics: FabricAnalysis[] = [
        { fabricIndex: 0, description: 'Light fabric', type: 'solid', value: 'light', printScale: 'solid', dominantColor: '#FFF' },
        { fabricIndex: 1, description: 'Medium fabric', type: 'solid', value: 'medium', printScale: 'solid', dominantColor: '#888' },
        { fabricIndex: 2, description: 'Dark fabric', type: 'solid', value: 'dark', printScale: 'solid', dominantColor: '#000' },
      ];

      const result = FabricSummaryBuilder.buildFabricSummary(fabrics);
      expect(result).toContain('light value');
      expect(result).toContain('medium value');
      expect(result).toContain('dark value');
    });

    it('should format all print scales correctly', () => {
      const fabrics: FabricAnalysis[] = [
        { fabricIndex: 0, description: 'Solid', type: 'solid', value: 'medium', printScale: 'solid', dominantColor: '#FFF' },
        { fabricIndex: 1, description: 'Small print', type: 'printed', value: 'medium', printScale: 'small', dominantColor: '#888' },
        { fabricIndex: 2, description: 'Medium print', type: 'printed', value: 'medium', printScale: 'medium', dominantColor: '#000' },
        { fabricIndex: 3, description: 'Large print', type: 'printed', value: 'medium', printScale: 'large', dominantColor: '#F00' },
      ];

      const result = FabricSummaryBuilder.buildFabricSummary(fabrics);
      expect(result).toContain('solid print');
      expect(result).toContain('small print');
      expect(result).toContain('medium print');
      expect(result).toContain('large print');
    });
  });

  describe('buildRolesSummary', () => {
    it('should format single role assignment', () => {
      const roles: RoleAssignments = {
        background: { fabricIndex: 0, description: 'White solid' },
        primary: null,
        secondary: null,
        accent: null,
      };

      const result = FabricSummaryBuilder.buildRolesSummary(roles);
      expect(result).toBe('- BACKGROUND: Fabric 0 (White solid)');
    });

    it('should format all role assignments', () => {
      const roles: RoleAssignments = {
        background: { fabricIndex: 0, description: 'White solid' },
        primary: { fabricIndex: 1, description: 'Blue floral' },
        secondary: { fabricIndex: 2, description: 'Green stripe' },
        accent: { fabricIndex: 3, description: 'Red dot' },
      };

      const result = FabricSummaryBuilder.buildRolesSummary(roles);
      expect(result).toContain('- BACKGROUND: Fabric 0 (White solid)');
      expect(result).toContain('- PRIMARY: Fabric 1 (Blue floral)');
      expect(result).toContain('- SECONDARY: Fabric 2 (Green stripe)');
      expect(result).toContain('- ACCENT: Fabric 3 (Red dot)');
      expect(result.split('\n').length).toBe(4);
    });

    it('should skip null role assignments', () => {
      const roles: RoleAssignments = {
        background: { fabricIndex: 0, description: 'White solid' },
        primary: null,
        secondary: { fabricIndex: 2, description: 'Green stripe' },
        accent: null,
      };

      const result = FabricSummaryBuilder.buildRolesSummary(roles);
      expect(result).toContain('BACKGROUND');
      expect(result).toContain('SECONDARY');
      expect(result).not.toContain('PRIMARY');
      expect(result).not.toContain('ACCENT');
      expect(result.split('\n').length).toBe(2);
    });

    it('should handle all null roles', () => {
      const roles: RoleAssignments = {
        background: null,
        primary: null,
        secondary: null,
        accent: null,
      };

      const result = FabricSummaryBuilder.buildRolesSummary(roles);
      expect(result).toBe('');
    });

    it('should uppercase role names', () => {
      const roles: RoleAssignments = {
        background: { fabricIndex: 0, description: 'Test' },
        primary: { fabricIndex: 1, description: 'Test' },
        secondary: { fabricIndex: 2, description: 'Test' },
        accent: { fabricIndex: 3, description: 'Test' },
      };

      const result = FabricSummaryBuilder.buildRolesSummary(roles);
      expect(result).toContain('BACKGROUND:');
      expect(result).toContain('PRIMARY:');
      expect(result).toContain('SECONDARY:');
      expect(result).toContain('ACCENT:');
    });
  });
});
