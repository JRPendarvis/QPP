# Credit Rollout QA (Section 10)

Date: 2026-06-21
Scope: pricing, profile, upload flow messaging, checkout messaging, admin reporting, and credit validation tests.

## Automated Validation

- Backend tests (targeted):
  - `src/services/subscription/__tests__/subscriptionValidator.test.ts`
  - `src/services/admin/__tests__/adminAnalyticsService.test.ts`
  - Result: PASS (19 tests)
- Frontend production build:
  - Command: `npm run build`
  - Result: PASS

## Functional QA Checklist

- Pricing cards display updated monthly credits (3, 15, 40, 75): PASS
- Pricing cards include Fabric Hold entitlement copy for paid tiers (Starter Fabric Hold with 3 saved images): PASS
- Pricing hero copy explains paid-tier Starter Fabric Hold + add-on upgrades: PASS
- FAQ pricing and credits language uses updated monthly credit model: PASS
- Profile usage widget free-tier credit copy matches current allowance (3 credits): PASS
- Admin overview includes "monthly credits consumed by tier" visibility: PASS
- Credit validation edge-case tests included:
  - Insufficient credits: PASS
  - Exact boundary: PASS
  - Staff bypass: PASS

## Notes

- Frontend build includes a pre-existing Turbopack warning about workspace root/NFT trace. Build completes successfully.
- This QA pass validates messaging and credit logic/reporting changes required for Section 10 completion.
