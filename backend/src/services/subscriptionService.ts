// src/services/subscriptionService.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover'
});

export interface SubscriptionUpdateData {
  subscriptionTier: string;
  subscriptionStatus: string;
  billingInterval: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodEnd: Date;
}

export interface SubscriptionStatusUpdate {
  subscriptionStatus: string;
  currentPeriodEnd: Date;
}

export interface SubscriptionCancellationData {
  subscriptionTier: string;
  subscriptionStatus: string;
  stripeSubscriptionId: null;
  billingInterval: null;
}

/**
 * Handles Stripe subscription business logic
 * Single Responsibility: Subscription lifecycle operations
 */
export class SubscriptionService {
  /**
   * Process completed checkout session and extract subscription data
   * @param session - Stripe checkout session
   * @returns Subscription data for database update
   */
  async processCheckoutComplete(session: Stripe.Checkout.Session): Promise<{
    userId: string;
    data: SubscriptionUpdateData;
  } | null> {
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;
    
    if (!userId) {
      console.warn('Checkout session missing client_reference_id');
      return null;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const tier = session.metadata?.tier || 'basic';
    const interval = session.metadata?.interval || 'monthly';
    
    // Safely get current_period_end
    const subData = subscription as unknown as { current_period_end?: number };
    const periodEnd = subData.current_period_end 
      ? new Date(subData.current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    console.log(`Subscription activated: user=${userId} tier=${tier} interval=${interval}`);

    return {
      userId,
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionTier: tier,
        subscriptionStatus: subscription.status,
        billingInterval: interval,
        currentPeriodEnd: periodEnd
      }
    };
  }

  /**
   * Process subscription update event
   * @param subscription - Stripe subscription object
   * @returns Subscription status update data
   */
  processSubscriptionUpdate(subscription: Stripe.Subscription): SubscriptionStatusUpdate {
    const subData = subscription as unknown as { current_period_end?: number };
    const periodEnd = subData.current_period_end
      ? new Date(subData.current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    console.log(`Subscription updated: id=${subscription.id} status=${subscription.status}`);

    return {
      subscriptionStatus: subscription.status,
      currentPeriodEnd: periodEnd
    };
  }

  /**
   * Process subscription cancellation event
   * @returns Data to reset user to free tier
   */
  processSubscriptionCancellation(): SubscriptionCancellationData {
    console.log('Processing subscription cancellation');
    
    return {
      subscriptionTier: 'free',
      subscriptionStatus: 'canceled',
      stripeSubscriptionId: null,
      billingInterval: null
    };
  }

  /**
   * Cancel subscription at period end via Stripe API
   * @param stripeSubscriptionId - Stripe subscription ID
   * @returns Updated subscription object
   */
  async cancelAtPeriodEnd(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    console.log(`Subscription scheduled for cancellation: ${stripeSubscriptionId}`);
    return subscription;
  }

  /**
   * Create billing portal session
   * @param customerId - Stripe customer ID
   * @param returnUrl - URL to return to after portal session
   * @returns Portal session with URL
   */
  async createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });

    console.log(`Portal session created for customer: ${customerId}`);
    return session;
  }
}
