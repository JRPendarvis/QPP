import { Router } from 'express';
import { StripeController } from '../controllers/stripeController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const stripeController = new StripeController();

// Create checkout session - user clicks "Upgrade"
router.post('/create-checkout-session', authenticate, (req, res) => 
  stripeController.createCheckoutSession(req, res)
);

// Stripe webhook - handles payment success/failure
router.post('/webhook', (req, res) => 
  stripeController.handleWebhook(req, res)
);

// Create customer portal session - user manages subscription
router.post('/create-portal-session', authenticate, (req, res) => 
  stripeController.createPortalSession(req, res)
);

// Cancel subscription - user cancels membership
router.post('/cancel-subscription', authenticate, (req, res) => 
  stripeController.cancelSubscription(req, res)
);

export default router;