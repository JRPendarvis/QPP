const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const userCount = await prisma.user.count();
    const patternCount = await prisma.pattern.count();
    
    console.log('\n📊 Database Status:');
    console.log('   Users:', userCount);
    console.log('   Patterns:', patternCount);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          createdAt: true,
          subscriptionTier: true
        }
      });
      console.log('\n👥 Users in database:');
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.name || 'no name'}) - ${u.subscriptionTier} - Created: ${u.createdAt.toISOString().split('T')[0]}`);
      });
    } else {
      console.log('\n❌ No users found in database!');
      console.log('\nTo recreate your account, run:');
      console.log('   node create-account.js');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
