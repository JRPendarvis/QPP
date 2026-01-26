import { Router } from "express";
import { StripeCheckoutController } from "../controllers/stripeCheckoutController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const stripeCheckoutController = new StripeCheckoutController();

// Create checkout session - user clicks "Upgrade"
router.post("/create-checkout-session", authenticate, (req, res) =>
  stripeCheckoutController.createCheckoutSession(req, res)
);

// NOTE: Stripe webhook is handled ONLY in serverSetup.ts using express.raw()
// Do NOT add a JSON-parsed webhook route here (signature verification will break).

// Create customer portal session - user manages subscription
router.post("/create-portal-session", authenticate, (req, res) =>
  stripeCheckoutController.createPortalSession(req, res)
);

// Cancel subscription - user cancels membership
router.post("/cancel-subscription", authenticate, (req, res) =>
  stripeCheckoutController.cancelSubscription(req, res)
);

export default router;
