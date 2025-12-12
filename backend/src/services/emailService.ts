import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'QuiltPlannerPro <noreply@quiltplannerpro.com>';

export const emailService = {
  async sendWelcomeEmail(to: string, name?: string) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: 'Welcome to QuiltPlannerPro! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Welcome to QuiltPlannerPro!</h1>
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for joining QuiltPlannerPro! We're excited to help you create beautiful quilt patterns.</p>
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
            <p>Happy quilting!<br>The QuiltPlannerPro Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Questions? Reply to this email or contact us at quiltplannerpro@gmail.com
            </p>
          </div>
        `
      });
      console.log(`Welcome email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  },

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: 'Reset your QuiltPlannerPro password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Reset Your Password</h1>
            <p>You requested a password reset for your QuiltPlannerPro account.</p>
            <p>Click the button below to set a new password. This link expires in 1 hour.</p>
            <p>
              <a href="${resetUrl}" 
                 style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>- The QuiltPlannerPro Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              If the button doesn't work, copy and paste this link: ${resetUrl}
            </p>
          </div>
        `
      });
      console.log(`Password reset email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }
};