import Stripe from 'stripe';
import { SubscriptionService } from './subscriptionService';
import { StripeRepository } from '../../repositories/stripeRepository';
import { SubscriptionDataProcessor } from './subscriptionDataProcessor';

/**
 * Service for handling Stripe webhook events
 * Processes subscription lifecycle events from Stripe
 */
export class StripeWebhookEventHandler {
  private subscriptionService: SubscriptionService;
  private stripeRepository: StripeRepository;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.stripeRepository = new StripeRepository();
  }

  /**
   * Handle checkout.session.completed event
   * Updates user subscription data after successful checkout
   */
  async handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
    if (session.metadata?.addonOnly === 'true') {
      const userId = session.client_reference_id;
      if (!userId) return;

      const { fabricHoldTier, fabricImageLimit } = SubscriptionDataProcessor.extractMetadata(session.metadata);
      await this.stripeRepository.updateFabricAddonEntitlement(userId, fabricHoldTier, fabricImageLimit);
      return;
    }

    const result = await this.subscriptionService.processCheckoutComplete(session);
    if (!result) return;

    const { userId, data } = result;
    await this.stripeRepository.updateSubscription(userId, data);
  }

  /**
   * Handle customer.subscription.updated event
   * Updates user subscription status when Stripe subscription changes
   */
  async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    const user = await this.stripeRepository.getUserBySubscriptionId(subscription.id);
    if (!user) return;

    const data = this.subscriptionService.processSubscriptionUpdate(subscription);
    await this.stripeRepository.updateSubscriptionStatus(user.id, data);
  }

  /**
   * Handle customer.subscription.deleted event
   * Processes subscription cancellation
   */
  async handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
    const user = await this.stripeRepository.getUserBySubscriptionId(subscription.id);
    if (!user) return;

    const data = this.subscriptionService.processSubscriptionCancellation();
    await this.stripeRepository.cancelSubscription(user.id, data);
  }
}
