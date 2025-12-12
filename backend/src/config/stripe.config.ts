export const STRIPE_PRICE_IDS = {
  basic: {
    monthly: 'price_1SdHEORwuOWvN82FIzy01Rrp',
    yearly: 'price_1SdHEzRwuOWvN82FYgQ3ByP4'
  },
  intermediate: {
    monthly: 'price_1SdHGBRwuOWvN82FZmRfuFeR',
    yearly: 'price_1SdHGlRwuOWvN82FPoLQnCuP'
  },
  advanced: {
    monthly: 'price_1SdHHvRwuOWvN82FpBP67VXi',
    yearly: 'price_1SdHIZRwuOWvN82FEHaNp0ZF'
  }
} as const;

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    generationsPerMonth: 3,
    downloadsPerMonth: 1,
    price: { monthly: 0, yearly: 0 }
  },
  basic: {
    name: 'Hobbyist',
    generationsPerMonth: 10,
    downloadsPerMonth: 2,
    price: { monthly: 5.99, yearly: 59.99 }
  },
  intermediate: {
    name: 'Enthusiast',
    generationsPerMonth: 50,
    downloadsPerMonth: 10,
    price: { monthly: 9.99, yearly: 94.99 }
  },
  advanced: {
    name: 'Pro',
    generationsPerMonth: 200,
    downloadsPerMonth: 25,
    price: { monthly: 19.99, yearly: 199.99 }
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type BillingInterval = 'monthly' | 'yearly';