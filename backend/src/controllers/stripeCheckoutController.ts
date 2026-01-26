import { Request, Response } from 'express';
import { CheckoutSessionFactory } from '../services/subscription/checkoutSessionFactory';
import { SubscriptionService } from '../services/subscription/subscriptionService';
import { StripeRepository } from '../repositories/stripeRepository';

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
      const { tier, interval } = req.body;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (!this.checkoutFactory.isValidTier(tier)) {
        return res.status(400).json({ success: false, message: 'Invalid tier' });
      }
      
      if (!this.checkoutFactory.isValidInterval(interval)) {
        return res.status(400).json({ success: false, message: 'Invalid interval' });
      }

      const user = await this.stripeRepository.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const session = await this.checkoutFactory.createSession({
        userId,
        userEmail: user.email,
        tier,
        interval
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
