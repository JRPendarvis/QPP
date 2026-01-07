import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  currentUsage?: number;
  limit?: number;
}

/**
 * Error handling utilities
 * Single Responsibility: Error parsing and formatting
 */
export class ErrorHandler {
  /**
   * Parse and format pattern generation errors
   */
  static parsePatternError(error: unknown): string {
    const axiosError = error as AxiosError<ErrorResponse>;
    
    // Check if it's a subscription/limit error (403)
    if (axiosError.response?.status === 403) {
      const errorMsg = axiosError.response?.data?.message || 'Subscription limit reached';
      return `SUBSCRIPTION_ERROR: ${errorMsg}`;
    }
    
    // Generic error handling
    return axiosError.response?.data?.message || 'Failed to generate pattern. Please try again.';
  }

  /**
   * Check if error is a subscription error
   */
  static isSubscriptionError(errorMessage: string): boolean {
    return errorMessage.startsWith('SUBSCRIPTION_ERROR:');
  }

  /**
   * Extract user-friendly message from error
   */
  static getUserMessage(errorMessage: string): string {
    if (this.isSubscriptionError(errorMessage)) {
      return errorMessage.replace('SUBSCRIPTION_ERROR: ', '');
    }
    return errorMessage;
  }
}
