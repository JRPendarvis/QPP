/**
 * Logs fabric building context
 */
export class FabricBuildLogger {
  /**
   * Logs fabric building details
   */
  static log(
    fabricAnalysis: any[],
    fabricColors: string[],
    fabricImages: string[]
  ): void {
    console.log('🧵 [FabricAssembler] Building fabrics:', {
      fabricAnalysisCount: fabricAnalysis.length,
      fabricColorsCount: fabricColors.length,
      fabricImagesCount: fabricImages.length,
      analysis: fabricAnalysis.map((fa: any) => ({ 
        type: fa.type, 
        fabricType: fa.fabricType,
        hasImage: !!fabricImages[fabricAnalysis.indexOf(fa)] 
      }))
    });
  }
}
