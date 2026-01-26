import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Service for analyzing fabric images using GPT-4 Vision
 */
export class FabricImageAnalyzer {
  /**
   * Analyze fabric images using GPT-4 Vision to get detailed descriptions
   * 
   * @param fabricImages - Array of base64 encoded fabric images
   * @returns Array of detailed fabric descriptions
   */
  async analyze(fabricImages: string[]): Promise<string[]> {
    try {
      console.log(`🔍 [GPT-4V] Analyzing ${fabricImages.length} fabric images...`);
      
      const descriptions: string[] = [];
      
      for (let i = 0; i < fabricImages.length; i++) {
        const imageUrl = this.ensureDataUrlFormat(fabricImages[i]);
        const description = await this.analyzeImage(imageUrl, i);
        descriptions.push(description);
      }
      
      console.log('✅ [GPT-4V] Fabric analysis complete');
      return descriptions;
    } catch (error) {
      console.error('❌ [GPT-4V] Error analyzing fabrics:', error);
      return fabricImages.map(() => 'cotton quilting fabric');
    }
  }

  /**
   * Ensure image has proper data URL format
   */
  private ensureDataUrlFormat(imageUrl: string): string {
    if (!imageUrl.startsWith('data:')) {
      return `data:image/jpeg;base64,${imageUrl}`;
    }
    return imageUrl;
  }

  /**
   * Analyze a single fabric image
   */
  private async analyzeImage(imageUrl: string, index: number): Promise<string> {
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
    console.log(`   Fabric ${index + 1}: ${description}`);
    
    return description;
  }
}
