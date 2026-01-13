// src/services/stripeWebhookService.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover'
});

/**
 * Handles Stripe webhook signature validation and event construction
 * Single Responsibility: Webhook security and event parsing
 */
export class StripeWebhookService {
  private getWebhookSecret(): string {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }
    return secret;
  }

  /**
   * Verify webhook signature and construct event
   * @param rawBody - Raw request body (Buffer)
   * @param signature - Stripe signature from headers
   * @returns Verified Stripe event
   * @throws Error if signature verification fails
   */
  verifyAndConstructEvent(rawBody: Buffer | string, signature: string): Stripe.Event {
    try {
      return stripe.webhooks.constructEvent(rawBody, signature, this.getWebhookSecret());
    } catch (err) {
      const error = err as Error;
      console.error('Webhook signature verification failed:', error.message);
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  /**
   * Check if webhook secret is configured
   * @returns True if webhook secret exists
   */
  isConfigured(): boolean {
    return !!process.env.STRIPE_WEBHOOK_SECRET;
  }
}
