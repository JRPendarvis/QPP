# Test Account Credentials

**For Automated UI Testing (Cypress, Playwright, Selenium)**

## Credentials

```
Email:    test@quiltplanpro.com
Password: TestPassword123!
```

## Account Details

- **Tier:** Intermediate (15 generations/month)
- **Skill Level:** Intermediate  
- **Role:** Regular user
- **Badge:** Tester
- **Expires:** 2030-12-31

## Setup

```bash
# Create test account
cd backend
npm run db:seed

# Verify account exists
✅ Created test user: test@quiltplanpro.com
```

## Usage

```javascript
// Login in tests
cy.visit('/login');
cy.get('input[name="email"]').type('test@quiltplanpro.com');
cy.get('input[name="password"]').type('TestPassword123!');
cy.get('button[type="submit"]').click();
```

## Reset Usage

```bash
# Re-run seed (idempotent)
npm run db:seed
```

---

📖 **Full Documentation:** [AUTOMATED-TESTING-SETUP.md](./AUTOMATED-TESTING-SETUP.md)
