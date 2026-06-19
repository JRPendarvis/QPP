export interface UserProfile {
  skillLevel: string;
  subscriptionTier: string;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
    credits: {
      used: number;
      limit: number;
      remaining: number;
    };
    downloads: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
}

export interface PatternDetails {
  id: string;
  name: string;
  minFabrics: number;
  maxFabrics: number;
}

export type PatternChoice = 'auto' | 'manual' | 'unique';