// src/services/checkoutSessionFactory.ts

import Stripe from 'stripe';
import { FABRIC_HOLD_ADDON_PRICING, FabricHoldTier, STRIPE_PRICE_IDS } from '../../config/stripe.config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover'
});

export interface CheckoutSessionRequest {
  userId: string;
  userEmail: string;
  tier: 'basic' | 'intermediate' | 'advanced';
  interval: 'monthly' | 'yearly';
  fabricHoldTier?: FabricHoldTier;
}

export interface AddonCheckoutSessionRequest {
  userId: string;
  userEmail: string;
  interval: 'monthly' | 'yearly';
  fabricHoldTier: FabricHoldTier;
  customerId?: string | null;
  subscriptionTier?: string;
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

  isValidFabricHoldTier(tier: string): tier is FabricHoldTier {
    return ['none', '3', '10', '25', '50'].includes(tier);
  }

  private createFabricHoldLineItem(tier: FabricHoldTier, interval: 'monthly' | 'yearly'): Stripe.Checkout.SessionCreateParams.LineItem | null {
    const amount = FABRIC_HOLD_ADDON_PRICING[tier][interval];
    if (amount <= 0) {
      return null;
    }

    return {
      quantity: 1,
      price_data: {
        currency: 'usd',
        recurring: { interval: interval === 'yearly' ? 'year' : 'month' },
        unit_amount: Math.round(amount * 100),
        product_data: {
          name: `Fabric Hold Add-on (${tier} images)`
        }
      }
    };
  }

  /**
   * Create Stripe checkout session
   * @param request - Checkout session request data
   * @returns Stripe checkout session
   */
  async createSession(request: CheckoutSessionRequest): Promise<Stripe.Checkout.Session> {
    const { userId, userEmail, tier, interval, fabricHoldTier = '3' } = request;

    const priceId = STRIPE_PRICE_IDS[tier][interval];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [{ price: priceId, quantity: 1 }];
    const fabricHoldLineItem = this.createFabricHoldLineItem(fabricHoldTier, interval);
    if (fabricHoldLineItem) {
      lineItems.push(fabricHoldLineItem);
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      allow_promotion_codes: true,
      success_url: `${this.frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/pricing`,
      metadata: { userId, tier, interval, fabricHoldTier }
    });

    console.log(`Checkout session created: ${session.id} for user ${userId}`);
    return session;
  }

  async createAddonOnlySession(request: AddonCheckoutSessionRequest): Promise<Stripe.Checkout.Session> {
    const { userId, userEmail, interval, fabricHoldTier, customerId, subscriptionTier } = request;

    const fabricHoldLineItem = this.createFabricHoldLineItem(fabricHoldTier, interval);
    if (!fabricHoldLineItem) {
      throw new Error('Selected add-on tier does not require billing');
    }

    const session = await stripe.checkout.sessions.create({
      ...(customerId ? { customer: customerId } : { customer_email: userEmail }),
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [fabricHoldLineItem],
      allow_promotion_codes: true,
      success_url: `${this.frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/pricing`,
      metadata: {
        userId,
        tier: subscriptionTier || 'basic',
        interval,
        fabricHoldTier,
        addonOnly: 'true',
      },
    });

    console.log(`Addon checkout session created: ${session.id} for user ${userId}`);
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
