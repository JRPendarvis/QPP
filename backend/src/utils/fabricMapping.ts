// src/utils/fabricMapping.ts

import type { FabricsByRole } from '../types/QuiltPattern';
import type { FabricAssignments } from '../services/instructions/fabricAssignments';

/**
 * Normalize a role string to a standard role key
 */
export function normalizeRoleKey(role: unknown): keyof FabricsByRole | null {
  const r = String(role || '').trim().toLowerCase();

  if (r === 'background') return 'background';
  if (r === 'primary') return 'primary';
  if (r === 'secondary') return 'secondary';
  if (r === 'accent') return 'accent';

  if (r.includes('background')) return 'background';
  if (r.includes('primary')) return 'primary';
  if (r.includes('secondary')) return 'secondary';
  if (r.includes('accent')) return 'accent';

  return null;
}

/**
 * Convert FabricsByRole to FabricAssignments (slot-based array)
 * Maps role names to slot positions based on pattern conventions:
 * - Most patterns: [Background, Primary, Secondary, Accent]
 */
export function convertToFabricAssignments(fabricsByRole: FabricsByRole): FabricAssignments {
  const namesBySlot = [
    fabricsByRole.background || 'Background fabric',
    fabricsByRole.primary || 'Primary fabric',
    fabricsByRole.secondary || 'Secondary fabric',
    fabricsByRole.accent || 'Accent fabric',
  ];
  return { namesBySlot };
}

/**
 * Build structured fabricsByRole WITHOUT parsing prose.
 * Priority:
 *  1) roleAssignments (from frontend)
 *  2) Claude fabricAnalysis recommendedRole (structured)
 *  3) safe fallbacks
 */
export function buildFabricsByRole(roleAssignments: any, claudePattern: any): FabricsByRole {
  const fallback: FabricsByRole = {
    background: 'Background fabric',
    primary: 'Primary fabric',
    secondary: 'Secondary fabric',
    accent: 'Accent fabric',
  };

  const fabricIndexToLabel = new Map<number, string>();
  const fabricAnalysis = Array.isArray(claudePattern?.fabricAnalysis) ? claudePattern.fabricAnalysis : [];
  for (const fa of fabricAnalysis) {
    const idx = Number(fa?.fabricIndex);
    const desc = String(fa?.description || '').trim();
    if (!Number.isNaN(idx) && desc) {
      fabricIndexToLabel.set(idx, desc);
    }
  }

  const result: FabricsByRole = { ...fallback };

  // 1) Frontend roleAssignments
  // Accept either:
  // - array: ["Background","Primary",...], indexed by image position
  // - object: { "0":"Background", "1":"Primary" }
  if (roleAssignments) {
    if (Array.isArray(roleAssignments)) {
      roleAssignments.forEach((role: any, idx: number) => {
        const key = normalizeRoleKey(role);
        if (!key) return;

        const label = fabricIndexToLabel.get(idx) || `Fabric ${idx + 1}`;
        result[key] = label;
      });
    } else if (typeof roleAssignments === 'object') {
      Object.entries(roleAssignments).forEach(([idxStr, role]) => {
        const idx = Number(idxStr);
        if (Number.isNaN(idx)) return;

        const key = normalizeRoleKey(role);
        if (!key) return;

        const label = fabricIndexToLabel.get(idx) || `Fabric ${idx + 1}`;
        result[key] = label;
      });
    }

    return result;
  }

  // 2) Claude fabricAnalysis recommendedRole
  for (const fa of fabricAnalysis) {
    const role = String(fa?.recommendedRole || '').trim();
    const key = normalizeRoleKey(role);
    if (!key) continue;

    const idx = Number(fa?.fabricIndex);
    const label = fabricIndexToLabel.get(idx) || `Fabric ${idx + 1}`;
    result[key] = label;
  }

  return result;
}
