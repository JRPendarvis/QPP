export function formatYardage(value: number): string {
  return `${value.toFixed(2)} yd`;
}

export type RequirementInputRow = {
  fabricId: string;
  requiredYardage: string;
};

export function buildRequirementPayload(rows: RequirementInputRow[]) {
  return rows
    .map((row) => ({
      fabricId: row.fabricId,
      requiredYardage: Number(row.requiredYardage),
    }))
    .filter((row) => row.fabricId && Number.isFinite(row.requiredYardage) && row.requiredYardage > 0);
}
