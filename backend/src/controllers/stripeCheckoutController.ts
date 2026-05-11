import { Request, Response } from 'express';
import { CheckoutSessionFactory } from '../services/subscription/checkoutSessionFactory';
import { SubscriptionService } from '../services/subscription/subscriptionService';
import { StripeRepository } from '../repositories/stripeRepository';
import { resolveFabricImageLimit } from '../config/stripe.config';

/**
 * Controller for Stripe checkout and portal operations
 * Handles subscription creation and customer portal access
 */
export class StripeCheckoutController {
  private checkoutFactory: CheckoutSessionFactory;
  private subscriptionService: SubscriptionService;
  private stripeRepository: StripeRepository;

  constructor() {
    this.checkoutFactory = new CheckoutSessionFactory();
    this.subscriptionService = new SubscriptionService();
    this.stripeRepository = new StripeRepository();
  }

  /**
   * POST /api/stripe/create-checkout-session
   * Create a Stripe checkout session for subscription purchase
   */
  async createCheckoutSession(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { tier, interval, fabricHoldTier = 'none', addonOnly = false } = req.body;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (!this.checkoutFactory.isValidFabricHoldTier(fabricHoldTier)) {
        return res.status(400).json({ success: false, message: 'Invalid fabric hold tier' });
      }

      const user = await this.stripeRepository.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (addonOnly) {
        if (user.subscriptionTier === 'free') {
          return res.status(400).json({ success: false, message: 'Add-ons are available for paid plans only' });
        }

        // Free add-on tiers can be applied immediately without billing checkout.
        if (fabricHoldTier === 'none' || fabricHoldTier === '3') {
          await this.stripeRepository.updateFabricAddonEntitlement(
            userId,
            fabricHoldTier,
            resolveFabricImageLimit(fabricHoldTier)
          );
          return res.json({ success: true, message: 'Fabric Hold add-on updated' });
        }

        const normalizedInterval: 'monthly' | 'yearly' = this.checkoutFactory.isValidInterval(interval)
          ? interval
          : this.checkoutFactory.isValidInterval(user.billingInterval || '')
            ? (user.billingInterval as 'monthly' | 'yearly')
            : 'monthly';

        const session = await this.checkoutFactory.createAddonOnlySession({
          userId,
          userEmail: user.email,
          interval: normalizedInterval,
          fabricHoldTier,
          customerId: user.stripeCustomerId,
          subscriptionTier: user.subscriptionTier,
        });

        return res.json({ success: true, sessionId: session.id, url: session.url });
      }

      if (!this.checkoutFactory.isValidTier(tier)) {
        return res.status(400).json({ success: false, message: 'Invalid tier' });
      }
      
      if (!this.checkoutFactory.isValidInterval(interval)) {
        return res.status(400).json({ success: false, message: 'Invalid interval' });
      }

      const session = await this.checkoutFactory.createSession({
        userId,
        userEmail: user.email,
        tier,
        interval,
        fabricHoldTier
      });

      res.json({ success: true, sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ success: false, message: 'Failed to create checkout session' });
    }
  }

  /**
   * POST /api/stripe/create-portal-session
   * Create a Stripe customer portal session for subscription management
   */
  async createPortalSession(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await this.stripeRepository.getUserById(userId);
      if (!user || !user.stripeCustomerId) {
        return res.status(400).json({ success: false, message: 'No active subscription' });
      }

      const returnUrl = `${process.env.FRONTEND_URL}/account`;
      const session = await this.subscriptionService.createPortalSession(user.stripeCustomerId, returnUrl);

      res.json({ success: true, url: session.url });
    } catch (error) {
      console.error('Portal session error:', error);
      res.status(500).json({ success: false, message: 'Failed to create portal session' });
    }
  }

  /**
   * POST /api/stripe/cancel-subscription
   * Cancel user's subscription at end of billing period
   */
  async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await this.stripeRepository.getUserById(userId);
      if (!user || !user.stripeSubscriptionId) {
        return res.status(400).json({ success: false, message: 'No active subscription to cancel' });
      }

      // Cancel subscription at the end of the billing period
      await this.subscriptionService.cancelAtPeriodEnd(user.stripeSubscriptionId);

      // Update user record
      await this.stripeRepository.markCancelAtPeriodEnd(userId);

      res.json({ success: true, message: 'Subscription will be canceled at the end of your billing period' });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel subscription' });
    }
  }
}
