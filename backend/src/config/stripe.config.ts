export const STRIPE_PRICE_IDS = {
  basic: {
    monthly: 'price_1SdHEORwuOWvN82FIzy01Rrp',
    yearly: 'price_1SdHEzRwuOWvN82FYgQ3ByP4',
  },
  intermediate: {
    monthly: 'price_1SdHGBRwuOWvN82FZmRfuFeR',
    yearly: 'price_1SdHGlRwuOWvN82FPoLQnCuP',
  },
  advanced: {
    monthly: 'price_1SdHHvRwuOWvN82FpBP67VXi',
    yearly: 'price_1SdHIZRwuOWvN82FEHaNp0ZF',
  },
} as const;

export const STRIPE_FABRIC_HOLD_PRICE_IDS = {
  '10': {
    monthly: 'price_1TW1S3RwuOWvN82F3l0nNChs',
    yearly: 'price_1TW1SrRwuOWvN82FWDjFlYPS',
  },
  '25': {
    monthly: 'price_1TW1TmRwuOWvN82FTaWfqiER',
    yearly: 'price_1TW1UkRwuOWvN82Fqma1ylHz',
  },
  '50': {
    monthly: 'price_1TW1VWRwuOWvN82FKFZsZDYx',
    yearly: 'price_1TW1W0RwuOWvN82FyM3eoIqZ',
  },
} as const;

export const FABRIC_HOLD_ADDON_PRICING = {
  none: { monthly: 0, yearly: 0 },
  '3': { monthly: 0, yearly: 0 },
  '10': { monthly: 2.99, yearly: 29.0 },
  '25': { monthly: 5.99, yearly: 59.0 },
  '50': { monthly: 9.99, yearly: 99.0 },
} as const;

export type FabricHoldTier = keyof typeof FABRIC_HOLD_ADDON_PRICING;

export const FABRIC_HOLD_IMAGE_LIMIT = {
  none: 0,
  '3': 3,
  '10': 10,
  '25': 25,
  '50': 50,
} as const;

export function resolveFabricImageLimit(fabricHoldTier: FabricHoldTier): number {
  return FABRIC_HOLD_IMAGE_LIMIT[fabricHoldTier];
}

export function resolveFabricHoldStripePriceId(
  fabricHoldTier: FabricHoldTier,
  billingInterval: BillingInterval
): string | null {
  if (
    fabricHoldTier === 'none' ||
    fabricHoldTier === '3'
  ) {
    return null;
  }

  return STRIPE_FABRIC_HOLD_PRICE_IDS[fabricHoldTier][billingInterval];
}

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    generationsPerMonth: 3,
    downloadsPerMonth: 1,
    includedFabricHoldImages: 0,
    price: { monthly: 0, yearly: 0 },
  },
  basic: {
    name: 'Hobbyist',
    generationsPerMonth: 5,
    downloadsPerMonth: 2,
    includedFabricHoldImages: 3,
    price: { monthly: 5.99, yearly: 59.99 },
  },
  intermediate: {
    name: 'Enthusiast',
    generationsPerMonth: 15,
    downloadsPerMonth: 10,
    includedFabricHoldImages: 3,
    price: { monthly: 9.99, yearly: 94.99 },
  },
  advanced: {
    name: 'Pro',
    generationsPerMonth: 50,
    downloadsPerMonth: 25,
    includedFabricHoldImages: 3,
    price: { monthly: 19.99, yearly: 199.99 },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type BillingInterval = 'monthly' | 'yearly';