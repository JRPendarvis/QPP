/**
 * Pattern Prompt Schema and Template Generator
 * 
 * Provides a structured way to define and validate pattern prompts,
 * reducing copy-paste across pattern files and ensuring consistency.
 */

export interface PatternPromptTemplate {
  /** Unique pattern identifier */
  id: string;
  
  /** Human-readable pattern name */
  name: string;
  
  /** Brief description of what makes this pattern unique */
  description: string;
  
  /** Quilt assembly instructions (how blocks connect) */
  assemblyInstructions: string;
  
  /** Key visual characteristics for AI generation */
  visualCharacteristics: string;
  
  /** Typical color arrangement strategy */
  colorStrategy: string;
  
  /** Difficulty level: 'beginner', 'intermediate', 'advanced' */
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  
  /** Number of blocks in a typical quilt (e.g., "64 blocks" or "variable") */
  blockCount?: string;
  
  /** Estimated sewing time for a standard quilt */
  estimatedTime?: string;
  
  /** Special considerations or variations */
  notes?: string;
}

/**
 * Generates a prompt string from a template.
 * Used by Claude to generate layout and instructions for the pattern.
 */
export function generatePrompt(template: PatternPromptTemplate): string {
  return `
Pattern: ${template.name}
Pattern ID: ${template.id}
Difficulty: ${template.skillLevel}

Description:
${template.description}

Visual Characteristics:
${template.visualCharacteristics}

Color Strategy:
${template.colorStrategy}

Assembly Instructions:
${template.assemblyInstructions}

${template.blockCount ? `Block Count: ${template.blockCount}\n` : ''}
${template.estimatedTime ? `Estimated Sewing Time: ${template.estimatedTime}\n` : ''}
${template.notes ? `\nSpecial Notes:\n${template.notes}` : ''}

Please generate a detailed quilt pattern layout and step-by-step instructions based on the above specifications.
`.trim();
}

/**
 * Common prompt templates for built-in patterns.
 * Use these as starting points to ensure consistency across patterns.
 */
export const PROMPT_TEMPLATES: Record<string, PatternPromptTemplate> = {
  'four-patch': {
    id: 'four-patch',
    name: 'Four Patch',
    description: 'A classic beginner pattern made from 2×2 grids of fabric squares. Each block uses four fabric squares arranged in a simple grid.',
    assemblyInstructions: 'Sew four squares (2×2) into a block. Sew blocks into rows, then rows together.',
    visualCharacteristics: 'Simple geometric pattern with strong diagonal or checkerboard contrast. High visual impact with minimal pieces.',
    colorStrategy: '3-4 colors: background, primary, secondary, and optional accent. Colors rotate across blocks for movement.',
    skillLevel: 'beginner',
    blockCount: '64 blocks',
    estimatedTime: '8-12 hours',
    notes: 'Perfect for learning basic piecing. Minimal math required. Works well with contrast or scrappy color schemes.',
  },
  
  'nine-patch': {
    id: 'nine-patch',
    name: 'Nine Patch',
    description: 'A classic pattern using 3×3 grids of nine squares per block. The traditional design features five squares in one color (corners and center) and four in another (forming a cross/plus).',
    assemblyInstructions: 'Sew nine squares (3×3) into a block. Arrange blocks in a grid layout. Sew blocks into rows, then rows together.',
    visualCharacteristics: 'Balanced pattern with cross/plus motif. Works well as a secondary pattern mixed with sashing or borders.',
    colorStrategy: '2-5 colors: background (corners/center) stays consistent. Cross rotates through 1-4 additional colors for variety.',
    skillLevel: 'beginner',
    blockCount: '36 blocks',
    estimatedTime: '10-14 hours',
    notes: 'Can be scrappy or coordinated. Works beautifully in both styles. Consider alternating with sashing for extra visual interest.',
  },
  
  'simple-squares': {
    id: 'simple-squares',
    name: 'Simple Squares',
    description: 'The simplest pattern: a grid of individual fabric squares arranged in rows. Each square is a single piece of fabric.',
    assemblyInstructions: 'Arrange colored squares in a grid pattern. Sew into rows, then sew rows together.',
    visualCharacteristics: 'Direct, minimalist patchwork. Color arrangement creates the entire visual design.',
    colorStrategy: '2-8 colors arranged to create desired pattern. Colors can rotate, alternate, or form specific designs (stripes, blocks, etc.).',
    skillLevel: 'beginner',
    blockCount: 'Variable (typically 64, 100, or 144 squares)',
    estimatedTime: '4-8 hours',
    notes: 'Fastest quilt to make. Perfect for first projects or using up fabric scraps. Scrappy charm quilts work excellently here.',
  },
  
  'pinwheel': {
    id: 'pinwheel',
    name: 'Pinwheel',
    description: 'A dynamic pattern with triangular pieces arranged to create a spinning/whirling effect. Each block appears to rotate.',
    assemblyInstructions: 'Cut triangle pairs and sew into pinwheel blocks. Arrange blocks to enhance the whirling motion. Sew into rows, then rows together.',
    visualCharacteristics: 'Dynamic and energetic with strong rotational visual movement. Triangle orientation creates the spinning effect.',
    colorStrategy: '2-4 colors: background and 1-3 blade colors. Consistent positioning creates the dynamic pinwheel motion.',
    skillLevel: 'intermediate',
    blockCount: '64 blocks',
    estimatedTime: '12-16 hours',
    notes: 'Requires accurate cutting and piecing for clean points. Careful color placement enhances the spinning effect. Consider on-point (diamond) setting.',
  },
};

/**
 * Validates a prompt template for required fields.
 */
export function validatePromptTemplate(template: PatternPromptTemplate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!template.id) errors.push('Missing required field: id');
  if (!template.name) errors.push('Missing required field: name');
  if (!template.description) errors.push('Missing required field: description');
  if (!template.assemblyInstructions) errors.push('Missing required field: assemblyInstructions');
  if (!template.visualCharacteristics) errors.push('Missing required field: visualCharacteristics');
  if (!template.colorStrategy) errors.push('Missing required field: colorStrategy');
  if (!template.skillLevel) errors.push('Missing required field: skillLevel');
  if (!['beginner', 'intermediate', 'advanced'].includes(template.skillLevel)) {
    errors.push('Invalid skillLevel: must be beginner, intermediate, or advanced');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
