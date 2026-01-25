import { EmailTemplateBuilder } from '../emailTemplateBuilder';

describe('EmailTemplateBuilder', () => {
  describe('buildWelcomeEmail', () => {
    it('should build welcome email with name', () => {
      const html = EmailTemplateBuilder.buildWelcomeEmail('Alice');

      expect(html).toContain('Hi Alice,');
      expect(html).toContain('Welcome to Quilt Planner Pro!');
      expect(html).toContain('Upload your fabric images');
      expect(html).toContain('Generate AI-powered quilt patterns');
      expect(html).toContain('Download PDF instructions');
      expect(html).toContain('https://www.quiltplannerpro.com/dashboard');
      expect(html).toContain('Start Creating');
      expect(html).toContain('Happy quilting!');
      expect(html).toContain('quiltplannerpro@gmail.com');
    });

    it('should build welcome email without name', () => {
      const html = EmailTemplateBuilder.buildWelcomeEmail();

      expect(html).toContain('Hi there,');
      expect(html).toContain('Welcome to Quilt Planner Pro!');
    });

    it('should build welcome email with undefined name', () => {
      const html = EmailTemplateBuilder.buildWelcomeEmail(undefined);

      expect(html).toContain('Hi there,');
    });

    it('should include all action items', () => {
      const html = EmailTemplateBuilder.buildWelcomeEmail('User');

      expect(html).toContain('<li>Upload your fabric images</li>');
      expect(html).toContain('<li>Generate AI-powered quilt patterns</li>');
      expect(html).toContain('<li>Download PDF instructions</li>');
    });

    it('should use consistent styling', () => {
      const html = EmailTemplateBuilder.buildWelcomeEmail();

      expect(html).toContain('color: #4F46E5');
      expect(html).toContain('max-width: 600px');
      expect(html).toContain('font-family: Arial, sans-serif');
    });

    it('should include CTA button with correct styling', () => {
      const html = EmailTemplateBuilder.buildWelcomeEmail();

      expect(html).toContain('background-color: #4F46E5');
      expect(html).toContain('padding: 12px 24px');
      expect(html).toContain('text-decoration: none');
    });
  });

  describe('buildPasswordResetEmail', () => {
    it('should build password reset email with URL', () => {
      const resetUrl = 'https://example.com/reset?token=abc123';
      const html = EmailTemplateBuilder.buildPasswordResetEmail(resetUrl);

      expect(html).toContain('Reset Your Password');
      expect(html).toContain('You requested a password reset');
      expect(html).toContain(resetUrl);
      expect(html).toContain('Reset Password');
      expect(html).toContain('This link expires in 1 hour');
      expect(html).toContain('If you didn\'t request this');
    });

    it('should include reset URL in button href', () => {
      const resetUrl = 'https://app.com/reset/token123';
      const html = EmailTemplateBuilder.buildPasswordResetEmail(resetUrl);

      expect(html).toContain(`href="${resetUrl}"`);
    });

    it('should include reset URL in fallback text', () => {
      const resetUrl = 'https://test.com/reset';
      const html = EmailTemplateBuilder.buildPasswordResetEmail(resetUrl);

      expect(html).toContain('If the button doesn\'t work');
      expect(html).toContain(resetUrl);
    });

    it('should have consistent styling with welcome email', () => {
      const html = EmailTemplateBuilder.buildPasswordResetEmail('https://example.com');

      expect(html).toContain('color: #4F46E5');
      expect(html).toContain('max-width: 600px');
      expect(html).toContain('background-color: #4F46E5');
    });

    it('should handle different URL formats', () => {
      const urls = [
        'http://localhost:3000/reset?token=123',
        'https://quiltplannerpro.com/reset-password/abc',
        'https://app.example.com/auth/reset?t=xyz&exp=1234'
      ];

      urls.forEach(url => {
        const html = EmailTemplateBuilder.buildPasswordResetEmail(url);
        expect(html).toContain(url);
      });
    });
  });

  describe('buildFeedbackNotificationEmail', () => {
    it('should build feedback notification with all fields', () => {
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'user@example.com',
        'John Doe',
        'Feature Request',
        'Please add dark mode support'
      );

      expect(html).toContain('New Feedback Received');
      expect(html).toContain('John Doe');
      expect(html).toContain('user@example.com');
      expect(html).toContain('Feature Request');
      expect(html).toContain('Please add dark mode support');
      expect(html).toContain('https://www.quiltplannerpro.com/dashboard/feedback');
    });

    it('should handle undefined userName', () => {
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'user@test.com',
        undefined,
        'Bug Report',
        'App crashes on upload'
      );

      expect(html).toContain('Anonymous');
      expect(html).toContain('user@test.com');
      expect(html).toContain('Bug Report');
      expect(html).toContain('App crashes on upload');
    });

    it('should handle null description', () => {
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'user@example.com',
        'Alice Smith',
        'Quick Feedback',
        null
      );

      expect(html).toContain('Alice Smith');
      expect(html).toContain('Quick Feedback');
      expect(html).not.toContain('Description:');
    });

    it('should handle empty description', () => {
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'user@example.com',
        'Bob',
        'Suggestion',
        ''
      );

      expect(html).toContain('Bob');
      expect(html).toContain('Suggestion');
      // Empty string is falsy, so description block should not appear
      expect(html).not.toContain('Description:');
    });

    it('should preserve whitespace in description', () => {
      const description = 'Line 1\nLine 2\n  Indented line';
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'user@example.com',
        'User',
        'Multi-line feedback',
        description
      );

      expect(html).toContain('white-space: pre-wrap');
      expect(html).toContain(description);
    });

    it('should include dashboard link', () => {
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'user@example.com',
        'User',
        'Title',
        'Description'
      );

      expect(html).toContain('View all feedback');
      expect(html).toContain('https://www.quiltplannerpro.com/dashboard/feedback');
    });

    it('should use consistent styling', () => {
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'user@example.com',
        'User',
        'Title',
        'Description'
      );

      expect(html).toContain('color: #4F46E5');
      expect(html).toContain('max-width: 600px');
      expect(html).toContain('background: #f9fafb');
    });

    it('should display sender information prominently', () => {
      const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(
        'sender@example.com',
        'Sender Name',
        'Important Feedback',
        'Details here'
      );

      expect(html).toContain('<strong>From:</strong>');
      expect(html).toContain('Sender Name (sender@example.com)');
      expect(html).toContain('<strong>Title:</strong>');
      expect(html).toContain('Important Feedback');
    });
  });
});
