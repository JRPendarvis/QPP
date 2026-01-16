# Railway Deployment Guide for QuiltPlannerPro

## Backend Deployment

### Required Environment Variables on Railway:

```
DATABASE_URL=<Railway will auto-provide this from PostgreSQL service>
JWT_SECRET=<generate-a-secure-random-string>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
OPENAI_API_KEY=<your-openai-api-key>
FRONTEND_URL=<your-frontend-railway-url>
NODE_ENV=production
TRUST_PROXY=1
ADMIN_API_KEY=<generate-a-secure-random-string>
RESEND_API_KEY=<your-resend-api-key-optional>
```

### Deployment Steps:

1. **Create New Project on Railway**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub repository

2. **Add PostgreSQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create DATABASE_URL variable

3. **Configure Backend Service**
   - Railway should auto-detect the backend folder
   - Root directory: `/backend`
   - Build command: `npm run build`
   - Start command: `npm start` (will run migrations automatically)

4. **Set Environment Variables**
   - Go to backend service settings
   - Add all required environment variables listed above
   - Save changes

5. **Deploy**
   - Push to your main branch
   - Railway will automatically build and deploy
   - Migrations will run automatically on startup

### Important Notes:

- ✅ Migrations are tracked in `/prisma/migrations` and will auto-apply
- ✅ `TRUST_PROXY=1` is required for Railway (reverse proxy environment)
- ✅ Cron jobs will run automatically (usage reset & pattern cleanup)
- ⚠️ Set `FRONTEND_URL` to your frontend Railway domain for CORS
- ⚠️ Update Stripe webhook URL to point to Railway backend

### Verifying Deployment:

```bash
# Check health endpoint
curl https://your-backend.railway.app/health

# Should return:
{
  "status": "ok",
  "message": "QuiltPlannerPro API running",
  "time": "2026-01-14T..."
}
```

## Frontend Deployment

### Required Environment Variables:

```
NEXT_PUBLIC_API_URL=<your-backend-railway-url>
```

### Configuration:

1. Root directory: `/frontend`
2. Build command: `npm run build`
3. Start command: `npm start`
4. Framework: Next.js

## Post-Deployment Checklist:

- [ ] Backend health check responds
- [ ] Database migrations applied
- [ ] CORS allows frontend domain
- [ ] Stripe webhook updated to Railway URL
- [ ] Pattern generation works
- [ ] PDF downloads work
- [ ] Pattern library loads
- [ ] Cron jobs logging (check Railway logs)

## Monitoring:

Railway provides built-in logging. Check for:
- Migration success messages
- Cron job initialization
- API requests
- Any errors or warnings
