#!/usr/bin/env node
/**
 * Production Database Safety Check
 * Prevents accidental database resets in production
 */

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

console.log('🔍 Running production safety checks...');

// Check 1: Verify we're not using a local database in production
if (isProduction && databaseUrl && databaseUrl.includes('localhost')) {
  console.error('\n❌ CRITICAL ERROR: Production deployment is pointing to localhost database!');
  console.error('   DATABASE_URL:', databaseUrl);
  console.error('\n   Update DATABASE_URL to point to your production database.');
  process.exit(1);
}

// Check 2: Verify database URL is set
if (!databaseUrl) {
  console.error('\n❌ CRITICAL ERROR: DATABASE_URL environment variable is not set!');
  console.error('\n   Set DATABASE_URL before starting the server.');
  process.exit(1);
}

// Check 3: Warn if running dangerous commands
const dangerousCommands = process.argv.slice(2);
if (dangerousCommands.some(cmd => 
  cmd.includes('reset') || 
  cmd.includes('--force-reset') || 
  cmd.includes('migrate dev')
)) {
  console.error('\n❌ CRITICAL ERROR: Dangerous migration command detected!');
  console.error('   Command:', dangerousCommands.join(' '));
  console.error('\n   Use "npx prisma migrate deploy" for production.');
  process.exit(1);
}

console.log('✅ Safety checks passed');
console.log('   Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('   Database:', databaseUrl.replace(/:[^:@]*@/, ':****@')); // Hide password

process.exit(0);
