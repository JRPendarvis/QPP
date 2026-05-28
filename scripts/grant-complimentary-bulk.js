/**
 * Bulk Grant Complimentary Subscriptions
 * 
 * Usage:
 *   node scripts/grant-complimentary-bulk.js
 * 
 * Before running:
 * 1. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env
 * 2. Update the USER_EMAILS array below with the 20 email addresses
 * 3. Adjust TIER and DURATION_MONTHS if needed
 */

const axios = require('axios');
require('dotenv').config();

// ==================== CONFIGURATION ====================

// List of email addresses to grant access to
const USER_EMAILS = [
  'beta-tester-1@example.com',
  'beta-tester-2@example.com',
  'beta-tester-3@example.com',
  'beta-tester-4@example.com',
  'beta-tester-5@example.com',
  'beta-tester-6@example.com',
  'beta-tester-7@example.com',
  'beta-tester-8@example.com',
  'beta-tester-9@example.com',
  'beta-tester-10@example.com',
  'beta-tester-11@example.com',
  'beta-tester-12@example.com',
  'beta-tester-13@example.com',
  'beta-tester-14@example.com',
  'beta-tester-15@example.com',
  'beta-tester-16@example.com',
  'beta-tester-17@example.com',
  'beta-tester-18@example.com',
  'beta-tester-19@example.com',
  'beta-tester-20@example.com',
];

// Subscription settings
const TIER = 'advanced'; // 'basic', 'intermediate', or 'advanced'
const DURATION_MONTHS = 6; // 1-24 months
const REASON = '6-month Pro trial program';

// Backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Admin credentials (from .env)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ==================== SCRIPT ====================

async function loginAsAdmin() {
  console.log('🔑 Logging in as admin...');
  
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (!response.data.success || !response.data.data.token) {
      throw new Error('Login failed: ' + (response.data.message || 'No token received'));
    }

    console.log('✅ Logged in successfully');
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    throw error;
  }
}

async function grantBulkComplimentary(token) {
  console.log(`\n📝 Preparing to grant ${TIER} access to ${USER_EMAILS.length} users for ${DURATION_MONTHS} months...`);

  // Build the request body
  const subscriptions = USER_EMAILS.map(email => ({
    email,
    tier: TIER,
    durationMonths: DURATION_MONTHS,
    reason: REASON,
  }));

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/admin/grant-complimentary-bulk`,
      { subscriptions },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.success) {
      throw new Error('Grant failed: ' + (response.data.message || 'Unknown error'));
    }

    console.log('\n✅ Bulk grant complete!');
    console.log(`   Successful: ${response.data.data.successful.length}`);
    console.log(`   Failed: ${response.data.data.failed.length}`);

    if (response.data.data.successful.length > 0) {
      console.log('\n📊 Successful Grants:');
      response.data.data.successful.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.email}`);
        console.log(`      User ID: ${result.userId}`);
        console.log(`      Expires: ${new Date(result.expiresAt).toLocaleDateString()}`);
      });
    }

    if (response.data.data.failed.length > 0) {
      console.log('\n❌ Failed Grants:');
      response.data.data.failed.forEach((failure, index) => {
        console.log(`   ${index + 1}. ${failure.email}: ${failure.error}`);
      });
    }

    return response.data;
  } catch (error) {
    console.error('❌ Bulk grant error:', error.response?.data || error.message);
    throw error;
  }
}

async function listComplimentarySubscribers(token) {
  console.log('\n📋 Fetching all complimentary subscribers...');

  try {
    const response = await axios.get(`${BACKEND_URL}/api/admin/complimentary-subscribers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('Failed to fetch subscribers');
    }

    console.log(`✅ Found ${response.data.count} complimentary subscribers`);
    
    if (response.data.count > 0) {
      console.log('\n📊 Current Complimentary Subscribers:');
      response.data.data.forEach((user, index) => {
        const expires = user.currentPeriodEnd ? new Date(user.currentPeriodEnd) : null;
        const daysLeft = expires ? Math.ceil((expires - new Date()) / (1000 * 60 * 60 * 24)) : 0;
        
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      Tier: ${user.subscriptionTier}`);
        console.log(`      Expires: ${expires ? expires.toLocaleDateString() : 'N/A'}`);
        console.log(`      Days Left: ${daysLeft > 0 ? daysLeft : 'Expired'}`);
      });
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  console.log('🎯 QuiltPlannerPro Complimentary Subscription Grant Tool\n');
  console.log(`   Backend: ${BACKEND_URL}`);
  console.log(`   Tier: ${TIER}`);
  console.log(`   Duration: ${DURATION_MONTHS} months`);
  console.log(`   Users: ${USER_EMAILS.length}`);
  console.log(`   Reason: ${REASON}\n`);

  try {
    // Step 1: Login
    const token = await loginAsAdmin();

    // Step 2: Grant bulk access
    await grantBulkComplimentary(token);

    // Step 3: List all complimentary subscribers
    await listComplimentarySubscribers(token);

    console.log('\n✅ All done!');
    console.log('\n📧 Next steps:');
    console.log('   1. Send welcome emails to all users');
    console.log('   2. Remind them to use "Forgot Password" to set their password');
    console.log('   3. Set a calendar reminder to review access before expiration');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
