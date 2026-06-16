import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  currentUsage?: number;
  limit?: number;
  debug?: {
    message?: string;
  };
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

    if (!axiosError?.response) {
      return 'Unable to reach the server. Please check your connection and try again.';
    }
    
    // Check if it's a subscription/limit error (403)
    if (axiosError.response?.status === 403) {
      const errorMsg = axiosError.response?.data?.message || 'Subscription limit reached';
      return `SUBSCRIPTION_ERROR: ${errorMsg}`;
    }

    if (axiosError.response?.status >= 500) {
      const baseMessage = axiosError.response?.data?.message || 'Failed to generate pattern. Please try again.';
      const debugMessage = axiosError.response?.data?.debug?.message;

      if (process.env.NODE_ENV !== 'production' && debugMessage) {
        return `${baseMessage} [debug: ${debugMessage}]`;
      }

      return baseMessage;
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
