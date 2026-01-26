import { Resend } from 'resend';

/**
 * Service for sending emails via Resend API
 */
export class ResendEmailSender {
  private resend: Resend | null;
  private fromEmail: string;
  private debug: boolean;

  constructor() {
    this.resend = process.env.RESEND_API_KEY 
      ? new Resend(process.env.RESEND_API_KEY)
      : null;
    this.fromEmail = 'Quilt Planner Pro <noreply@quiltplannerpro.com>';
    this.debug = process.env.DEBUG_EMAIL === 'true';

    if (!this.resend && this.debug) {
      console.warn('⚠️  RESEND_API_KEY not found - email functionality disabled');
    }
  }

  /**
   * Send email via Resend API
   * 
   * @param to - Recipient email address
   * @param subject - Email subject line
   * @param html - HTML email body
   * @param replyTo - Optional reply-to address
   */
  async send(to: string, subject: string, html: string, replyTo?: string): Promise<void> {
    if (!this.resend) {
      if (this.debug) console.log(`[ResendEmailSender] Service disabled - skipping email to ${to}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
        ...(replyTo && { replyTo })
      });

      if (this.debug) {
        console.log(`[ResendEmailSender] Email sent to ${to}: "${subject}"`);
      }
    } catch (error) {
      console.error(`[ResendEmailSender] Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  /**
   * Check if email service is available
   */
  isAvailable(): boolean {
    return this.resend !== null;
  }
}
