import React from 'react';
import { RoleAssignments } from '@/app/helpers/roleAssignments';

interface Fabric {
  name?: string;
  // add other properties as needed
}
interface RoleAssignmentSectionProps {
  fabrics: Fabric[];
  FABRIC_ROLES: { key: string; label: string }[];
  roleAssignments: RoleAssignments;
  setRoleAssignments: (fn: (prev: RoleAssignments) => RoleAssignments) => void;
  handleRoleChange: (prev: RoleAssignments, fabrics: Fabric[], fabricIdx: number, roleKey: string) => RoleAssignments;
}

const RoleAssignmentSection: React.FC<RoleAssignmentSectionProps> = ({
  fabrics,
  FABRIC_ROLES,
  roleAssignments,
  setRoleAssignments,
  handleRoleChange,
}) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-2">Assign Fabric Roles (drag and drop)</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FABRIC_ROLES.map(role => (
        <div
          key={role.key}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            const fabricIdx = Number(e.dataTransfer.getData('fabricIdx'));
            if (!isNaN(fabricIdx)) {
              setRoleAssignments(prev => handleRoleChange(prev, fabrics, fabricIdx, role.key));
            }
          }}
          className="flex items-center space-x-4 p-4 border-2 border-dashed rounded min-h-16 bg-gray-50"
        >
          <span className="font-medium w-24">{role.label}:</span>
          {roleAssignments[role.key as keyof RoleAssignments] !== null ? (
            <span className="truncate max-w-xs text-gray-700">
              {(() => {
                const assignment = roleAssignments[role.key as keyof RoleAssignments];
                if (assignment && typeof assignment.fabricIndex === 'number') {
                  return fabrics[assignment.fabricIndex]?.name || `Fabric ${assignment.fabricIndex + 1}`;
                }
                return '';
              })()}
              <button
                className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded"
                onClick={() => setRoleAssignments(prev => ({ ...prev, [role.key]: null }))}
              >
                Remove
              </button>
            </span>
          ) : (
            <span className="text-gray-400">Drop a fabric here</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default RoleAssignmentSection;
