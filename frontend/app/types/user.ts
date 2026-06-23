export interface UserProfile {
  skillLevel: string;
  subscriptionTier: string;
  name?: string;
  email: string;
  badge?: string;
  role?: string;
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
