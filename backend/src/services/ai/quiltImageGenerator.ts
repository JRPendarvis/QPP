import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Service for generating quilt pattern images using DALL-E
 */
export class QuiltImageGenerator {
  /**
   * Generate a realistic quilt pattern image using DALL-E 3
   * 
   * @param patternName - Name of the quilt pattern
   * @param description - Description of the pattern
   * @param fabricDescriptions - Array of fabric descriptions from GPT-4V analysis
   * @param patternType - Type of quilt pattern (e.g., "log-cabin", "ohio-star")
   * @returns URL of the generated image, or empty string if generation fails
   */
  async generate(
    patternName: string,
    description: string,
    fabricDescriptions: string[],
    patternType: string
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt(patternName, description, fabricDescriptions, patternType);
      
      console.log('🎨 [DALL-E] Generating quilt image...');
      console.log(`   Prompt: ${prompt.substring(0, 150)}...`);
      
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural',
      });

      const imageUrl = response.data?.[0]?.url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E');
      }

      console.log('✅ [DALL-E] Image generated successfully');
      console.log(`   URL: ${imageUrl.substring(0, 50)}...`);
      
      return imageUrl;
    } catch (error) {
      console.error('❌ [DALL-E] Error generating image:', error);
      // Don't throw - return empty string so SVG can be used as fallback
      return '';
    }
  }

  /**
   * Build a simplified prompt for DALL-E to generate a realistic quilt image
   */
  private buildPrompt(
    patternName: string,
    description: string,
    fabricDescriptions: string[],
    patternType: string
  ): string {
    // Simplify fabric descriptions for better DALL-E matching
    const fabricList = fabricDescriptions.map((desc, i) => `${i + 1}. ${desc}`).join('; ');
    
    return `Flat-lay photo of ${patternName} quilt on white background, aerial view. ${patternType} pattern using exactly these fabrics: ${fabricList}. No other colors or fabrics. Completely flat, no folds or shadows. Hand-quilted cotton, clear lighting.`;
  }
}
