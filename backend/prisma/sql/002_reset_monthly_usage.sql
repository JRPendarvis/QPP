-- Monthly usage reset script (manual SQL fallback)
-- Non-destructive: updates counters only (no DELETE, DROP, or TRUNCATE).
-- Safe to run multiple times.

BEGIN;

-- Preview how many rows qualify before update.
SELECT COUNT(*) AS users_to_reset
FROM users
WHERE "lastResetDate" <= NOW() - INTERVAL '30 days';

UPDATE users
SET
  "generationsThisMonth" = 0,
  "lastResetDate" = NOW(),
  "downloadsThisMonth" = CASE
    WHEN "subscriptionTier" = 'free' THEN "downloadsThisMonth"
    ELSE 0
  END
WHERE "lastResetDate" <= NOW() - INTERVAL '30 days';

COMMIT;
