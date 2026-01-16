const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'jpendarvis@msn.com';
  const newPassword = 'D@d!s@w3s0m3';

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        createdAt: true
      }
    });

    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    console.log('\n✅ User found:');
    console.log('   Email:', user.email);
    console.log('   ID:', user.id);
    console.log('   Created:', user.createdAt);
    console.log('   Current hash:', user.passwordHash.substring(0, 20) + '...');

    // Test current password
    const isMatch = await bcrypt.compare(newPassword, user.passwordHash);
    console.log('\n🔐 Testing password "D@d!s@w3s0m3":', isMatch ? '✅ MATCHES' : '❌ DOES NOT MATCH');

    if (!isMatch) {
      console.log('\n🔧 Resetting password to: D@d!s@w3s0m3');
      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      await prisma.user.update({
        where: { email },
        data: { passwordHash }
      });

      console.log('✅ Password reset successfully!');
      
      // Verify the new password works
      const verifyUser = await prisma.user.findUnique({ where: { email } });
      const verifyMatch = await bcrypt.compare(newPassword, verifyUser.passwordHash);
      console.log('🔍 Verification:', verifyMatch ? '✅ Password works!' : '❌ Still not working');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
