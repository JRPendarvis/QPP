# QuiltPlannerPro — Backend (short README)

This README covers quick developer steps to run the backend locally and the new Feedback endpoints (feature requests + voting).

Prerequisites
- Node.js (compatible with project package.json)
- A PostgreSQL database configured via `DATABASE_URL` in your environment
- `npx prisma` available via the project devDependencies

Apply database migrations

Run the Prisma migration to add the feedback tables (already created during development):

```powershell
cd c:\QPP\QPP\backend
npx prisma migrate dev --name add-feedback
```

Start the backend

```powershell
# from backend folder
npm install
npm run dev
```

- Authentication & Cookies
- The backend now issues an `httpOnly` cookie named `token` on login/register. API requests from the frontend should be sent with credentials (cookies) so the server can authenticate the user.

API: Feedback endpoints
- `GET /api/feedback` — list suggestions (returns whether the current authenticated user has voted if a token is supplied)
- `POST /api/feedback` — create a new suggestion (requires authentication)
- `POST /api/feedback/:id/vote` — toggle upvote for a suggestion (requires authentication)

Frontend route
- A simple UI is available at `/dashboard/feedback` in the frontend. The frontend uses the existing `api` client which reads an auth token from `localStorage`.

- Votes are stored in `feedback_votes` and a `votesCount` integer on the `feedback` table is updated in a transaction.
- If you run into Prisma client issues, regenerate the client:

Notes
- Votes are stored in `feedback_votes` and a `votesCount` integer on the `feedback` table is updated in a transaction.
- Auth now uses an `httpOnly` cookie named `token`. Frontend requests must include credentials (cookies). Consider adding CSRF protections when using cookies (SameSite, CSRF tokens, or double-submit cookie). The cookie is set with `SameSite=Lax` by default.
- If you run into Prisma client issues, regenerate the client:
- Votes are stored in `feedback_votes` and a `votesCount` integer on the `feedback` table is updated in a transaction.
- If you run into Prisma client issues, regenerate the client:

```powershell
npx prisma generate
```

If you'd like a longer README (contributing, env examples, docker, or CI steps), I can add that next.
