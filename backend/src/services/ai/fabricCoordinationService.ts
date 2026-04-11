// src/services/ai/fabricCoordinationService.ts

import Anthropic from '@anthropic-ai/sdk';
import type { FabricsByRole } from '../../types/QuiltPattern';
import { buildFabricCoordinationPrompt } from './prompts/fabricCoordinationPrompt';

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

type FabricRole = 'background' | 'primary' | 'secondary' | 'accent';

/**
 * Validates a role assignment is a valid number within the fabric count
 */
const isValidRoleAssignment = (value: unknown, fabricCount: number): value is number => {
  return typeof value === 'number' && value >= 1 && value <= fabricCount;
};

/**
 * Validates required role assignments from AI response
 */
const validateRequiredRoles = (parsed: CoordinationResponse, fabricCount: number): void => {
  const requiredRoles: FabricRole[] =
    fabricCount === 2
      ? ['primary', 'secondary']
      : ['background', 'primary', 'secondary'];
  
  for (const role of requiredRoles) {
    const value = parsed[role];
    if (!isValidRoleAssignment(value, fabricCount)) {
      throw new Error(`Invalid or missing assignment for ${role}`);
    }
  }
};

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
   * @throws Error if fabric count is out of range (2-10)
   */
  async autoAssignRoles(fabrics: FabricAnalysis[]): Promise<FabricsByRole> {
    // Validate input
    if (fabrics.length < 2 || fabrics.length > 10) {
      throw new Error('Auto-assignment requires 2-10 fabrics');
    }

    console.log(`[Fabric Coordination] Auto-assigning roles for ${fabrics.length} fabrics`);

    const prompt = buildFabricCoordinationPrompt(fabrics.length);
    
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
   * Parse AI response and extract role assignments
   */
  private parseRoleAssignments(
    response: string,
    fabrics: FabricAnalysis[]
  ): FabricsByRole {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/) || response.match(/(\{[\s\S]*\})/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response.trim();

    let parsed: CoordinationResponse;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      console.error('[Fabric Coordination] Failed to parse AI response:', response);
      throw new Error('Could not parse fabric role assignments from AI response');
    }
    
    // Validate required assignments with improved error messages
    validateRequiredRoles(parsed, fabrics.length);

    // Build result (convert 1-indexed to 0-indexed and get filenames)
    const result: FabricsByRole = {
      background: fabrics[parsed.background! - 1].fileName,
      primary: fabrics[parsed.primary! - 1].fileName,
      secondary: fabrics[parsed.secondary! - 1].fileName,
    };

    // Optionally include accent if valid
    if (isValidRoleAssignment(parsed.accent, fabrics.length)) {
      result.accent = fabrics[parsed.accent - 1].fileName;
    }

    console.log('[Fabric Coordination] Successfully assigned roles:', {
      assignments: result,
      reasoning: parsed.reasoning
    });

    return result;
  }
}
