# Production Database Safety Guide

## ⚠️ CRITICAL: Preventing Production Data Loss

### What Happened to Your Local Database

Your local database was likely wiped due to one of these reasons:
1. Running `prisma migrate reset` (NEVER run in production)
2. Manual database drop/recreation
3. Connection to wrong database
4. Migration rollback issue

### Production Safeguards in Place

#### 1. Start Script Safety
```json
"start": "npx prisma migrate resolve --rolled-back 20260114163851_add_pattern_library_and_feedback_resolved || true && npx prisma migrate deploy && node dist/index.js"
```

- ✅ Uses `migrate deploy` (safe for production)
- ✅ Does NOT use `migrate dev` or `migrate reset`
- ✅ Resolves rolled-back migration before deploying
- ✅ `|| true` prevents startup failure if migration already resolved

#### 2. Migration Safety Features

All recent migrations use `ADD COLUMN IF NOT EXISTS` to prevent errors:
- Won't fail if columns already exist
- Won't drop existing data
- Idempotent (safe to run multiple times)

#### 3. Railway Configuration

Railway automatically:
- ✅ Backs up database before deployments
- ✅ Uses `npm start` script (not dev commands)
- ✅ Provides database rollback capabilities

### 🚨 NEVER Run These Commands in Production

```bash
# ❌ DANGEROUS - Wipes entire database
prisma migrate reset

# ❌ DANGEROUS - Development-only command
prisma migrate dev

# ❌ DANGEROUS - Drops all data
prisma db push --force-reset

# ❌ DANGEROUS - Direct SQL drop
DROP DATABASE quiltplannerpro;
```

### ✅ Safe Production Commands

```bash
# ✅ SAFE - Deploy pending migrations
npx prisma migrate deploy

# ✅ SAFE - Check migration status
npx prisma migrate status

# ✅ SAFE - Generate Prisma Client
npx prisma generate

# ✅ SAFE - View data (read-only)
npx prisma studio
```

### Environment Protection

Create `.env` file with proper DATABASE_URL:

**Local Development:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/quiltplannerpro"
```

**Production (Railway):**
```env
DATABASE_URL="${DATABASE_URL}"  # Auto-provided by Railway
NODE_ENV="production"
```

### Pre-Deployment Checklist

Before deploying to production:

- [ ] Verify `package.json` start script uses `migrate deploy` only
- [ ] Test migrations locally first
- [ ] Check migration files don't contain DROP statements
- [ ] Ensure migrations use `IF NOT EXISTS` clauses
- [ ] Back up production database manually if making schema changes
- [ ] Review Railway deployment logs after push

### Emergency Recovery

If production data is lost:

1. **Railway Dashboard** → Your Service → Database → Backups
2. Restore from most recent backup
3. Check migration status: `npx prisma migrate status`
4. Re-run migrations if needed: `npx prisma migrate deploy`

### Railway Backup Schedule

Railway automatically backs up your database:
- Daily automatic backups (retained for 7 days on free tier)
- Manual backups available in Railway dashboard
- Point-in-time recovery available on paid plans

### Additional Protection Recommendations

1. **Enable Railway Database Backups**
   - Go to Railway dashboard
   - Select your database service
   - Enable automatic backups

2. **Add Production Guard Script**
   - Create pre-deploy hook to prevent dangerous commands
   - Verify NODE_ENV before migrations

3. **Monitor Database Health**
   - Set up alerts for database changes
   - Track migration history
   - Log all schema modifications

### If You See These Warnings

```
Database reset detected
Migration rolled back
Applying destructive changes
```

**STOP** and verify you're not accidentally running dev commands in production.

### Contact Info for Emergencies

- Railway Support: https://railway.app/help
- Database Restore: Railway Dashboard → Database → Backups
- Migration Issues: Check Prisma docs on migration troubleshooting
