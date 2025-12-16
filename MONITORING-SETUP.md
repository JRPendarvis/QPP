# Error Tracking & Monitoring Setup

## Error Tracking with Sentry

### 1. Install Sentry
```bash
cd frontend
npm install @sentry/nextjs
```

### 2. Initialize Sentry
```bash
npx @sentry/wizard@latest -i nextjs
```

### 3. Add Sentry Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### 4. Configuration Files Created
- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime tracking

## Uptime Monitoring

### Option 1: UptimeRobot (Free)
1. Go to https://uptimerobot.com
2. Create account
3. Add monitors:
   - **Frontend**: https://www.quiltplannerpro.com
   - **Backend API**: https://qpp-backend-production.up.railway.app/health
4. Set alert contacts (email, SMS)
5. Check interval: 5 minutes

### Option 2: Railway Built-in Monitoring
1. Railway provides automatic health checks
2. Configure in `railway.json`:
```json
{
  "healthcheckPath": "/health",
  "healthcheckTimeout": 300
}
```

### Option 3: Better Uptime (Paid)
1. Go to https://betteruptime.com
2. More advanced features
3. Status page included

## Health Check Endpoint
Already exists at: `/health` in backend
Returns:
```json
{
  "status": "ok",
  "timestamp": "2025-12-16T..."
}
```

## Error Tracking Best Practices

### Frontend Error Boundary
Already implemented in Next.js - errors automatically caught.

### Custom Error Logging
Add to critical operations:
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### Performance Monitoring
Sentry automatically tracks:
- Page load times
- API response times
- Database query performance
- User interactions

## Monitoring Checklist
- [ ] Install Sentry in frontend
- [ ] Configure Sentry DSN
- [ ] Set up UptimeRobot monitors
- [ ] Test error tracking
- [ ] Configure alert notifications
- [ ] Add team members to alerts
- [ ] Create status page (optional)
