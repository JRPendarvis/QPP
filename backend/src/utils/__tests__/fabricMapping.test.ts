import { normalizeRoleKey, convertToFabricAssignments, buildFabricsByRole } from '../fabricMapping';
import type { FabricsByRole } from '../../types/QuiltPattern';

describe('fabricMapping', () => {
  describe('normalizeRoleKey', () => {
    it('should normalize exact role names', () => {
      expect(normalizeRoleKey('background')).toBe('background');
      expect(normalizeRoleKey('primary')).toBe('primary');
      expect(normalizeRoleKey('secondary')).toBe('secondary');
      expect(normalizeRoleKey('accent')).toBe('accent');
    });

    it('should handle case insensitivity', () => {
      expect(normalizeRoleKey('BACKGROUND')).toBe('background');
      expect(normalizeRoleKey('Primary')).toBe('primary');
      expect(normalizeRoleKey('SECONDARY')).toBe('secondary');
      expect(normalizeRoleKey('AcCeNt')).toBe('accent');
    });

    it('should handle roles with extra whitespace', () => {
      expect(normalizeRoleKey('  background  ')).toBe('background');
      expect(normalizeRoleKey('  primary')).toBe('primary');
      expect(normalizeRoleKey('secondary  ')).toBe('secondary');
    });

    it('should normalize partial matches', () => {
      expect(normalizeRoleKey('background fabric')).toBe('background');
      expect(normalizeRoleKey('primary color')).toBe('primary');
      expect(normalizeRoleKey('secondary accent')).toBe('secondary'); // First match wins
      expect(normalizeRoleKey('accent piece')).toBe('accent');
    });

    it('should return null for invalid roles', () => {
      expect(normalizeRoleKey('invalid')).toBeNull();
      expect(normalizeRoleKey('unknown')).toBeNull();
      expect(normalizeRoleKey('')).toBeNull();
      expect(normalizeRoleKey(null)).toBeNull();
      expect(normalizeRoleKey(undefined)).toBeNull();
    });

    it('should handle numeric inputs by converting to string', () => {
      expect(normalizeRoleKey(123)).toBeNull();
      expect(normalizeRoleKey(0)).toBeNull();
    });
  });

  describe('convertToFabricAssignments', () => {
    it('should convert complete FabricsByRole to FabricAssignments', () => {
      const fabricsByRole: FabricsByRole = {
        background: 'Light beige fabric',
        primary: 'Deep blue fabric',
        secondary: 'Coral pink fabric',
        accent: 'Gold metallic fabric'
      };

      const result = convertToFabricAssignments(fabricsByRole);

      expect(result.namesBySlot).toEqual([
        'Light beige fabric',
        'Deep blue fabric',
        'Coral pink fabric',
        'Gold metallic fabric'
      ]);
    });

    it('should use defaults for missing roles', () => {
      const fabricsByRole: FabricsByRole = {
        background: 'Custom background',
        primary: 'Custom primary',
        secondary: 'Custom secondary',
        accent: 'Custom accent'
      };

      // Test with partial data
      const partial: FabricsByRole = {
        background: 'Custom background',
        primary: '',
        secondary: '',
        accent: ''
      };

      const result = convertToFabricAssignments(partial);

      expect(result.namesBySlot[0]).toBe('Custom background');
      expect(result.namesBySlot[1]).toBe('Primary fabric'); // Default
      expect(result.namesBySlot[2]).toBe('Secondary fabric'); // Default
      expect(result.namesBySlot[3]).toBe('Accent fabric'); // Default
    });

    it('should maintain slot order', () => {
      const fabricsByRole: FabricsByRole = {
        background: 'Slot 0',
        primary: 'Slot 1',
        secondary: 'Slot 2',
        accent: 'Slot 3'
      };

      const result = convertToFabricAssignments(fabricsByRole);

      expect(result.namesBySlot.length).toBe(4);
      expect(result.namesBySlot[0]).toBe('Slot 0');
      expect(result.namesBySlot[1]).toBe('Slot 1');
      expect(result.namesBySlot[2]).toBe('Slot 2');
      expect(result.namesBySlot[3]).toBe('Slot 3');
    });
  });

  describe('buildFabricsByRole', () => {
    it('should return fallback when no inputs provided', () => {
      const result = buildFabricsByRole(null, null);

      expect(result).toEqual({
        background: 'Background fabric',
        primary: 'Primary fabric',
        secondary: 'Secondary fabric',
        accent: 'Accent fabric'
      });
    });

    it('should prioritize roleAssignments array over fabricAnalysis', () => {
      const roleAssignments = ['background', 'primary', 'secondary', 'accent'];
      const claudePattern = {
        fabricAnalysis: [
          { fabricIndex: 0, description: 'Blue fabric', recommendedRole: 'primary' },
          { fabricIndex: 1, description: 'Red fabric', recommendedRole: 'accent' }
        ]
      };

      const result = buildFabricsByRole(roleAssignments, claudePattern);

      expect(result.background).toBe('Blue fabric');
      expect(result.primary).toBe('Red fabric');
      expect(result.secondary).toBe('Fabric 3');
      expect(result.accent).toBe('Fabric 4');
    });

    it('should handle roleAssignments as object', () => {
      const roleAssignments = {
        '0': 'background',
        '1': 'primary',
        '2': 'accent'
      };
      const claudePattern = {
        fabricAnalysis: [
          { fabricIndex: 0, description: 'Beige fabric' },
          { fabricIndex: 1, description: 'Navy fabric' },
          { fabricIndex: 2, description: 'Gold fabric' }
        ]
      };

      const result = buildFabricsByRole(roleAssignments, claudePattern);

      expect(result.background).toBe('Beige fabric');
      expect(result.primary).toBe('Navy fabric');
      expect(result.accent).toBe('Gold fabric');
      expect(result.secondary).toBe('Secondary fabric'); // Fallback
    });

    it('should use fabricAnalysis recommendedRole when roleAssignments not provided', () => {
      const claudePattern = {
        fabricAnalysis: [
          { fabricIndex: 0, description: 'White fabric', recommendedRole: 'background' },
          { fabricIndex: 1, description: 'Blue fabric', recommendedRole: 'primary' },
          { fabricIndex: 2, description: 'Red fabric', recommendedRole: 'accent' }
        ]
      };

      const result = buildFabricsByRole(null, claudePattern);

      expect(result.background).toBe('White fabric');
      expect(result.primary).toBe('Blue fabric');
      expect(result.accent).toBe('Red fabric');
      expect(result.secondary).toBe('Secondary fabric'); // Fallback
    });

    it('should handle missing fabricAnalysis', () => {
      const roleAssignments = ['background', 'primary'];
      const claudePattern = {};

      const result = buildFabricsByRole(roleAssignments, claudePattern);

      expect(result.background).toBe('Fabric 1');
      expect(result.primary).toBe('Fabric 2');
      expect(result.secondary).toBe('Secondary fabric');
      expect(result.accent).toBe('Accent fabric');
    });

    it('should ignore invalid roles in roleAssignments', () => {
      const roleAssignments = ['background', 'invalid', 'primary', null];
      const claudePattern = {
        fabricAnalysis: [
          { fabricIndex: 0, description: 'Fabric A' },
          { fabricIndex: 1, description: 'Fabric B' },
          { fabricIndex: 2, description: 'Fabric C' }
        ]
      };

      const result = buildFabricsByRole(roleAssignments, claudePattern);

      expect(result.background).toBe('Fabric A');
      expect(result.primary).toBe('Fabric C');
      expect(result.secondary).toBe('Secondary fabric');
      expect(result.accent).toBe('Accent fabric');
    });

    it('should handle malformed fabricAnalysis entries', () => {
      const claudePattern = {
        fabricAnalysis: [
          { fabricIndex: 'invalid', description: 'Fabric 1' },
          { fabricIndex: 0, description: '', recommendedRole: 'background' },
          { fabricIndex: 1, description: 'Valid fabric', recommendedRole: 'primary' },
          null,
          undefined
        ]
      };

      const result = buildFabricsByRole(null, claudePattern);

      expect(result.primary).toBe('Valid fabric');
      // Empty description means the fabricIndexToLabel map doesn't have idx 0,
      // so it uses 'Fabric 1' (idx 0 + 1)
      expect(result.background).toBe('Fabric 1');
    });
  });
});
