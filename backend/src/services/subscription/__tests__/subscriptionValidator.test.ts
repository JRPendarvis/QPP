import { PrismaClient } from '@prisma/client';
import { SubscriptionValidator } from '../subscriptionValidator';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

const baseUser = {
  id: 'user-1',
  email: 'user@example.com',
  name: 'Test User',
  skillLevel: 'intermediate',
  subscriptionTier: 'basic',
  subscriptionStatus: 'active',
  currentPeriodEnd: null,
  generationsThisMonth: 0,
  role: 'user',
};

describe('SubscriptionValidator', () => {
  let validator: SubscriptionValidator;

  beforeEach(() => {
    jest.clearAllMocks();
    validator = new SubscriptionValidator();
  });

  it('throws USER_NOT_FOUND when user does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(validator.validateUser('missing-user')).rejects.toThrow('USER_NOT_FOUND');
  });

  it('throws GENERATION_LIMIT_REACHED when required credits exceed tier capacity', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...baseUser,
      generationsThisMonth: 14,
      subscriptionTier: 'basic',
    });

    await expect(validator.validateUser(baseUser.id, 2)).rejects.toThrow('GENERATION_LIMIT_REACHED');
  });

  it('allows exact monthly credit boundary', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...baseUser,
      generationsThisMonth: 14,
      subscriptionTier: 'basic',
    });

    const result = await validator.validateUser(baseUser.id, 1);

    expect(result.user.id).toBe(baseUser.id);
    expect(result.tierConfig.creditsPerMonth).toBe(15);
  });

  it('bypasses credit limits for staff users', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...baseUser,
      role: 'staff',
      generationsThisMonth: 9999,
      subscriptionStatus: 'canceled',
      currentPeriodEnd: new Date('2020-01-01T00:00:00.000Z'),
    });

    const result = await validator.validateUser(baseUser.id, 5000);

    expect(result.tierConfig.creditsPerMonth).toBe(Infinity);
    expect(result.tierConfig.downloadsPerMonth).toBe(Infinity);
  });
});
