# Test Account Setup for Automated UI Testing

## Overview

QuiltPlannerPro includes a seeded test account specifically for automated UI testing (Cypress, Playwright, Selenium, etc.).

## Test Account Credentials

**Email:** `test@quiltplanpro.com`  
**Password:** `TestPassword123!`

**Account Details:**
- **Subscription Tier:** Intermediate (15 generations/month)
- **Skill Level:** Intermediate
- **Role:** Regular user (not staff)
- **Badge:** Tester
- **Period End:** 2030-12-31 (stable for long-term testing)

## Setup Instructions

### 1. Seed the Database

Run the seed script to create the test account:

```bash
cd backend
npm run db:seed
```

Or using Prisma CLI directly:

```bash
npx prisma db seed
```

### 2. Verify Test Account

The seed script will:
- Check if test account already exists
- Create account if it doesn't exist
- Output credentials to console

**Output:**
```
✅ Created test user: {
  email: 'test@quiltplanpro.com',
  id: 'cuid_here',
  tier: 'intermediate',
  credentials: {
    email: 'test@quiltplanpro.com',
    password: 'TestPassword123!'
  }
}
```

### 3. Re-run Anytime

The seed script is idempotent - safe to run multiple times:
- Won't create duplicates
- Will skip if account exists
- Can be run in CI/CD pipelines

## Usage in Automated Tests

### Cypress Example

```javascript
// cypress/support/commands.js
Cypress.Commands.add('loginAsTestUser', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type('test@quiltplanpro.com');
  cy.get('input[name="password"]').type('TestPassword123!');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// cypress/e2e/pattern-generation.cy.js
describe('Pattern Generation Flow', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('should generate a pattern', () => {
    cy.visit('/upload');
    // ... rest of test
  });
});
```

### Playwright Example

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@quiltplanpro.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: authFile });
});

// tests/pattern.spec.ts
import { test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('generate pattern', async ({ page }) => {
  await page.goto('/upload');
  // ... rest of test
});
```

### Selenium Example

```javascript
// tests/helpers/auth.js
async function loginAsTestUser(driver) {
  await driver.get('http://localhost:3000/login');
  await driver.findElement(By.name('email')).sendKeys('test@quiltplanpro.com');
  await driver.findElement(By.name('password')).sendKeys('TestPassword123!');
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains('/dashboard'), 5000);
}

module.exports = { loginAsTestUser };
```

## Environment-Specific Setup

### Development
```bash
# .env.development
DATABASE_URL="postgresql://user:password@localhost:5432/quiltplanner_dev"
```

```bash
npm run db:seed
```

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run migrations
        working-directory: ./backend
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Seed test account
        working-directory: ./backend
        run: npm run db:seed
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Start backend
        working-directory: ./backend
        run: npm run dev &
      
      - name: Start frontend
        working-directory: ./frontend
        run: npm run dev &
      
      - name: Wait for services
        run: npx wait-on http://localhost:3001/health http://localhost:3000
      
      - name: Run E2E tests
        run: npm run test:e2e
```

### Production/Staging (Railway)

**Option 1: Manual seed via Railway CLI**
```bash
railway run npm run db:seed
```

**Option 2: Automatic seed on deploy**

Update `backend/package.json`:
```json
{
  "scripts": {
    "start": "npm run db:seed && node scripts/production-safety-check.js && npx prisma migrate deploy && node dist/index.js"
  }
}
```

⚠️ **Note:** Be cautious with auto-seeding in production. Consider using staging environment only.

## Resetting Test Data

If the test account gets corrupted or needs reset:

### Option 1: Delete and Re-seed

```bash
# Delete test user (PostgreSQL)
psql $DATABASE_URL -c "DELETE FROM users WHERE email = 'test@quiltplanpro.com';"

# Re-seed
npm run db:seed
```

### Option 2: Reset Usage Counters

```bash
psql $DATABASE_URL -c "
  UPDATE users 
  SET 
    generations_this_month = 0,
    downloads_this_month = 0,
    last_reset_date = NOW()
  WHERE email = 'test@quiltplanpro.com';
"
```

### Option 3: Delete Generated Patterns

```bash
psql $DATABASE_URL -c "
  DELETE FROM patterns 
  WHERE user_id IN (
    SELECT id FROM users WHERE email = 'test@quiltplanpro.com'
  );
"
```

## Security Considerations

### ✅ Safe Practices
- Test account only in **development** and **staging**
- Simple password acceptable for automated testing
- Account has **regular user role** (not staff)
- Credentials in **documentation only** (not committed to secrets)

### ⚠️ Production Warnings
- **DO NOT** use in production environment
- **DO NOT** store real user data in test account
- **DO NOT** give test account elevated privileges
- Consider creating separate `TEST_ENV` database

### 🔒 Recommended: Separate Test Database

```bash
# .env.test
DATABASE_URL="postgresql://user:password@localhost:5432/quiltplanner_test"

# .env.development  
DATABASE_URL="postgresql://user:password@localhost:5432/quiltplanner_dev"

# .env.production
DATABASE_URL="postgresql://user:password@prod-server/quiltplanner_prod"
```

## Troubleshooting

### Issue: Seed script fails with "User already exists"

**Solution:** This is expected behavior. The script will skip creation if user exists.

### Issue: Login fails in tests

**Checklist:**
1. Verify database is seeded: `npm run db:seed`
2. Check backend is running: `curl http://localhost:3001/health`
3. Verify credentials match exactly (case-sensitive)
4. Check browser console for CORS errors
5. Verify cookies are enabled in test environment

### Issue: "Generations limit reached"

**Solution:** Reset usage counters:
```bash
npm run db:seed  # Re-run seed (updates existing user)
```

Or manually:
```sql
UPDATE users 
SET generations_this_month = 0, downloads_this_month = 0 
WHERE email = 'test@quiltplanpro.com';
```

## Alternative: API-Based Test Account Creation

If you need dynamic test accounts (create/destroy per test run), add this endpoint:

```typescript
// backend/src/routes/testRoutes.ts (only in test environment)
if (process.env.NODE_ENV === 'test') {
  router.post('/api/test/create-user', async (req, res) => {
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        passwordHash: await bcrypt.hash('TestPassword123!', 10),
        name: 'Test User',
        subscriptionTier: 'intermediate',
        subscriptionStatus: 'active',
        role: 'user',
      },
    });
    res.json({ email: testUser.email, password: 'TestPassword123!' });
  });

  router.delete('/api/test/cleanup', async (req, res) => {
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'test-' } },
    });
    res.json({ success: true });
  });
}
```

## Summary

**Quick Start:**
1. Run `npm run db:seed` in backend
2. Use credentials: `test@quiltplanpro.com` / `TestPassword123!`
3. Login in your automated tests
4. Re-seed anytime to reset

**Best Practices:**
- Use separate test database
- Run seed in CI/CD pipelines
- Reset data between test runs
- Keep test account as regular user (not staff)

For questions or issues, see project documentation or contact the development team.
