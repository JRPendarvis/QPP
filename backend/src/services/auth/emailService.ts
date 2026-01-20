import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = 'Quilt Planner Pro <noreply@quiltplannerpro.com>';
const DEBUG = process.env.DEBUG_EMAIL === 'true';

if (!resend && DEBUG) {
  console.warn('⚠️  RESEND_API_KEY not found - email functionality disabled');
}

export const emailService = {
  async sendWelcomeEmail(to: string, name?: string) {
    if (!resend) {
      if (DEBUG) console.log('Email service disabled - skipping welcome email');
      return;
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: 'Welcome to Quilt Planner Pro! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Welcome to Quilt Planner Pro!</h1>
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for joining Quilt Planner Pro! We're excited to help you create beautiful quilt patterns.</p>
            <p>Here's what you can do now:</p>
            <ul>
              <li>Upload your fabric images</li>
              <li>Generate AI-powered quilt patterns</li>
              <li>Download PDF instructions</li>
            </ul>
            <p>
              <a href="https://www.quiltplannerpro.com/dashboard" 
                 style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Start Creating
              </a>
            </p>
            <p>Happy quilting!<br>The Quilt Planner Pro Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Questions? Reply to this email or contact us at quiltplannerpro@gmail.com
            </p>
          </div>
        `
      });
      if (DEBUG) console.log(`Welcome email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  },

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    if (!resend) {
      if (DEBUG) console.log('Email service disabled - skipping password reset email');
      return;
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: 'Reset your Quilt Planner Pro password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Reset Your Password</h1>
            <p>You requested a password reset for your Quilt Planner Pro account.</p>
            <p>Click the button below to set a new password. This link expires in 1 hour.</p>
            <p>
              <a href="${resetUrl}" 
                 style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>- The Quilt Planner Pro Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              If the button doesn't work, copy and paste this link: ${resetUrl}
            </p>
          </div>
        `
      });
      if (DEBUG) console.log(`Password reset email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  },

  async sendFeedbackNotification(userEmail: string, userName: string | undefined, title: string, description: string | null) {
    if (!resend) {
      if (DEBUG) console.log('Email service disabled - skipping feedback notification');
      return;
    }
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'quiltplannerpro@gmail.com';
      
      await resend.emails.send({
        from: FROM_EMAIL,
        to: adminEmail,
        replyTo: userEmail,
        subject: `New Feedback: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">New Feedback Received</h1>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${userName || 'Anonymous'} (${userEmail})</p>
              <p style="margin: 0;"><strong>Title:</strong> ${title}</p>
            </div>
            ${description ? `
              <div style="background: #fff; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Description:</strong></p>
                <p style="margin: 0; white-space: pre-wrap;">${description}</p>
              </div>
            ` : ''}
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              View all feedback at: <a href="https://www.quiltplannerpro.com/dashboard/feedback">Dashboard</a>
            </p>
          </div>
        `
      });
      if (DEBUG) console.log(`Feedback notification sent to ${adminEmail}`);
    } catch (error) {
      console.error('Failed to send feedback notification:', error);
    }
  }
};