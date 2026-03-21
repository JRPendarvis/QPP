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
    patterns: '3 pattern generations/month • 1 download/month',
    features: [
      'Basic pattern generation',
      'Standard patterns only',
      '1 downloadable pattern per month',
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
    patterns: '5 pattern generations/month • 2 downloads/month',
    features: [
      'Skill level matching',
      'Advanced patterns',
      '2 downloadable patterns per month',
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
    patterns: '15 pattern generations/month • 10 downloads/month',
    features: [
      'All Hobbyist features',
      'Expert-level patterns',
      'Priority support',
      'Advanced customization',
      '10 downloadable patterns per month'
    ],
    popular: true,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  },
  {
    name: 'Pro',
    id: 'advanced',
    price: { monthly: 19.99, annual: 199.99 },
    patterns: '50 pattern generations/month • 25 downloads/month',
    features: [
      'Everything included',
      '25 downloadable patterns per month',
      'Commercial use rights',
      'API access (coming soon)',
      'Dedicated support'
    ],
    popular: false,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  }
];
