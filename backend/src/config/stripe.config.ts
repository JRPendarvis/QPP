export const STRIPE_PRICE_IDS = {
  basic: {
    monthly: 'price_1SZhHcRqNLKgMLBjKDfytLSf',
    yearly: 'price_1SZhKnRqNLKgMLBjd3Wb8ugf'
  },
  intermediate: {
    monthly: 'price_1SZhI4RqNLKgMLBjmAceZPOe',
    yearly: 'price_1SZhJZRqNLKgMLBjuDgIQHop'
  },
  advanced: {
    monthly: 'price_1SZhLXRqNLKgMLBjyDPD3RnR',
    yearly: 'price_1SZhPJRqNLKgMLBjrmxxG7Ry'
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
    name: 'Basic',
    generationsPerMonth: 10,
    downloadsPerMonth: 5,
    price: { monthly: 5.99, yearly: 59.99 }
  },
  intermediate: {
    name: 'Intermediate',
    generationsPerMonth: 30,
    downloadsPerMonth: 20,
    price: { monthly: 9.99, yearly: 94.99 }
  },
  advanced: {
    name: 'Advanced',
    generationsPerMonth: 100,
    downloadsPerMonth: 50,
    price: { monthly: 19.99, yearly: 199.99 }
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type BillingInterval = 'monthly' | 'yearly';