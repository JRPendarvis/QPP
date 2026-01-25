import Stripe from 'stripe';

/**
 * Service for executing Stripe API operations
 */
export class StripeApiExecutor {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-11-17.clover'
    });
  }

  /**
   * Retrieve subscription details from Stripe
   * 
   * @param subscriptionId - Stripe subscription ID
   * @returns Subscription object from Stripe
   */
  async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Cancel subscription at period end via Stripe API
   * 
   * @param stripeSubscriptionId - Stripe subscription ID
   * @returns Updated subscription object
   */
  async cancelAtPeriodEnd(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    console.log(`[StripeApiExecutor] Canceling subscription ${stripeSubscriptionId} at period end`);
    return subscription;
  }

  /**
   * Create billing portal session
   * 
   * @param customerId - Stripe customer ID
   * @param returnUrl - URL to return to after portal session
   * @returns Portal session with URL
   */
  async createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });

    console.log(`[StripeApiExecutor] Creating billing portal session for customer ${customerId}`);
    return session;
  }
}
