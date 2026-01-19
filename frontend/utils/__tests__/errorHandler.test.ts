import { ErrorHandler } from '../errorHandler';
import { AxiosError } from 'axios';

describe('ErrorHandler', () => {
  describe('parsePatternError', () => {
    it('should parse 403 subscription errors', () => {
      const error = {
        response: {
          status: 403,
          data: {
            message: 'You have reached your monthly generation limit'
          }
        }
      } as AxiosError<{ message: string }>;

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('SUBSCRIPTION_ERROR: You have reached your monthly generation limit');
    });

    it('should handle 403 without message', () => {
      const error = {
        response: {
          status: 403,
          data: {}
        }
      } as AxiosError<{ message?: string }>;

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('SUBSCRIPTION_ERROR: Subscription limit reached');
    });

    it('should handle generic errors with message', () => {
      const error = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error'
          }
        }
      } as AxiosError<{ message: string }>;

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('Internal server error');
    });

    it('should handle errors without response data message', () => {
      const error = {
        response: {
          status: 400,
          data: {}
        }
      } as AxiosError<{ message?: string }>;

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('Failed to generate pattern. Please try again.');
    });

    it('should handle errors without response', () => {
      const error = {
        message: 'Network Error'
      } as AxiosError;

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('Failed to generate pattern. Please try again.');
    });

    it('should handle 401 unauthorized errors', () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized access'
          }
        }
      } as AxiosError<{ message: string }>;

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('Unauthorized access');
    });

    it('should handle 404 not found errors', () => {
      const error = {
        response: {
          status: 404,
          data: {
            message: 'Pattern not found'
          }
        }
      } as AxiosError<{ message: string }>;

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('Pattern not found');
    });

    it('should handle non-Axios errors', () => {
      const error = new Error('Random error');

      const result = ErrorHandler.parsePatternError(error);
      
      expect(result).toBe('Failed to generate pattern. Please try again.');
    });
  });

  describe('isSubscriptionError', () => {
    it('should identify subscription errors', () => {
      const errorMessage = 'SUBSCRIPTION_ERROR: You have reached your limit';
      
      expect(ErrorHandler.isSubscriptionError(errorMessage)).toBe(true);
    });

    it('should identify non-subscription errors', () => {
      const errorMessage = 'Failed to generate pattern. Please try again.';
      
      expect(ErrorHandler.isSubscriptionError(errorMessage)).toBe(false);
    });

    it('should handle empty string', () => {
      expect(ErrorHandler.isSubscriptionError('')).toBe(false);
    });

    it('should handle partial matches', () => {
      const errorMessage = 'Error: SUBSCRIPTION_ERROR in the middle';
      
      expect(ErrorHandler.isSubscriptionError(errorMessage)).toBe(false);
    });

    it('should be case sensitive', () => {
      const errorMessage = 'subscription_error: lowercase';
      
      expect(ErrorHandler.isSubscriptionError(errorMessage)).toBe(false);
    });
  });

  describe('getUserMessage', () => {
    it('should strip SUBSCRIPTION_ERROR prefix from subscription errors', () => {
      const errorMessage = 'SUBSCRIPTION_ERROR: You have reached your monthly limit';
      
      const result = ErrorHandler.getUserMessage(errorMessage);
      
      expect(result).toBe('You have reached your monthly limit');
    });

    it('should return generic errors unchanged', () => {
      const errorMessage = 'Failed to generate pattern. Please try again.';
      
      const result = ErrorHandler.getUserMessage(errorMessage);
      
      expect(result).toBe('Failed to generate pattern. Please try again.');
    });

    it('should handle empty string', () => {
      const result = ErrorHandler.getUserMessage('');
      
      expect(result).toBe('');
    });

    it('should handle subscription error with multiple colons', () => {
      const errorMessage = 'SUBSCRIPTION_ERROR: Error: Limit exceeded';
      
      const result = ErrorHandler.getUserMessage(errorMessage);
      
      expect(result).toBe('Error: Limit exceeded');
    });

    it('should handle subscription error with empty message', () => {
      const errorMessage = 'SUBSCRIPTION_ERROR: ';
      
      const result = ErrorHandler.getUserMessage(errorMessage);
      
      expect(result).toBe('');
    });
  });

  describe('integration', () => {
    it('should parse and extract user message from 403 error', () => {
      const error = {
        response: {
          status: 403,
          data: {
            message: 'You have exceeded your plan limits',
            currentUsage: 5,
            limit: 5
          }
        }
      } as AxiosError<{ message: string; currentUsage: number; limit: number }>;

      const parsed = ErrorHandler.parsePatternError(error);
      const isSubscription = ErrorHandler.isSubscriptionError(parsed);
      const userMessage = ErrorHandler.getUserMessage(parsed);
      
      expect(isSubscription).toBe(true);
      expect(userMessage).toBe('You have exceeded your plan limits');
    });

    it('should parse and extract user message from generic error', () => {
      const error = {
        response: {
          status: 500,
          data: {
            message: 'Server error occurred'
          }
        }
      } as AxiosError<{ message: string }>;

      const parsed = ErrorHandler.parsePatternError(error);
      const isSubscription = ErrorHandler.isSubscriptionError(parsed);
      const userMessage = ErrorHandler.getUserMessage(parsed);
      
      expect(isSubscription).toBe(false);
      expect(userMessage).toBe('Server error occurred');
    });
  });
});
