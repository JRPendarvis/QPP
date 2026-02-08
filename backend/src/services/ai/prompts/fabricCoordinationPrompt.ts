/**
 * Prompt template for AI-powered fabric coordination
 * Instructs Claude to analyze fabrics and assign optimal roles for quilt patterns
 */

export const buildFabricCoordinationPrompt = (fabricCount: number): string => {
  // Determine required roles based on fabric count
  let requiredRoles: string;
  let rulesExplanation: string;
  
  if (fabricCount === 1) {
    requiredRoles = 'primary';
    rulesExplanation = '- Assign the fabric to the primary role\n- This single fabric will be the main feature';
  } else if (fabricCount === 2) {
    requiredRoles = 'primary and secondary';
    rulesExplanation = '- primary and secondary are REQUIRED\n- Assign one fabric as the primary (main feature) and one as secondary (support)';
  } else {
    requiredRoles = 'background, primary, and secondary';
    rulesExplanation = '- background, primary, and secondary are REQUIRED\n- accent is OPTIONAL (only if truly beneficial)\n- Assign EXACTLY ONE fabric per role';
  }
  
  return `You are an expert quilt designer specializing in color coordination and fabric pairing. Analyze these ${fabricCount} fabric image${fabricCount === 1 ? '' : 's'} and assign ${fabricCount === 1 ? 'it' : 'each'} to optimal ${fabricCount === 1 ? 'role' : 'roles'} for a beautifully coordinated quilt pattern.

Available roles:
- **background**: Subtle, low-contrast fabric that won't compete with design elements. Should recede visually and provide a calm foundation.
- **primary**: Main feature fabric with bold colors or patterns. This is the star of the quilt.
- **secondary**: Complementary fabric that supports and enhances the primary without overwhelming it.
- **accent**: High-contrast fabric for visual pop and energy (OPTIONAL - only assign if a fabric truly provides strong contrast and would enhance the design).

Guidelines for fabric coordination:
1. **Color Harmony**: Look for fabrics that share a common color family or create intentional contrast
2. **Visual Weight**: Balance busy patterns with calmer fabrics
3. **Value Contrast**: Ensure sufficient light/dark contrast for pattern visibility
4. **Scale Variety**: Mix different print scales (small, medium, large) for visual interest
5. **Accent Usage**: Only assign an accent if a fabric provides exceptional pop (don't force it)

Assignment rules:
${rulesExplanation}
- Fabrics are numbered 1-${fabricCount} in the order they appear
- Consider the entire composition, not just individual fabrics

Respond with ONLY valid JSON in this EXACT format:
{
  ${fabricCount >= 3 ? '"background": <fabric number>,\n  ' : ''}"primary": <fabric number>,${fabricCount >= 2 ? '\n  "secondary": <fabric number>,' : ''}
  "accent": <fabric number or omit this line>,
  "reasoning": "Brief 1-2 sentence explanation of your color coordination strategy"
}

${fabricCount === 1 ? 'Example response (for 1 fabric):\n{\n  "primary": 1,\n  "reasoning": "This vibrant floral fabric will serve as the main feature, creating a bold and beautiful focal point for the quilt."\n}' : fabricCount === 2 ? 'Example response (for 2 fabrics):\n{\n  "primary": 1,\n  "secondary": 2,\n  "reasoning": "The vibrant floral takes center stage while the coordinating solid provides support and balance."\n}' : 'Example response (for 4 fabrics):\n{\n  "background": 3,\n  "primary": 1,\n  "secondary": 2,\n  "accent": 4,\n  "reasoning": "Fabric 3\'s soft cream tone provides a neutral backdrop, while the vibrant floral (1) takes center stage. The teal solid (2) bridges the palette, and the coral geometric (4) adds energizing contrast."\n}'}

Now analyze the ${fabricCount === 1 ? 'fabric' : 'fabrics'} and provide your coordination recommendations:`;
};
