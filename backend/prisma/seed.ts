/// <reference types="node" />

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test/guest user for automated UI testing
  const testEmail = 'test@quiltplanpro.com';
  const testPassword = 'TestPassword123!'; // Simple known password for automation
  
  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (existingUser) {
    console.log('✅ Test user already exists:', testEmail);
    return;
  }

  // Create password hash
  const passwordHash = await bcrypt.hash(testPassword, 10);

  // Create test user with intermediate subscription
  const testUser = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash,
      name: 'Test User',
      skillLevel: 'intermediate',
      subscriptionTier: 'intermediate',
      subscriptionStatus: 'active',
      role: 'user', // Regular user, not staff
      badge: 'tester',
      generationsThisMonth: 0,
      downloadsThisMonth: 0,
      termsAcceptedAt: new Date(),
      privacyAcceptedAt: new Date(),
      // Set period end far in future for testing stability
      currentPeriodEnd: new Date('2030-12-31'),
    },
  });

  console.log('✅ Created test user:', {
    email: testUser.email,
    id: testUser.id,
    tier: testUser.subscriptionTier,
    credentials: {
      email: testEmail,
      password: testPassword,
    },
  });

  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
