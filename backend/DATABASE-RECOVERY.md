# Database Backup & Recovery

## Quick Commands

### Backup Database (Local)
```bash
# Manual backup
pg_dump postgresql://user:password@localhost:5432/quiltplannerpro > backup.sql

# Or use npm script (if configured)
npm run db:backup
```

### Restore Database (Local)
```bash
# Drop and recreate database
dropdb quiltplannerpro
createdb quiltplannerpro

# Restore from backup
psql postgresql://user:password@localhost:5432/quiltplannerpro < backup.sql
```

### Production Backups (Railway)

1. **Automatic Backups**: Railway creates daily automatic backups
2. **Manual Backup**: Railway Dashboard → Database → Create Backup
3. **Restore**: Railway Dashboard → Database → Backups → Restore

## Recovery Scripts

If you need to restore your local account after data loss:

```bash
cd backend
node create-account.js
```

## See Also

- [PRODUCTION-DATABASE-SAFETY.md](./PRODUCTION-DATABASE-SAFETY.md) - Full safety guide
- [RAILWAY-DEPLOYMENT.md](../RAILWAY-DEPLOYMENT.md) - Deployment instructions
