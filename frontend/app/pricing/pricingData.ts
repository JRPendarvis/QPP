export interface PricingTier {
  name: string;
  id: string;
  price: {
    monthly: number;
    annual: number;
  };
  patterns: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  buttonAction: 'register' | 'subscribe';
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    id: 'free',
    price: { monthly: 0, annual: 0 },
    patterns: '1 lifetime pattern',
    features: [
      'Basic pattern generation',
      'Standard patterns only',
      'Community support'
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonAction: 'register'
  },
  {
    name: 'Hobbyist',
    id: 'basic',
    price: { monthly: 5.99, annual: 59.99 },
    patterns: '5 per month',
    features: [
      'Skill level matching',
      'Advanced patterns',
      'Priority email support'
    ],
    popular: false,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  },
  {
    name: 'Enthusiast',
    id: 'intermediate',
    price: { monthly: 9.99, annual: 94.99 },
    patterns: '15 per month',
    features: [
      'All Hobbyist features',
      'Expert-level patterns',
      'Priority support',
      'Advanced customization',
      'PDF downloads'
    ],
    popular: true,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  },
  {
    name: 'Pro',
    id: 'advanced',
    price: { monthly: 19.99, annual: 199.99 },
    patterns: '50 per month',
    features: [
      'Everything included',
      'Commercial use rights',
      'API access (coming soon)',
      'Dedicated support'
    ],
    popular: false,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  }
];
