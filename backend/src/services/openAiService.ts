import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI Service
 * Responsible for generating realistic quilt pattern images using DALL-E
 */
export class OpenAiService {
  /**
   * Generate a realistic quilt pattern image using DALL-E 3
   * @param patternName - Name of the quilt pattern
   * @param description - Description of the pattern
   * @param fabricColors - Array of fabric colors (hex codes)
   * @param patternType - Type of quilt pattern (e.g., "log-cabin", "ohio-star")
   * @returns URL of the generated image
   */
  async generateQuiltImage(
    patternName: string,
    description: string,
    fabricColors: string[],
    patternType: string
  ): Promise<string> {
    try {
      // Build detailed prompt for DALL-E
      const prompt = this.buildImagePrompt(patternName, description, fabricColors, patternType);
      
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
    fabricColors: string[],
    patternType: string
  ): string {
    const colorDescriptions = this.convertHexToColorNames(fabricColors);
    
    return `A beautifully crafted, professional photograph of a finished ${patternName} quilt pattern laid flat on a white background. The quilt features a ${patternType} design with ${colorDescriptions} fabrics. ${description}. The quilt should look handmade with visible stitching, showing realistic fabric texture and depth. Professional product photography style, well-lit, high quality, detailed quilting work. The entire quilt should be visible in the frame, photographed from directly above.`;
  }

  /**
   * Convert hex color codes to descriptive color names for better DALL-E prompting
   */
  private convertHexToColorNames(hexColors: string[]): string {
    const colorMap: { [key: string]: string } = {
      '#FF': 'red',
      '#00FF': 'green',
      '#0000FF': 'blue',
      '#FFFF': 'yellow',
      '#FF00FF': 'magenta',
      '#00FFFF': 'cyan',
      '#FFA5': 'orange',
      '#800080': 'purple',
      '#FFC0CB': 'pink',
      '#A52A2A': 'brown',
      '#808080': 'gray',
      '#000000': 'black',
      '#FFFFFF': 'white',
    };

    const colorNames = hexColors.map((hex) => {
      // Simple color detection based on RGB values
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);

      if (r > 200 && g < 100 && b < 100) return 'red';
      if (r < 100 && g > 200 && b < 100) return 'green';
      if (r < 100 && g < 100 && b > 200) return 'blue';
      if (r > 200 && g > 200 && b < 100) return 'yellow';
      if (r > 200 && g > 150 && b < 100) return 'orange';
      if (r > 150 && g < 100 && b > 150) return 'purple';
      if (r > 200 && g > 150 && b > 150) return 'pink';
      if (r > 100 && g > 50 && b < 50) return 'brown';
      if (r < 50 && g < 50 && b < 50) return 'black';
      if (r > 200 && g > 200 && b > 200) return 'white';
      if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) return 'gray';
      
      return 'multicolored';
    });

    // Remove duplicates and join
    const uniqueColors = [...new Set(colorNames)];
    
    if (uniqueColors.length === 1) return uniqueColors[0];
    if (uniqueColors.length === 2) return `${uniqueColors[0]} and ${uniqueColors[1]}`;
    
    const lastColor = uniqueColors.pop();
    return `${uniqueColors.join(', ')}, and ${lastColor}`;
  }
}
