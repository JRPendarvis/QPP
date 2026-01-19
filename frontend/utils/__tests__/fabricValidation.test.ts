import { isValidImageType, isValidSize } from '../fabricValidation';

describe('fabricValidation', () => {
  describe('isValidImageType', () => {
    it('should accept PNG files', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      expect(isValidImageType(file)).toBe(true);
    });

    it('should accept JPG files', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpg' });
      expect(isValidImageType(file)).toBe(true);
    });

    it('should accept JPEG files', () => {
      const file = new File([''], 'test.jpeg', { type: 'image/jpeg' });
      expect(isValidImageType(file)).toBe(true);
    });

    it('should accept WebP files', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      expect(isValidImageType(file)).toBe(true);
    });

    it('should reject GIF files', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      expect(isValidImageType(file)).toBe(false);
    });

    it('should reject SVG files', () => {
      const file = new File([''], 'test.svg', { type: 'image/svg+xml' });
      expect(isValidImageType(file)).toBe(false);
    });

    it('should reject BMP files', () => {
      const file = new File([''], 'test.bmp', { type: 'image/bmp' });
      expect(isValidImageType(file)).toBe(false);
    });

    it('should reject non-image files', () => {
      const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const txtFile = new File([''], 'test.txt', { type: 'text/plain' });
      const docFile = new File([''], 'test.doc', { type: 'application/msword' });
      
      expect(isValidImageType(pdfFile)).toBe(false);
      expect(isValidImageType(txtFile)).toBe(false);
      expect(isValidImageType(docFile)).toBe(false);
    });

    it('should handle empty file type', () => {
      const file = new File([''], 'test', { type: '' });
      expect(isValidImageType(file)).toBe(false);
    });
  });

  describe('isValidSize', () => {
    it('should accept files under 5MB by default', () => {
      const size = 4 * 1024 * 1024; // 4MB
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file)).toBe(true);
    });

    it('should accept files exactly at 5MB by default', () => {
      const size = 5 * 1024 * 1024; // 5MB exactly
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file)).toBe(true);
    });

    it('should reject files over 5MB by default', () => {
      const size = 6 * 1024 * 1024; // 6MB
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file)).toBe(false);
    });

    it('should accept very small files', () => {
      const size = 100 * 1024; // 100KB
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file)).toBe(true);
    });

    it('should accept custom maxSize parameter', () => {
      const customMax = 10 * 1024 * 1024; // 10MB
      const size = 8 * 1024 * 1024; // 8MB
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file, customMax)).toBe(true);
    });

    it('should reject files over custom maxSize', () => {
      const customMax = 2 * 1024 * 1024; // 2MB
      const size = 3 * 1024 * 1024; // 3MB
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file, customMax)).toBe(false);
    });

    it('should handle zero-byte files', () => {
      const file = new File([], 'empty.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file)).toBe(true);
    });

    it('should handle very large files', () => {
      const size = 50 * 1024 * 1024; // 50MB
      const file = new File([new ArrayBuffer(size)], 'large.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file)).toBe(false);
    });

    it('should accept files at exact custom threshold', () => {
      const customMax = 3 * 1024 * 1024; // 3MB
      const size = 3 * 1024 * 1024; // 3MB exactly
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidSize(file, customMax)).toBe(true);
    });
  });

  describe('combined validation', () => {
    it('should validate both type and size for valid image', () => {
      const size = 2 * 1024 * 1024; // 2MB
      const file = new File([new ArrayBuffer(size)], 'test.png', { type: 'image/png' });
      
      expect(isValidImageType(file)).toBe(true);
      expect(isValidSize(file)).toBe(true);
    });

    it('should reject invalid type even with valid size', () => {
      const size = 2 * 1024 * 1024; // 2MB
      const file = new File([new ArrayBuffer(size)], 'test.gif', { type: 'image/gif' });
      
      expect(isValidImageType(file)).toBe(false);
      expect(isValidSize(file)).toBe(true);
    });

    it('should reject invalid size even with valid type', () => {
      const size = 10 * 1024 * 1024; // 10MB
      const file = new File([new ArrayBuffer(size)], 'test.jpg', { type: 'image/jpeg' });
      
      expect(isValidImageType(file)).toBe(true);
      expect(isValidSize(file)).toBe(false);
    });
  });
});
