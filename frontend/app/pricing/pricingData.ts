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

export interface FabricHoldAddonOption {
  id: 'none' | '3' | '10' | '25' | '50';
  label: string;
  images: number;
  price: {
    monthly: number;
    annual: number;
  };
}

export const fabricHoldAddonOptions: FabricHoldAddonOption[] = [
  {
    id: 'none',
    label: 'No image saving',
    images: 0,
    price: { monthly: 0, annual: 0 }
  },
  {
    id: '3',
    label: 'Starter image saving',
    images: 3,
    price: { monthly: 0, annual: 0 }
  },
  {
    id: '10',
    label: 'Fabric Hold 10',
    images: 10,
    price: { monthly: 2.99, annual: 29.0 }
  },
  {
    id: '25',
    label: 'Fabric Hold 25',
    images: 25,
    price: { monthly: 5.99, annual: 59.0 }
  },
  {
    id: '50',
    label: 'Fabric Hold 50',
    images: 50,
    price: { monthly: 9.99, annual: 99.0 }
  }
];

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    id: 'free',
    price: { monthly: 0, annual: 0 },
    patterns: '3 credits/month • 1 download/month',
    features: [
      '3 AI credits per month',
      'Unlimited quilt generation',
      'Standard patterns only',
      '1 downloadable pattern per month',
      'Fabric Hold add-on available after upgrading',
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
    patterns: '15 credits/month • 2 downloads/month',
    features: [
      '15 AI credits per month',
      'Unlimited quilt generation',
      'AI fabric role assignment',
      'Includes Starter Fabric Hold (3 saved images)',
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
    patterns: '40 credits/month • 10 downloads/month',
    features: [
      '40 AI credits per month',
      'All Hobbyist features',
      'Includes Starter Fabric Hold (3 saved images)',
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
    patterns: '75 credits/month • 25 downloads/month',
    features: [
      '75 AI credits per month',
      'Everything included',
      'Includes Starter Fabric Hold (3 saved images)',
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
