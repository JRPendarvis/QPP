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
                  text: 'Analyze this quilting fabric in detail. Describe: 1) Primary colors (be specific with shades), 2) Pattern type (solid, floral, geometric, dots, stripes, batik, etc.), 3) Pattern scale (small, medium, large), 4) Visual texture and style (vintage, modern, traditional, whimsical). Be concise but detailed - this will be used to recreate the fabric in a quilt visualization.'
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
          max_tokens: 150
        });
        
        const description = response.choices[0]?.message?.content || 'unknown fabric';
        descriptions.push(description);
        console.log(`   Fabric ${i + 1}: ${description.substring(0, 80)}...`);
      }
      
      console.log('✅ [GPT-4V] Fabric analysis complete');
      return descriptions;
    } catch (error) {
      console.error('❌ [GPT-4V] Error analyzing fabrics:', error);
      return fabricImages.map(() => 'quilting cotton fabric');
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
   * Build a detailed prompt for DALL-E to generate a realistic quilt image
   */
  private buildImagePrompt(
    patternName: string,
    description: string,
    fabricDescriptions: string[],
    patternType: string
  ): string {
    const fabricList = fabricDescriptions.map((desc, i) => `Fabric ${i + 1}: ${desc}`).join('. ');
    
    return `Professional flat-lay photograph of a handmade ${patternName} quilt laid completely flat on a pure white background, photographed from directly above. CRITICAL: Use ONLY these ${fabricDescriptions.length} specific fabrics exactly as described: ${fabricList}. Do NOT add any additional fabrics or colors. Match these exact fabric descriptions as closely as possible. The quilt follows a traditional ${patternType} pattern design. The quilt is perfectly flat with no folds, no wrinkles, no draping, and no 3D effects. Show realistic quilting cotton fabric texture with visible hand stitching and quilting detail. Bright even lighting, sharp focus, high resolution. The entire quilt fills the frame, centered, photographed straight down from above.`;
  }
}
