import { Router, Request, Response } from 'express';

const router = Router();

// DEV ONLY: returns the raw Cookie header and origin for debugging cross-site cookie issues.
// Do NOT leave this enabled in production for long — it exposes sensitive cookie contents.
router.get('/cookies', (req: Request, res: Response) => {
  const cookieHeader = req.headers.cookie || null;
  const origin = req.headers.origin || req.headers.referer || null;
  res.json({ success: true, cookies: cookieHeader, origin });
});

export default router;
