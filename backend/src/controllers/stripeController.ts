import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeWebhookService } from '../services/stripeWebhookService';
import { SubscriptionService } from '../services/subscriptionService';
import { CheckoutSessionFactory } from '../services/checkoutSessionFactory';
import { StripeRepository } from '../repositories/stripeRepository';

/**
 * HTTP controller for Stripe payment operations
 * Single Responsibility: HTTP request/response handling only
 * Delegates business logic to services following Dependency Inversion
 */
export class StripeController {
  private webhookService: StripeWebhookService;
  private subscriptionService: SubscriptionService;
  private checkoutFactory: CheckoutSessionFactory;
  private stripeRepository: StripeRepository;

  constructor() {
    this.webhookService = new StripeWebhookService();
    this.subscriptionService = new SubscriptionService();
    this.checkoutFactory = new CheckoutSessionFactory();
    this.stripeRepository = new StripeRepository();
  }
  
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

  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    if (!this.webhookService.isConfigured()) {
      return res.status(400).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.webhookService.verifyAndConstructEvent(req.body, sig);
    } catch (err) {
      const error = err as Error;
      return res.status(400).send(error.message);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Webhook handler failed');
    }
  }

private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const result = await this.subscriptionService.processCheckoutComplete(session);
  if (!result) return;

  const { userId, data } = result;
  await this.stripeRepository.updateSubscription(userId, data);
}

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const user = await this.stripeRepository.getUserBySubscriptionId(subscription.id);
    if (!user) return;

    const data = this.subscriptionService.processSubscriptionUpdate(subscription);
    await this.stripeRepository.updateSubscriptionStatus(user.id, data);
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const user = await this.stripeRepository.getUserBySubscriptionId(subscription.id);
    if (!user) return;

    const data = this.subscriptionService.processSubscriptionCancellation();
    await this.stripeRepository.cancelSubscription(user.id, data);
  }

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