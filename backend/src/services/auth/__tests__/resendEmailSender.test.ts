import { ResendEmailSender } from '../resendEmailSender';
import { Resend } from 'resend';

// Mock Resend SDK
jest.mock('resend');

const MockedResend = Resend as jest.MockedClass<typeof Resend>;

// Mock console methods
global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

describe('ResendEmailSender', () => {
  let sender: ResendEmailSender;
  let mockResendInstance: any;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    
    // Create mock Resend instance
    mockResendInstance = {
      emails: {
        send: jest.fn(),
      },
    };
    
    MockedResend.mockImplementation(() => mockResendInstance);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should initialize with API key', () => {
      process.env.RESEND_API_KEY = 'test-key';
      sender = new ResendEmailSender();

      expect(sender.isAvailable()).toBe(true);
      expect(MockedResend).toHaveBeenCalledWith('test-key');
    });

    it('should handle missing API key', () => {
      delete process.env.RESEND_API_KEY;
      sender = new ResendEmailSender();

      expect(sender.isAvailable()).toBe(false);
    });

    it('should log warning when debug enabled and no API key', () => {
      delete process.env.RESEND_API_KEY;
      process.env.DEBUG_EMAIL = 'true';
      
      sender = new ResendEmailSender();

      expect(console.warn).toHaveBeenCalledWith('⚠️  RESEND_API_KEY not found - email functionality disabled');
    });

    it('should not log warning when debug disabled', () => {
      delete process.env.RESEND_API_KEY;
      process.env.DEBUG_EMAIL = 'false';
      
      sender = new ResendEmailSender();

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('send', () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = 'test-key';
      sender = new ResendEmailSender();
    });

    it('should send email successfully', async () => {
      mockResendInstance.emails.send.mockResolvedValueOnce({ id: 'email-123' });

      await sender.send('user@example.com', 'Test Subject', '<p>Test HTML</p>');

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
        from: 'Quilt Planner Pro <noreply@quiltplannerpro.com>',
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>'
      });
    });

    it('should send email with replyTo', async () => {
      mockResendInstance.emails.send.mockResolvedValueOnce({ id: 'email-456' });

      await sender.send(
        'admin@example.com',
        'Contact Form',
        '<p>Message</p>',
        'sender@example.com'
      );

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
        from: 'Quilt Planner Pro <noreply@quiltplannerpro.com>',
        to: 'admin@example.com',
        subject: 'Contact Form',
        html: '<p>Message</p>',
        replyTo: 'sender@example.com'
      });
    });

    it('should log debug message when enabled', async () => {
      process.env.DEBUG_EMAIL = 'true';
      sender = new ResendEmailSender();
      mockResendInstance.emails.send.mockResolvedValueOnce({ id: 'email-789' });

      await sender.send('test@example.com', 'Debug Test', '<p>Content</p>');

      expect(console.log).toHaveBeenCalledWith('[ResendEmailSender] Email sent to test@example.com: "Debug Test"');
    });

    it('should not log when debug disabled', async () => {
      process.env.DEBUG_EMAIL = 'false';
      sender = new ResendEmailSender();
      mockResendInstance.emails.send.mockResolvedValueOnce({ id: 'email-000' });

      await sender.send('user@example.com', 'Subject', '<p>HTML</p>');

      expect(console.log).not.toHaveBeenCalled();
    });

    it('should throw error on send failure', async () => {
      const error = new Error('Resend API error');
      mockResendInstance.emails.send.mockRejectedValueOnce(error);

      await expect(
        sender.send('user@example.com', 'Subject', '<p>HTML</p>')
      ).rejects.toThrow('Resend API error');
    });

    it('should log error on send failure', async () => {
      const error = new Error('API failure');
      mockResendInstance.emails.send.mockRejectedValueOnce(error);

      try {
        await sender.send('fail@example.com', 'Will Fail', '<p>Test</p>');
      } catch (e) {
        // Expected to throw
      }

      expect(console.error).toHaveBeenCalledWith(
        '[ResendEmailSender] Failed to send email to fail@example.com:',
        error
      );
    });

    it('should skip sending when service unavailable', async () => {
      delete process.env.RESEND_API_KEY;
      sender = new ResendEmailSender();

      await sender.send('user@example.com', 'Subject', '<p>HTML</p>');

      expect(mockResendInstance.emails.send).not.toHaveBeenCalled();
    });

    it('should log skip message when debug enabled and unavailable', async () => {
      delete process.env.RESEND_API_KEY;
      process.env.DEBUG_EMAIL = 'true';
      sender = new ResendEmailSender();

      await sender.send('user@example.com', 'Subject', '<p>HTML</p>');

      expect(console.log).toHaveBeenCalledWith('[ResendEmailSender] Service disabled - skipping email to user@example.com');
    });

    it('should handle multiple recipients', async () => {
      mockResendInstance.emails.send.mockResolvedValue({ id: 'email-multi' });

      await sender.send('user1@example.com', 'Test 1', '<p>1</p>');
      await sender.send('user2@example.com', 'Test 2', '<p>2</p>');
      await sender.send('user3@example.com', 'Test 3', '<p>3</p>');

      expect(mockResendInstance.emails.send).toHaveBeenCalledTimes(3);
    });

    it('should handle different HTML content', async () => {
      mockResendInstance.emails.send.mockResolvedValue({ id: 'email-html' });

      const complexHtml = `
        <div style="color: red;">
          <h1>Title</h1>
          <p>Paragraph with <a href="https://example.com">link</a></p>
        </div>
      `;

      await sender.send('user@example.com', 'Complex', complexHtml);

      expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          html: complexHtml
        })
      );
    });
  });

  describe('isAvailable', () => {
    it('should return true when API key is set', () => {
      process.env.RESEND_API_KEY = 'valid-key';
      sender = new ResendEmailSender();

      expect(sender.isAvailable()).toBe(true);
    });

    it('should return false when API key is missing', () => {
      delete process.env.RESEND_API_KEY;
      sender = new ResendEmailSender();

      expect(sender.isAvailable()).toBe(false);
    });

    it('should reflect current state after initialization', () => {
      process.env.RESEND_API_KEY = 'key';
      const sender1 = new ResendEmailSender();
      expect(sender1.isAvailable()).toBe(true);

      delete process.env.RESEND_API_KEY;
      const sender2 = new ResendEmailSender();
      expect(sender2.isAvailable()).toBe(false);
    });
  });
});
