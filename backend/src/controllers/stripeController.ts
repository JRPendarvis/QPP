import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { STRIPE_PRICE_IDS } from '../config/stripe.config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover'
});

const prisma = new PrismaClient();

export class StripeController {
  
  async createCheckoutSession(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { tier, interval } = req.body;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (!['basic', 'intermediate', 'advanced'].includes(tier)) {
        return res.status(400).json({ success: false, message: 'Invalid tier' });
      }
      
      if (!['monthly', 'yearly'].includes(interval)) {
        return res.status(400).json({ success: false, message: 'Invalid interval' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const priceId = STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS][interval as 'monthly' | 'yearly'];

      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: userId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
        metadata: { userId, tier, interval }
      });

      res.json({ success: true, sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ success: false, message: 'Failed to create checkout session' });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(400).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
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
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;
    if (!userId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const tier = session.metadata?.tier || 'basic';
    const interval = session.metadata?.interval || 'monthly';

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionTier: tier,
        subscriptionStatus: subscription.status,
        billingInterval: interval,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000)
     }
    });

    console.log(`Subscription activated for user ${userId}: ${tier} ${interval}`);
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const user = await prisma.user.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000)
      }
    });

    console.log(`Subscription updated for user ${user.id}: ${subscription.status}`);
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const user = await prisma.user.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: 'free',
        subscriptionStatus: 'canceled',
        stripeSubscriptionId: null,
        billingInterval: null
      }
    });

    console.log(`Subscription canceled for user ${user.id}`);
  }

  async createPortalSession(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.stripeCustomerId) {
        return res.status(400).json({ success: false, message: 'No active subscription' });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.FRONTEND_URL}/account`
      });

      res.json({ success: true, url: session.url });
    } catch (error) {
      console.error('Portal session error:', error);
      res.status(500).json({ success: false, message: 'Failed to create portal session' });
    }
  }
}