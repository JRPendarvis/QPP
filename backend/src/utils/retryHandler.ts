/**
 * Retry logic with exponential backoff for API calls
 */
export class RetryHandler {
  /**
   * Execute a function with retry logic and exponential backoff
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    operationName: string = 'Operation'
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 ${operationName} attempt ${attempt}/${maxRetries}`);
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Check if it's an overloaded error
        const isOverloaded = this.isOverloadedError(error);
        
        if (isOverloaded && attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`⏳ API overloaded, retrying in ${waitTime/1000}s (attempt ${attempt + 1}/${maxRetries})...`);
          await this.sleep(waitTime);
        } else if (attempt === maxRetries) {
          console.error(`❌ Failed after ${maxRetries} attempts`);
          if (isOverloaded) {
            throw new Error('API is currently experiencing high demand. Please try again in a few moments.');
          }
          throw error;
        } else {
          // Non-overload error, throw immediately
          throw error;
        }
      }
    }

    throw lastError || new Error(`Failed to complete ${operationName}`);
  }

  /**
   * Check if error is an overloaded/rate limit error
   */
  private static isOverloadedError(error: any): boolean {
    return error?.error?.error?.type === 'overloaded_error' || 
           error?.message?.includes('Overloaded') ||
           error?.message?.includes('overloaded');
  }

  /**
   * Sleep for specified milliseconds
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
