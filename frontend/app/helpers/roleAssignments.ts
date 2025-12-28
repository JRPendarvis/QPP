// helpers/roleAssignments.ts

export type RoleKey = 'background' | 'primary' | 'secondary' | 'accent';
export interface RoleAssignment { fabricIndex: number; description: string; }
export type RoleAssignments = { [K in RoleKey]: RoleAssignment | null };

export function getRoleForFabric(roleAssignments: RoleAssignments, fabricIndex: number): RoleKey | '' {
  for (const role of Object.keys(roleAssignments) as RoleKey[]) {
    const assignment = roleAssignments[role];
    if (assignment && assignment.fabricIndex === fabricIndex) return role;
  }
  return '';
}

export function handleRoleChange(
  prev: RoleAssignments,
  fabrics: { name?: string }[],
  fabricIndex: number,
  newRole: string
): RoleAssignments {
  const updated: RoleAssignments = { ...prev };
  // Remove this fabric from any previous role
  (Object.keys(updated) as RoleKey[]).forEach(role => {
    if (updated[role] && updated[role]!.fabricIndex === fabricIndex) {
      updated[role] = null;
    }
  });
  // Remove any previous assignment to this role, then assign if newRole is valid
  if (newRole && (['background','primary','secondary','accent'] as string[]).includes(newRole)) {
    updated[newRole as RoleKey] = {
      fabricIndex,
      description: fabrics[fabricIndex]?.name || `Fabric ${fabricIndex + 1}`
    };
  }
  return updated;
}
