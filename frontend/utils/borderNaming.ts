/**
 * Border Naming Utilities
 * Generate dynamic border names based on total count and position
 */

export function getBorderName(order: number, totalBorders: number): string {
  if (totalBorders === 1) {
    return 'Border';
  }
  
  if (totalBorders === 2) {
    return order === 1 ? 'Inner Border' : 'Outer Border';
  }
  
  if (totalBorders === 3) {
    if (order === 1) return 'Inner Border';
    if (order === 2) return 'Middle Border';
    return 'Outer Border';
  }
  
  if (totalBorders === 4) {
    if (order === 1) return 'Inner Border';
    if (order === 2) return 'Inner Middle Border';
    if (order === 3) return 'Outer Middle Border';
    return 'Outer Border';
  }
  
  // Fallback for unexpected cases
  return `Border ${order}`;
}

export function getBorderDisplayName(order: number, totalBorders: number): string {
  const name = getBorderName(order, totalBorders);
  return name;
}
