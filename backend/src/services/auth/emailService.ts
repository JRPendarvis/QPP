import { ResendEmailSender } from './resendEmailSender';
import { EmailTemplateBuilder } from './emailTemplateBuilder';

const emailSender = new ResendEmailSender();

export const emailService = {
  async sendWelcomeEmail(to: string, name?: string) {
    const subject = 'Welcome to Quilt Planner Pro! 🎉';
    const html = EmailTemplateBuilder.buildWelcomeEmail(name);
    await emailSender.send(to, subject, html);
  },

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const subject = 'Reset your Quilt Planner Pro password';
    const html = EmailTemplateBuilder.buildPasswordResetEmail(resetUrl);
    await emailSender.send(to, subject, html);
  },

  async sendFeedbackNotification(userEmail: string, userName: string | undefined, title: string, description: string | null) {
    const adminEmail = process.env.ADMIN_EMAIL || 'quiltplannerpro@gmail.com';
    const subject = `New Feedback: ${title}`;
    const html = EmailTemplateBuilder.buildFeedbackNotificationEmail(userEmail, userName, title, description);
    await emailSender.send(adminEmail, subject, html, userEmail);
  }
};