/**
 * Single Responsibility: Format fabric hold pricing and tier information
 * Pure utility functions with no side effects
 */

export function formatAddonPrice(price: number, billingInterval: 'monthly' | 'yearly'): string {
  if (price <= 0) {
    return billingInterval === 'yearly' ? 'Included yearly' : 'Included';
  }

  return billingInterval === 'yearly' ? `$${price.toFixed(0)}/year` : `$${price.toFixed(2)}/month`;
}

export type FabricHoldTierType = 'none' | '3' | '10' | '25' | '50';

/**
 * Compute the effective fabric hold tier based on subscription and badge
 * Handles defaults and overrides
 */
export function getEffectiveFabricHoldTier(
  subscriptionTier: string,
  badge: string | null,
  fabricHoldTier: FabricHoldTierType,
  fabricImageLimit: number
): FabricHoldTierType {
  // Founder badge overrides everything
  if (badge === 'founder') {
    return '50';
  }

  // Free users have no tiers
  if (subscriptionTier === 'free') {
    return 'none';
  }

  // Paid users with no entitlement default to 3
  if ((fabricHoldTier === 'none' || fabricImageLimit <= 0) && subscriptionTier !== 'free') {
    return '3';
  }

  return fabricHoldTier;
}

/**
 * Compute the effective image limit
 */
export function getEffectiveFabricImageLimit(
  subscriptionTier: string,
  badge: string | null,
  fabricHoldTier: FabricHoldTierType,
  fabricImageLimit: number
): number {
  const effectiveTier = getEffectiveFabricHoldTier(subscriptionTier, badge, fabricHoldTier, fabricImageLimit);

  if (effectiveTier === 'none') {
    return 0;
  }

  return Number(effectiveTier);
}
