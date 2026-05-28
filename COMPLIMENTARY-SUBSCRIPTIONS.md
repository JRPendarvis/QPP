# Complimentary Subscription System

This system allows administrators to grant Pro-level access to users **without requiring credit card information** for promotional, beta testing, or partnership purposes.

## Features

- ✅ Grant Pro (advanced), Enthusiast (intermediate), or Hobbyist (basic) access
- ✅ Set custom duration (1-24 months)
- ✅ Bulk grant for multiple users at once
- ✅ Automatically creates user accounts with temporary passwords
- ✅ No Stripe integration required
- ✅ Full admin audit trail
- ✅ Extend or revoke access at any time
- ✅ Track all complimentary subscribers

## How It Works

Complimentary subscriptions work by:
1. Setting the user's `subscriptionTier` to the desired level (basic/intermediate/advanced)
2. Setting `subscriptionStatus` to 'active'
3. Setting `currentPeriodEnd` to the expiration date
4. Leaving `stripeCustomerId` and `stripeSubscriptionId` as `null`

The existing validation logic already handles this correctly - it checks `currentPeriodEnd` to validate access, regardless of whether the subscription is paid or complimentary.

## API Endpoints

### 1. Grant Single Complimentary Subscription

**Endpoint:** `POST /api/admin/grant-complimentary`

**Headers:**
```
Authorization: Bearer <your_admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "tier": "advanced",
  "durationMonths": 6,
  "reason": "Beta tester for 6-month trial"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complimentary advanced subscription granted to user@example.com",
  "data": {
    "userId": "cm5abc123",
    "email": "user@example.com",
    "tier": "advanced",
    "expiresAt": "2026-11-27T00:00:00.000Z",
    "granted": true
  }
}
```

---

### 2. Grant Bulk Complimentary Subscriptions (20 People at Once)

**Endpoint:** `POST /api/admin/grant-complimentary-bulk`

**Body:**
```json
{
  "subscriptions": [
    {
      "email": "beta-tester-1@example.com",
      "tier": "advanced",
      "durationMonths": 6,
      "reason": "Beta tester program"
    },
    {
      "email": "beta-tester-2@example.com",
      "tier": "advanced",
      "durationMonths": 6,
      "reason": "Beta tester program"
    },
    {
      "email": "beta-tester-3@example.com",
      "tier": "advanced",
      "durationMonths": 6,
      "reason": "Beta tester program"
    }
    // ... up to 100 users per request
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Processed 20 subscriptions",
  "data": {
    "successful": [
      {
        "userId": "cm5abc123",
        "email": "beta-tester-1@example.com",
        "tier": "advanced",
        "expiresAt": "2026-11-27T00:00:00.000Z",
        "granted": true
      }
      // ... 19 more
    ],
    "failed": []
  }
}
```

---

### 3. List All Complimentary Subscribers

**Endpoint:** `GET /api/admin/complimentary-subscribers`

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": "cm5abc123",
      "email": "beta-tester-1@example.com",
      "name": "John Doe",
      "subscriptionTier": "advanced",
      "subscriptionStatus": "active",
      "currentPeriodEnd": "2026-11-27T00:00:00.000Z",
      "createdAt": "2026-05-27T00:00:00.000Z"
    }
    // ... 19 more
  ]
}
```

---

### 4. Extend Complimentary Subscription

**Endpoint:** `POST /api/admin/extend-complimentary/:userId`

**Body:**
```json
{
  "additionalMonths": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Extended subscription by 3 months",
  "data": {
    "newExpiresAt": "2027-02-27T00:00:00.000Z"
  }
}
```

---

### 5. Revoke Complimentary Subscription

**Endpoint:** `DELETE /api/admin/revoke-complimentary/:userId`

**Response:**
```json
{
  "success": true,
  "message": "Complimentary subscription revoked"
}
```

---

## Quick Start: Grant 20 People Pro Access for 6 Months

### Option 1: Using cURL (One by One)

```bash
# Set your admin token
ADMIN_TOKEN="your_admin_jwt_token_here"

# Grant to first user
curl -X POST http://localhost:3001/api/admin/grant-complimentary \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "beta-tester-1@example.com",
    "tier": "advanced",
    "durationMonths": 6,
    "reason": "6-month Pro trial program"
  }'
```

### Option 2: Using cURL (Bulk - Recommended)

Create a file `beta-testers.json`:
```json
{
  "subscriptions": [
    { "email": "beta1@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta2@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta3@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta4@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta5@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta6@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta7@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta8@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta9@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta10@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta11@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta12@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta13@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta14@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta15@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta16@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta17@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta18@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta19@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" },
    { "email": "beta20@example.com", "tier": "advanced", "durationMonths": 6, "reason": "6-month Pro trial" }
  ]
}
```

Then run:
```bash
curl -X POST http://localhost:3001/api/admin/grant-complimentary-bulk \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @beta-testers.json
```

### Option 3: Using Postman

1. **Request Type:** POST
2. **URL:** `http://localhost:3001/api/admin/grant-complimentary-bulk`
3. **Headers:**
   - `Authorization: Bearer YOUR_ADMIN_TOKEN`
   - `Content-Type: application/json`
4. **Body (raw JSON):** Paste the JSON from `beta-testers.json` above
5. **Click Send**

---

## Subscription Tiers

| Tier | Name | Generations/Month | Downloads/Month | Price (Regular) |
|------|------|-------------------|-----------------|-----------------|
| `basic` | Hobbyist | 5 | 2 | $5.99/mo |
| `intermediate` | Enthusiast | 15 | 10 | $9.99/mo |
| `advanced` | Pro | 50 | 25 | $19.99/mo |

---

## New User Behavior

When granting complimentary access to a **new email** (user doesn't exist yet):

1. ✅ User account is automatically created
2. ✅ A temporary random password is generated
3. ✅ User receives Pro access immediately
4. ⚠️ **User must use "Forgot Password" to set their own password before first login**

**Recommended Email Template to Send:**

```
Subject: Your QuiltPlannerPro Pro Access is Ready!

Hi [Name],

You've been granted complimentary Pro access to QuiltPlannerPro for 6 months!

To get started:
1. Go to https://quiltplannerpro.com/forgot-password
2. Enter your email: [their-email]
3. Check your email for a password reset link
4. Create your own secure password
5. Log in and start creating patterns!

Your Pro benefits include:
- 50 pattern generations per month
- 25 pattern downloads per month
- Access to all advanced patterns

Your access expires on: [expiration-date]

Questions? Reply to this email.

Happy quilting!
The QuiltPlannerPro Team
```

---

## Existing User Behavior

When granting complimentary access to an **existing user**:

1. ✅ Their subscription tier is upgraded immediately
2. ✅ They can continue using their existing password
3. ✅ Their Stripe information (if any) is preserved
4. ✅ They will see the upgraded benefits on next login

---

## Audit Trail

All complimentary grants are logged with:
- Admin email who granted access
- User email who received access
- Tier granted
- Duration in months
- Reason provided

Example log:
```
[Complimentary] Granted by: admin@quiltplannerpro.com | User: beta1@example.com | Tier: advanced | Duration: 6mo | Reason: 6-month Pro trial program
```

---

## Monitoring & Management

### Check Who Has Complimentary Access

```bash
curl http://localhost:3001/api/admin/complimentary-subscribers \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Extend Access for Someone

If you want to give them 3 more months:
```bash
curl -X POST http://localhost:3001/api/admin/extend-complimentary/cm5abc123 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"additionalMonths": 3}'
```

### Revoke Access Early

```bash
curl -X DELETE http://localhost:3001/api/admin/revoke-complimentary/cm5abc123 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Automatic Expiration

After 6 months:
- ✅ Users automatically lose Pro access (based on `currentPeriodEnd`)
- ✅ They revert to Free tier limits
- ✅ No manual action needed
- ✅ They can purchase a paid subscription at any time

---

## Security

- 🔒 All endpoints require admin authentication
- 🔒 Admin role is verified by `requireAdmin` middleware
- 🔒 Rate limiting applies
- 🔒 Audit logs for all actions
- 🔒 Maximum 100 users per bulk request

---

## Common Issues & Solutions

### Issue: "User not found" when trying to extend/revoke
**Solution:** Use the correct `userId` (starts with "cm5..."), not the email address

### Issue: "Invalid tier"
**Solution:** Use `basic`, `intermediate`, or `advanced` (not "pro" or "free")

### Issue: "Unauthorized"
**Solution:** Make sure you're logged in as an admin user (role: 'staff')

### Issue: Users can't log in
**Solution:** New users must use "Forgot Password" first to set their password

---

## Production Checklist

Before granting complimentary access in production:

- [ ] Verify you have the correct email addresses
- [ ] Test with 1-2 users first
- [ ] Prepare welcome email template
- [ ] Set up expiration reminder emails (optional)
- [ ] Document who received access and why
- [ ] Set calendar reminder to review access before expiration

---

## Questions?

Contact the dev team or check the implementation in:
- Service: `backend/src/services/admin/complimentarySubscriptionService.ts`
- Controller: `backend/src/controllers/adminController.ts`
- Routes: `backend/src/routes/adminRoutes.ts`
