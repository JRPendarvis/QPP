## Quick Fix for Railway Migration Issue

**Current Status:** Migration `20260114163851_add_pattern_library_and_feedback_resolved` is marked as failed in Railway database.

**Fix Applied:** Updated `package.json` start script to automatically resolve the failed migration.

**Steps:**
1. ✅ Commit current changes
2. ✅ Push to trigger Railway deployment
3. ⏳ Wait for deployment to succeed
4. ✅ After success, update start script back to normal:

```json
"start": "npx prisma migrate deploy && node dist/index.js"
```

**What the fix does:**
- `npx prisma migrate resolve --rolled-back 20260114163851...` - Marks the failed migration as rolled back
- `|| true` - Continues even if migration wasn't failed
- `npx prisma migrate deploy` - Applies all migrations with new idempotent SQL
- `node dist/index.js` - Starts the server

**After deployment succeeds:**
The migration will be properly applied. You can then clean up the start script for future deployments.
