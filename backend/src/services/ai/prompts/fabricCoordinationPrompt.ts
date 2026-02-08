/**
 * Prompt template for AI-powered fabric coordination
 * Instructs Claude to analyze fabrics and assign optimal roles for quilt patterns
 */

export const buildFabricCoordinationPrompt = (fabricCount: number): string => {
  return `You are an expert quilt designer specializing in color coordination and fabric pairing. Analyze these ${fabricCount} fabric images and assign each to optimal roles for a beautifully coordinated quilt pattern.

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
- Assign EXACTLY ONE fabric per role
- background, primary, and secondary are REQUIRED
- accent is OPTIONAL (only if truly beneficial)
- Fabrics are numbered 1-${fabricCount} in the order they appear
- Consider the entire composition, not just individual fabrics

Respond with ONLY valid JSON in this EXACT format:
{
  "background": <fabric number>,
  "primary": <fabric number>,
  "secondary": <fabric number>,
  "accent": <fabric number or omit this line>,
  "reasoning": "Brief 1-2 sentence explanation of your color coordination strategy"
}

Example response (for 4 fabrics):
{
  "background": 3,
  "primary": 1,
  "secondary": 2,
  "accent": 4,
  "reasoning": "Fabric 3's soft cream tone provides a neutral backdrop, while the vibrant floral (1) takes center stage. The teal solid (2) bridges the palette, and the coral geometric (4) adds energizing contrast."
}

Now analyze the fabrics and provide your coordination recommendations:`;
};
