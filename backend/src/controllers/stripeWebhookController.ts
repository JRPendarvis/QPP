import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeWebhookService } from '../services/subscription/stripeWebhookService';
import { StripeWebhookEventHandler } from '../services/subscription/stripeWebhookEventHandler';

/**
 * Controller for Stripe webhook endpoints
 * Handles incoming Stripe events and delegates to event handlers
 */
export class StripeWebhookController {
  private webhookService: StripeWebhookService;
  private eventHandler: StripeWebhookEventHandler;

  constructor() {
    this.webhookService = new StripeWebhookService();
    this.eventHandler = new StripeWebhookEventHandler();
  }

  /**
   * POST /api/stripe/webhook
   * Receive and process Stripe webhook events
   */
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
          await this.eventHandler.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
          break;
        case 'customer.subscription.updated':
          await this.eventHandler.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.eventHandler.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
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
}
