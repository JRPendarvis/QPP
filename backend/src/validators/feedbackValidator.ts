export class FeedbackValidator {
  /**
   * Validate feedback creation input
   */
  static validateCreateFeedback(title: string): { valid: boolean; message?: string } {
    if (!title) {
      return { valid: false, message: 'Title is required' };
    }

    if (typeof title !== 'string') {
      return { valid: false, message: 'Title must be a string' };
    }

    if (title.trim().length === 0) {
      return { valid: false, message: 'Title cannot be empty' };
    }

    if (title.length > 200) {
      return { valid: false, message: 'Title must be 200 characters or less' };
    }

    return { valid: true };
  }

  /**
   * Validate feedback ID
   */
  static validateFeedbackId(id: string): { valid: boolean; message?: string } {
    if (!id || typeof id !== 'string') {
      return { valid: false, message: 'Invalid feedback ID' };
    }

    return { valid: true };
  }
}
