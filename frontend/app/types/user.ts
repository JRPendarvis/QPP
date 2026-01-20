export interface UserProfile {
  skillLevel: string;
  subscriptionTier: string;
  name?: string;
  email: string;
  badge?: string;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
    generations: {
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
