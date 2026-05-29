const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check if column exists
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'lastLoginAt'
    `;
    
    if (result.length === 0) {
      console.log('❌ Column lastLoginAt does NOT exist. Adding it now...');
      await prisma.$executeRaw`
        ALTER TABLE users ADD COLUMN "lastLoginAt" TIMESTAMP(3)
      `;
      console.log('✅ Column lastLoginAt added successfully!');
    } else {
      console.log('✅ Column lastLoginAt already exists.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
