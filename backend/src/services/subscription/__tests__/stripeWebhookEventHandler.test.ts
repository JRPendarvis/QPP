import { StripeWebhookEventHandler } from '../stripeWebhookEventHandler';
import { SubscriptionService } from '../subscriptionService';
import { StripeRepository } from '../../../repositories/stripeRepository';
import Stripe from 'stripe';

// Mock Stripe before other modules
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({}));
});

// Mock dependencies
jest.mock('../subscriptionService');
jest.mock('../../../repositories/stripeRepository');

describe('StripeWebhookEventHandler', () => {
  let handler: StripeWebhookEventHandler;
  let mockSubscriptionService: jest.Mocked<SubscriptionService>;
  let mockStripeRepository: jest.Mocked<StripeRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new StripeWebhookEventHandler();
    mockSubscriptionService = (handler as any).subscriptionService;
    mockStripeRepository = (handler as any).stripeRepository;
  });

  describe('handleCheckoutComplete', () => {
    it('should process checkout and update subscription when result is valid', async () => {
      const mockSession = {
        id: 'cs_test_123',
        customer: 'cus_123',
        subscription: 'sub_123',
      } as unknown as Stripe.Checkout.Session;

      const mockResult = {
        userId: 'user123',
        data: {
          stripeCustomerId: 'cus_123',
          stripeSubscriptionId: 'sub_123',
          subscriptionTier: 'basic',
          subscriptionStatus: 'active',
          billingInterval: 'monthly',
          currentPeriodEnd: new Date('2025-02-01'),
        },
      };

      mockSubscriptionService.processCheckoutComplete.mockResolvedValue(mockResult as any);
      mockStripeRepository.updateSubscription.mockResolvedValue(undefined);

      await handler.handleCheckoutComplete(mockSession);

      expect(mockSubscriptionService.processCheckoutComplete).toHaveBeenCalledWith(mockSession);
      expect(mockStripeRepository.updateSubscription).toHaveBeenCalledWith('user123', mockResult.data);
    });

    it('should not update subscription when processCheckoutComplete returns null', async () => {
      const mockSession = {
        id: 'cs_test_123',
      } as unknown as Stripe.Checkout.Session;

      mockSubscriptionService.processCheckoutComplete.mockResolvedValue(null);

      await handler.handleCheckoutComplete(mockSession);

      expect(mockSubscriptionService.processCheckoutComplete).toHaveBeenCalledWith(mockSession);
      expect(mockStripeRepository.updateSubscription).not.toHaveBeenCalled();
    });

    it('should not update subscription when processCheckoutComplete returns undefined', async () => {
      const mockSession = {
        id: 'cs_test_123',
      } as unknown as Stripe.Checkout.Session;

      mockSubscriptionService.processCheckoutComplete.mockResolvedValue(undefined as any);

      await handler.handleCheckoutComplete(mockSession);

      expect(mockSubscriptionService.processCheckoutComplete).toHaveBeenCalledWith(mockSession);
      expect(mockStripeRepository.updateSubscription).not.toHaveBeenCalled();
    });

    it('should handle multiple checkout sessions sequentially', async () => {
      const mockSession1 = { id: 'cs_1' } as unknown as Stripe.Checkout.Session;
      const mockSession2 = { id: 'cs_2' } as unknown as Stripe.Checkout.Session;

      const mockResult1 = { 
        userId: 'user1', 
        data: { 
          subscriptionTier: 'basic',
          subscriptionStatus: 'active',
          billingInterval: 'monthly',
          stripeCustomerId: 'cus_1',
          stripeSubscriptionId: 'sub_1',
          currentPeriodEnd: new Date(),
        } 
      };
      const mockResult2 = { 
        userId: 'user2', 
        data: { 
          subscriptionTier: 'intermediate',
          subscriptionStatus: 'active',
          billingInterval: 'yearly',
          stripeCustomerId: 'cus_2',
          stripeSubscriptionId: 'sub_2',
          currentPeriodEnd: new Date(),
        } 
      };

      mockSubscriptionService.processCheckoutComplete
        .mockResolvedValueOnce(mockResult1 as any)
        .mockResolvedValueOnce(mockResult2 as any);

      await handler.handleCheckoutComplete(mockSession1);
      await handler.handleCheckoutComplete(mockSession2);

      expect(mockStripeRepository.updateSubscription).toHaveBeenCalledTimes(2);
      expect(mockStripeRepository.updateSubscription).toHaveBeenCalledWith('user1', mockResult1.data);
      expect(mockStripeRepository.updateSubscription).toHaveBeenCalledWith('user2', mockResult2.data);
    });
  });

  describe('handleSubscriptionUpdate', () => {
    it('should process subscription update when user is found', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'active',
        current_period_end: 1735689600,
      } as unknown as Stripe.Subscription;

      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
        stripeSubscriptionId: 'sub_123',
      };

      const mockData = {
        subscriptionStatus: 'active',
        currentPeriodEnd: new Date(1735689600 * 1000),
      };

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(mockUser as any);
      mockSubscriptionService.processSubscriptionUpdate.mockReturnValue(mockData as any);
      mockStripeRepository.updateSubscriptionStatus.mockResolvedValue(undefined);

      await handler.handleSubscriptionUpdate(mockSubscription);

      expect(mockStripeRepository.getUserBySubscriptionId).toHaveBeenCalledWith('sub_123');
      expect(mockSubscriptionService.processSubscriptionUpdate).toHaveBeenCalledWith(mockSubscription);
      expect(mockStripeRepository.updateSubscriptionStatus).toHaveBeenCalledWith('user123', mockData);
    });

    it('should not process update when user is not found', async () => {
      const mockSubscription = {
        id: 'sub_nonexistent',
        status: 'active',
      } as unknown as Stripe.Subscription;

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(null);

      await handler.handleSubscriptionUpdate(mockSubscription);

      expect(mockStripeRepository.getUserBySubscriptionId).toHaveBeenCalledWith('sub_nonexistent');
      expect(mockSubscriptionService.processSubscriptionUpdate).not.toHaveBeenCalled();
      expect(mockStripeRepository.updateSubscriptionStatus).not.toHaveBeenCalled();
    });

    it('should handle subscription status changes', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'past_due',
      } as unknown as Stripe.Subscription;

      const mockUser = { id: 'user123' };
      const mockData = { subscriptionStatus: 'past_due', currentPeriodEnd: new Date() };

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(mockUser as any);
      mockSubscriptionService.processSubscriptionUpdate.mockReturnValue(mockData as any);

      await handler.handleSubscriptionUpdate(mockSubscription);

      expect(mockStripeRepository.updateSubscriptionStatus).toHaveBeenCalledWith('user123', mockData);
    });

    it('should handle undefined user gracefully', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_123',
      };

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(undefined as any);

      await handler.handleSubscriptionUpdate(mockSubscription as Stripe.Subscription);

      expect(mockSubscriptionService.processSubscriptionUpdate).not.toHaveBeenCalled();
      expect(mockStripeRepository.updateSubscriptionStatus).not.toHaveBeenCalled();
    });
  });

  describe('handleSubscriptionCanceled', () => {
    it('should process cancellation when user is found', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'canceled',
      } as unknown as Stripe.Subscription;

      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
        stripeSubscriptionId: 'sub_123',
      };

      const mockData = {
        subscriptionStatus: 'canceled',
        subscriptionTier: 'free',
        stripeSubscriptionId: null,
        billingInterval: null,
      };

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(mockUser as any);
      mockSubscriptionService.processSubscriptionCancellation.mockReturnValue(mockData as any);
      mockStripeRepository.cancelSubscription.mockResolvedValue(undefined);

      await handler.handleSubscriptionCanceled(mockSubscription as Stripe.Subscription);

      expect(mockStripeRepository.getUserBySubscriptionId).toHaveBeenCalledWith('sub_123');
      expect(mockSubscriptionService.processSubscriptionCancellation).toHaveBeenCalled();
      expect(mockStripeRepository.cancelSubscription).toHaveBeenCalledWith('user123', mockData);
    });

    it('should not process cancellation when user is not found', async () => {
      const mockSubscription = {
        id: 'sub_nonexistent',
        status: 'canceled',
      } as unknown as Stripe.Subscription;

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(null);

      await handler.handleSubscriptionCanceled(mockSubscription as Stripe.Subscription);

      expect(mockStripeRepository.getUserBySubscriptionId).toHaveBeenCalledWith('sub_nonexistent');
      expect(mockSubscriptionService.processSubscriptionCancellation).not.toHaveBeenCalled();
      expect(mockStripeRepository.cancelSubscription).not.toHaveBeenCalled();
    });

    it('should handle cancellation for different subscription IDs', async () => {
      const subscriptionIds = ['sub_1', 'sub_2', 'sub_3'];
      const mockData = { 
        subscriptionStatus: 'canceled', 
        subscriptionTier: 'free',
        stripeSubscriptionId: null,
        billingInterval: null,
      };

      mockSubscriptionService.processSubscriptionCancellation.mockReturnValue(mockData as any);

      for (const subId of subscriptionIds) {
        const mockSubscription = { id: subId } as unknown as Stripe.Subscription;
        const mockUser = { id: `user_${subId}` };

        mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(mockUser as any);

        await handler.handleSubscriptionCanceled(mockSubscription as Stripe.Subscription);

        expect(mockStripeRepository.cancelSubscription).toHaveBeenCalledWith(`user_${subId}`, mockData);
      }

      expect(mockStripeRepository.cancelSubscription).toHaveBeenCalledTimes(3);
    });

    it('should handle undefined user gracefully', async () => {
      const mockSubscription = {
        id: 'sub_123',
      } as unknown as Stripe.Subscription;

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(undefined as any);

      await handler.handleSubscriptionCanceled(mockSubscription);

      expect(mockSubscriptionService.processSubscriptionCancellation).not.toHaveBeenCalled();
      expect(mockStripeRepository.cancelSubscription).not.toHaveBeenCalled();
    });

    it('should call processSubscriptionCancellation without arguments', async () => {
      const mockSubscription = {
        id: 'sub_123',
      } as unknown as Stripe.Subscription;

      const mockUser = { id: 'user123' };
      const mockData = { 
        subscriptionStatus: 'canceled',
        subscriptionTier: 'free',
        stripeSubscriptionId: null,
        billingInterval: null,
      };

      mockStripeRepository.getUserBySubscriptionId.mockResolvedValue(mockUser as any);
      mockSubscriptionService.processSubscriptionCancellation.mockReturnValue(mockData as any);

      await handler.handleSubscriptionCanceled(mockSubscription);

      expect(mockSubscriptionService.processSubscriptionCancellation).toHaveBeenCalledWith();
      expect(mockSubscriptionService.processSubscriptionCancellation).toHaveBeenCalledTimes(1);
    });
  });
});
