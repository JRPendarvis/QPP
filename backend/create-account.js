const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAccount() {
  const email = 'jpendarvis@msn.com';
  const password = 'D@d!s@w3s0m3';
  const name = 'J Pendarvis';

  try {
    // Check if account already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      console.log('✅ Account already exists:', email);
      console.log('   Use password:', password);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Determine tester badge
    const cutoffDate = new Date('2026-02-28T23:59:59Z');
    const badge = new Date() < cutoffDate ? 'tester' : undefined;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        badge,
        termsAcceptedAt: new Date(),
        privacyAcceptedAt: new Date(),
        skillLevel: 'beginner'
      }
    });

    console.log('\n✅ Account created successfully!');
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', name);
    console.log('🎯 Tier:', user.subscriptionTier);
    console.log('🏅 Badge:', user.badge || 'none');
    console.log('\nYou can now log in at http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error creating account:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAccount();
