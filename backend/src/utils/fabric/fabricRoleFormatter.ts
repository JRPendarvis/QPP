/**
 * Fabric Role Formatter
 * Single Responsibility: Handles role formatting, color naming, and descriptions
 */
export class FabricRoleFormatter {
  private static readonly KNOWN_ROLES = new Set(['background', 'primary', 'secondary', 'accent']);
  
  private static readonly ROLE_DESCRIPTIONS: Record<string, string> = {
    background: 'Main background fabric',
    primary: 'Primary pattern fabric',
    secondary: 'Secondary accent fabric',
    accent: 'Accent or highlight fabric'
  };

  static formatName(role: string, index: number): string {
    return this.KNOWN_ROLES.has(role)
      ? role.charAt(0).toUpperCase() + role.slice(1)
      : `Fabric ${index + 1}`;
  }

  static getDescription(role: string): string {
    return this.ROLE_DESCRIPTIONS[role] || 'Pattern fabric';
  }

  static formatColorName(color: string, type: 'printed' | 'solid', index: number): string {
    // Extract color name from hex or use as-is
    const colorName = this.getColorName(color);
    const typeLabel = type === 'printed' ? 'Print' : 'Solid';
    return `${colorName} ${typeLabel}`;
  }

  static getTypeDescription(type: 'printed' | 'solid'): string {
    return type === 'printed' ? 'Printed pattern fabric' : 'Solid color fabric';
  }

  private static getColorName(color: string): string {
    // If it's a color name, capitalize it
    if (!color.startsWith('#')) {
      return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    }
    // For hex colors, try to approximate the name
    return this.hexToColorName(color);
  }

  private static hexToColorName(hex: string): string {
    // Convert hex to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'Color';
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    // Determine dominant color and approximate name
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Check for grays/whites/blacks
    if (max - min < 30) {
      if (max > 230) return 'White';
      if (max < 50) return 'Black';
      return 'Gray';
    }
    
    // Determine hue
    if (r > g && r > b) {
      if (g > 100) return 'Orange';
      if (b > 100) return 'Pink';
      return 'Red';
    }
    if (g > r && g > b) {
      if (r > 150) return 'Yellow';
      if (b > 100) return 'Teal';
      return 'Green';
    }
    if (b > r && b > g) {
      if (r > 100) return 'Purple';
      if (g > 100) return 'Cyan';
      return 'Blue';
    }
    
    return 'Color';
  }
}
