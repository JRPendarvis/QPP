// src/services/ai/fabricCoordinationService.ts

import Anthropic from '@anthropic-ai/sdk';
import type { FabricsByRole } from '../../types/QuiltPattern';

interface FabricAnalysis {
  imageData: string;
  fileName: string;
}

interface CoordinationResponse {
  background?: number;
  primary?: number;
  secondary?: number;
  accent?: number;
  reasoning?: string;
}

/**
 * AI-powered fabric coordination service
 * Uses Claude to analyze fabrics and auto-assign optimal roles for coordinated quilts
 */
export class FabricCoordinationService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Auto-assign fabric roles using AI analysis
   * @param fabrics - Array of fabric images with base64 data and filenames
   * @returns Fabric role assignments
   */
  async autoAssignRoles(fabrics: FabricAnalysis[]): Promise<FabricsByRole> {
    if (fabrics.length < 2 || fabrics.length > 10) {
      throw new Error('Auto-assignment requires 2-10 fabrics');
    }

    console.log(`[Fabric Coordination] Auto-assigning roles for ${fabrics.length} fabrics`);

    const prompt = this.buildCoordinationPrompt(fabrics);
    
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          ...fabrics.map((fabric, index) => ({
            type: 'image' as const,
            source: {
              type: 'base64' as const,
              media_type: 'image/jpeg' as const,
              data: fabric.imageData,
            },
          })),
        ],
      }],
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    console.log(`[Fabric Coordination] Received AI response, parsing assignments`);
    return this.parseRoleAssignments(textContent.text, fabrics);
  }

  /**
   * Build prompt for Claude to analyze and coordinate fabrics
   */
  private buildCoordinationPrompt(fabrics: FabricAnalysis[]): string {
    return `You are an expert quilt designer specializing in color coordination and fabric pairing. Analyze these ${fabrics.length} fabric images and assign each to optimal roles for a beautifully coordinated quilt pattern.

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
- Fabrics are numbered 1-${fabrics.length} in the order they appear
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
  }

  /**
   * Parse AI response and extract role assignments
   */
  private parseRoleAssignments(
    response: string,
    fabrics: FabricAnalysis[]
  ): FabricsByRole {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.trim();
    const jsonMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/) || response.match(/(\{[\s\S]*\})/);
    
    if (jsonMatch) {
      jsonText = jsonMatch[1] || jsonMatch[0];
    }

    let parsed: CoordinationResponse;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      console.error('[Fabric Coordination] Failed to parse AI response:', response);
      throw new Error('Could not parse fabric role assignments from AI response');
    }
    
    // Validate required assignments
    const requiredRoles: Array<keyof CoordinationResponse> = ['background', 'primary', 'secondary'];
    for (const role of requiredRoles) {
      const value = parsed[role];
      if (!value || value < 1 || value > fabrics.length) {
        throw new Error(`Invalid or missing assignment for ${role}`);
      }
    }

    // Build result (convert 1-indexed to 0-indexed and get filenames)
    const result: FabricsByRole = {
      background: fabrics[parsed.background! - 1].fileName,
      primary: fabrics[parsed.primary! - 1].fileName,
      secondary: fabrics[parsed.secondary! - 1].fileName,
    };

    if (parsed.accent && parsed.accent >= 1 && parsed.accent <= fabrics.length) {
      result.accent = fabrics[parsed.accent - 1].fileName;
    }

    console.log('[Fabric Coordination] Successfully assigned roles:', {
      assignments: result,
      reasoning: parsed.reasoning
    });

    return result;
  }
}
