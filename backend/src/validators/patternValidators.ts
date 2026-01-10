// src/validators/patternValidators.ts

export interface ValidationError {
  success: false;
  message: string;
  statusCode: number;
}

export class PatternValidators {
  static readonly VALID_SKILL_LEVELS = ['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert'];
  static readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  static readonly MIN_IMAGES = 2;
  static readonly MAX_IMAGES = 9;

  static validateImages(images: any): ValidationError | null {
    if (!images || !Array.isArray(images)) {
      return {
        success: false,
        message: `Please provide ${this.MIN_IMAGES}-${this.MAX_IMAGES} fabric images`,
        statusCode: 400,
      };
    }

    if (images.length < this.MIN_IMAGES || images.length > this.MAX_IMAGES) {
      return {
        success: false,
        message: `Please provide ${this.MIN_IMAGES}-${this.MAX_IMAGES} fabric images`,
        statusCode: 400,
      };
    }

    return null;
  }

  static validateImageSizes(images: string[]): ValidationError | null {
    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
      const sizeInBytes = (base64Data.length * 3) / 4;
      if (sizeInBytes > this.MAX_IMAGE_SIZE) {
        return {
          success: false,
          message: `Image ${i + 1} exceeds 5MB limit`,
          statusCode: 400,
        };
      }
    }

    return null;
  }

  static validateSkillLevel(skillLevel?: string): ValidationError | null {
    if (skillLevel && !this.VALID_SKILL_LEVELS.includes(skillLevel)) {
      return {
        success: false,
        message: 'Invalid skill level',
        statusCode: 400,
      };
    }

    return null;
  }

  static validateUserId(userId?: string): ValidationError | null {
    if (!userId) {
      return {
        success: false,
        message: 'Unauthorized',
        statusCode: 401,
      };
    }

    return null;
  }
}
