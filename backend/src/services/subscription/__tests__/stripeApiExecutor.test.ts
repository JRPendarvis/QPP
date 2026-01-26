import { StripeApiExecutor } from '../stripeApiExecutor';
import Stripe from 'stripe';

// Mock Stripe SDK
jest.mock('stripe');

const MockedStripe = Stripe as jest.MockedClass<typeof Stripe>;

// Mock console.log to avoid noise
global.console.log = jest.fn();

describe('StripeApiExecutor', () => {
  let executor: StripeApiExecutor;
  let mockStripeInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock Stripe instance with methods
    mockStripeInstance = {
      subscriptions: {
        retrieve: jest.fn(),
        update: jest.fn(),
      },
      billingPortal: {
        sessions: {
          create: jest.fn(),
        },
      },
    };
    
    // Make Stripe constructor return our mock instance
    MockedStripe.mockImplementation(() => mockStripeInstance);
    
    executor = new StripeApiExecutor();
  });

  describe('retrieveSubscription', () => {
    it('should retrieve subscription from Stripe', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'active',
      } as unknown as Stripe.Subscription;
      
      mockStripeInstance.subscriptions.retrieve.mockResolvedValueOnce(mockSubscription);

      const result = await executor.retrieveSubscription('sub_123');

      expect(result).toEqual(mockSubscription);
      expect(mockStripeInstance.subscriptions.retrieve).toHaveBeenCalledWith('sub_123');
    });

    it('should handle different subscription IDs', async () => {
      const mockSub1 = { id: 'sub_abc' } as unknown as Stripe.Subscription;
      const mockSub2 = { id: 'sub_xyz' } as unknown as Stripe.Subscription;
      
      mockStripeInstance.subscriptions.retrieve
        .mockResolvedValueOnce(mockSub1)
        .mockResolvedValueOnce(mockSub2);

      const result1 = await executor.retrieveSubscription('sub_abc');
      const result2 = await executor.retrieveSubscription('sub_xyz');

      expect(result1.id).toBe('sub_abc');
      expect(result2.id).toBe('sub_xyz');
    });

    it('should propagate Stripe API errors', async () => {
      mockStripeInstance.subscriptions.retrieve.mockRejectedValueOnce(new Error('Stripe API error'));

      await expect(executor.retrieveSubscription('sub_123')).rejects.toThrow('Stripe API error');
    });
  });

  describe('cancelAtPeriodEnd', () => {
    it('should update subscription to cancel at period end', async () => {
      const mockUpdated = {
        id: 'sub_123',
        cancel_at_period_end: true,
      } as unknown as Stripe.Subscription;
      
      mockStripeInstance.subscriptions.update.mockResolvedValueOnce(mockUpdated);

      const result = await executor.cancelAtPeriodEnd('sub_123');

      expect(result).toEqual(mockUpdated);
      expect(mockStripeInstance.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: true,
      });
    });

    it('should log cancellation scheduling', async () => {
      const mockUpdated = { id: 'sub_123' } as unknown as Stripe.Subscription;
      mockStripeInstance.subscriptions.update.mockResolvedValueOnce(mockUpdated);

      await executor.cancelAtPeriodEnd('sub_123');

      expect(console.log).toHaveBeenCalledWith('[StripeApiExecutor] Canceling subscription sub_123 at period end');
    });

    it('should handle cancellation API errors', async () => {
      mockStripeInstance.subscriptions.update.mockRejectedValueOnce(new Error('Update failed'));

      await expect(executor.cancelAtPeriodEnd('sub_123')).rejects.toThrow('Update failed');
    });

    it('should handle different subscription IDs', async () => {
      mockStripeInstance.subscriptions.update.mockResolvedValue({} as Stripe.Subscription);

      await executor.cancelAtPeriodEnd('sub_first');
      await executor.cancelAtPeriodEnd('sub_second');

      expect(mockStripeInstance.subscriptions.update).toHaveBeenNthCalledWith(1, 'sub_first', { cancel_at_period_end: true });
      expect(mockStripeInstance.subscriptions.update).toHaveBeenNthCalledWith(2, 'sub_second', { cancel_at_period_end: true });
    });
  });

  describe('createPortalSession', () => {
    it('should create billing portal session', async () => {
      const mockSession = {
        id: 'bps_123',
        url: 'https://billing.stripe.com/session/123',
      } as unknown as Stripe.BillingPortal.Session;
      
      mockStripeInstance.billingPortal.sessions.create.mockResolvedValueOnce(mockSession);

      const result = await executor.createPortalSession('cus_123', 'https://example.com');

      expect(result).toEqual(mockSession);
      expect(mockStripeInstance.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: 'cus_123',
        return_url: 'https://example.com',
      });
    });

    it('should log portal session creation', async () => {
      const mockSession = { id: 'bps_123' } as unknown as Stripe.BillingPortal.Session;
      mockStripeInstance.billingPortal.sessions.create.mockResolvedValueOnce(mockSession);

      await executor.createPortalSession('cus_123', 'https://example.com/return');

      expect(console.log).toHaveBeenCalledWith('[StripeApiExecutor] Creating billing portal session for customer cus_123');
    });

    it('should handle portal creation errors', async () => {
      mockStripeInstance.billingPortal.sessions.create.mockRejectedValueOnce(new Error('Portal creation failed'));

      await expect(
        executor.createPortalSession('cus_123', 'https://example.com/return')
      ).rejects.toThrow('Portal creation failed');
    });

    it('should handle different customer IDs and return URLs', async () => {
      mockStripeInstance.billingPortal.sessions.create.mockResolvedValue({} as Stripe.BillingPortal.Session);

      await executor.createPortalSession('cus_abc', 'https://app.com/back');
      await executor.createPortalSession('cus_xyz', 'https://site.com/done');

      expect(mockStripeInstance.billingPortal.sessions.create).toHaveBeenNthCalledWith(1, {
        customer: 'cus_abc',
        return_url: 'https://app.com/back',
      });
      expect(mockStripeInstance.billingPortal.sessions.create).toHaveBeenNthCalledWith(2, {
        customer: 'cus_xyz',
        return_url: 'https://site.com/done',
      });
    });

    it('should return session URL for redirect', async () => {
      const mockSession = {
        url: 'https://billing.stripe.com/portal/session_xyz',
      } as unknown as Stripe.BillingPortal.Session;
      
      mockStripeInstance.billingPortal.sessions.create.mockResolvedValueOnce(mockSession);

      const result = await executor.createPortalSession('cus_123', 'https://example.com');

      expect(result.url).toBe('https://billing.stripe.com/portal/session_xyz');
    });
  });
});
