import { FabricImageAnalyzer } from './fabricImageAnalyzer';
import { QuiltImageGenerator } from './quiltImageGenerator';

/**
 * OpenAI Service (Legacy)
 * Facade for fabric image analysis and quilt image generation
 * 
 * @deprecated This service is maintained for backward compatibility.
 * New code should use FabricImageAnalyzer and QuiltImageGenerator directly.
 */
export class OpenAiService {
  private fabricAnalyzer: FabricImageAnalyzer;
  private imageGenerator: QuiltImageGenerator;

  constructor() {
    this.fabricAnalyzer = new FabricImageAnalyzer();
    this.imageGenerator = new QuiltImageGenerator();
  }

  /**
   * Analyze fabric images using GPT-4 Vision to get detailed descriptions
   * @deprecated Use FabricImageAnalyzer.analyze() directly
   * @param fabricImages - Array of base64 encoded fabric images
   * @returns Array of detailed fabric descriptions
   */
  async analyzeFabricImages(fabricImages: string[]): Promise<string[]> {
    return this.fabricAnalyzer.analyze(fabricImages);
  }

  /**
   * Generate a realistic quilt pattern image using DALL-E 3
   * @deprecated Use FabricImageAnalyzer.analyze() + QuiltImageGenerator.generate() directly
   * @param patternName - Name of the quilt pattern
   * @param description - Description of the pattern
   * @param fabricImages - Array of base64 encoded fabric images for GPT-4V analysis
   * @param patternType - Type of quilt pattern (e.g., "log-cabin", "ohio-star")
   * @returns URL of the generated image
   */
  async generateQuiltImage(
    patternName: string,
    description: string,
    fabricImages: string[],
    patternType: string
  ): Promise<string> {
    const fabricDescriptions = await this.fabricAnalyzer.analyze(fabricImages);
    return this.imageGenerator.generate(patternName, description, fabricDescriptions, patternType);
  }
}
