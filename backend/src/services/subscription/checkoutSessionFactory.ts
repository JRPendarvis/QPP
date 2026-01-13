// src/services/checkoutSessionFactory.ts

import Stripe from 'stripe';
import { STRIPE_PRICE_IDS } from '../../config/stripe.config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover'
});

export interface CheckoutSessionRequest {
  userId: string;
  userEmail: string;
  tier: 'basic' | 'intermediate' | 'advanced';
  interval: 'monthly' | 'yearly';
}

/**
 * Factory for creating Stripe checkout sessions
 * Single Responsibility: Checkout session creation logic
 */
export class CheckoutSessionFactory {
  private frontendUrl: string;

  constructor() {
    const url = process.env.FRONTEND_URL;
    if (!url) {
      throw new Error('FRONTEND_URL environment variable is required');
    }
    this.frontendUrl = url;
  }

  /**
   * Validate tier selection
   * @param tier - Subscription tier
   * @returns True if valid tier
   */
  isValidTier(tier: string): tier is 'basic' | 'intermediate' | 'advanced' {
    return ['basic', 'intermediate', 'advanced'].includes(tier);
  }

  /**
   * Validate billing interval
   * @param interval - Billing interval
   * @returns True if valid interval
   */
  isValidInterval(interval: string): interval is 'monthly' | 'yearly' {
    return ['monthly', 'yearly'].includes(interval);
  }

  /**
   * Create Stripe checkout session
   * @param request - Checkout session request data
   * @returns Stripe checkout session
   */
  async createSession(request: CheckoutSessionRequest): Promise<Stripe.Checkout.Session> {
    const { userId, userEmail, tier, interval } = request;

    const priceId = STRIPE_PRICE_IDS[tier][interval];

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${this.frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/pricing`,
      metadata: { userId, tier, interval }
    });

    console.log(`Checkout session created: ${session.id} for user ${userId}`);
    return session;
  }

  /**
   * Get price ID for tier and interval
   * @param tier - Subscription tier
   * @param interval - Billing interval
   * @returns Stripe price ID
   */
  getPriceId(tier: 'basic' | 'intermediate' | 'advanced', interval: 'monthly' | 'yearly'): string {
    return STRIPE_PRICE_IDS[tier][interval];
  }
}
