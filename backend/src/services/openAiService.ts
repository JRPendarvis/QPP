import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI Service
 * Responsible for generating realistic quilt pattern images using DALL-E
 * with GPT-4 Vision analysis of actual fabric images
 */
export class OpenAiService {
  /**
   * Analyze fabric images using GPT-4 Vision to get detailed descriptions
   * @param fabricImages - Array of base64 encoded fabric images
   * @returns Array of detailed fabric descriptions
   */
  async analyzeFabricImages(fabricImages: string[]): Promise<string[]> {
    try {
      console.log(`🔍 [GPT-4V] Analyzing ${fabricImages.length} fabric images...`);
      
      const descriptions: string[] = [];
      
      for (let i = 0; i < fabricImages.length; i++) {
        let imageUrl = fabricImages[i];
        
        // Ensure image has proper data URL format
        if (!imageUrl.startsWith('data:')) {
          imageUrl = `data:image/jpeg;base64,${imageUrl}`;
        }
        
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Describe this fabric in one short sentence for recreating it in an image. Include: exact colors (with hex codes if possible), pattern type, and scale. Example: "Navy blue (#1a237e) with small white polka dots"'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 80
        });
        
        const description = response.choices[0]?.message?.content || 'cotton fabric';
        descriptions.push(description);
        console.log(`   Fabric ${i + 1}: ${description}`);
      }
      
      console.log('✅ [GPT-4V] Fabric analysis complete');
      return descriptions;
    } catch (error) {
      console.error('❌ [GPT-4V] Error analyzing fabrics:', error);
      return fabricImages.map(() => 'cotton quilting fabric');
    }
  }

  /**
   * Generate a realistic quilt pattern image using DALL-E 3
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
    try {
      // First, analyze the actual fabric images with GPT-4 Vision
      const fabricDescriptions = await this.analyzeFabricImages(fabricImages);
      
      // Build detailed prompt using actual fabric descriptions
      const prompt = this.buildImagePrompt(patternName, description, fabricDescriptions, patternType);
      
      console.log('🎨 [DALL-E] Generating quilt image...');
      console.log(`   Prompt: ${prompt.substring(0, 150)}...`);
      
      // Generate image with DALL-E 3
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
  private buildImagePrompt(
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
