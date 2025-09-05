# Recap: i18n + Supabase auth/security changes

This document summarizes what we investigated and changed during the session:
- i18n (locale) middleware behavior that interfered with API routes
- Supabase SSR auth usage and session handling
- Security issues we found (client-side destructive operations) and the fixes we implemented
- Tests and how to validate
- Recommended next steps and follow‑up tasks for maintainers

--- 

## 1) Why we started
We reviewed the app to ensure:
- The i18n middleware (next-intl) does not redirect or intercept API calls.
- Supabase authentication is used correctly for SSR via `@supabase/ssr` utilities.
- No destructive operations (delete/update) are executed with only client-side (browser) enforcement.
- Authorization is enforced server-side (not only in UI).

This work is intended to make the app safer and easier for contributors to reason about.

---

## 2) i18n / middleware changes (what we found & did)
Problem
- The i18n middleware was matching all routes and sometimes redirected API requests (e.g. POST /api/projects/delete), which produced 404s or unexpected redirects for API calls that should reach route handlers.

What we changed
- Excluded `api` routes from the intl middleware matcher so API routes are not intercepted:
  - Updated `middleware.ts` matcher to exclude `api`:
    - Before: matcher prefixed with '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    - After: matcher excludes `api` too:
      '/((?!_next/static|_next/image|favicon.ico|api|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'

Why
- API routes must be reachable by client fetch requests and must not be redirected by the locale middleware. This keeps i18n redirects for normal pages while allowing API endpoints to work.

How to test
- Open DevTools → Network, trigger an API request (POST /api/projects/delete) and confirm request reaches the route (no redirect), and response code is the route response (200/401/403/404/500 depending on auth/data).

---

## 3) Supabase SSR and session handling (architecture)
Files and utilities
- utils/supabase/client.ts — createBrowserClient() — used by client components
- utils/supabase/server.ts — createServerClient() — used by server components, server actions and route handlers
- utils/supabase/middleware.ts — session refresh helper used by root `middleware.ts`
- middleware.ts uses next-intl then updateSession(request) for Supabase session refresh

Key points:
- Use createServerClient() in server contexts and createBrowserClient() in client contexts.
- Keep `createServerClient()` → immediately call `supabase.auth.getUser()` in middleware as recommended by @supabase/ssr docs.
- Keep env keys secure: never expose service_role to the browser. Only NEXT_PUBLIC_* anon url/key are allowed in client contexts.

---

## 4) Security findings (what was risky)
Primary risk
- Client components were performing destructive DB operations (update/delete) directly with the browser Supabase client (createBrowserClient). Examples:
  - Deleting a client from the Clients page, including multiple writes and deletes done from client-side code.
  - Deleting and archiving projects directly in Projects page code.

Why this is a problem
- Client JS can be tampered with and relies on the anon key and PostgREST permissions.
- If RLS policies are incomplete or misconfigured, a malicious user could perform unauthorized deletes/updates.
- Business logic must be enforced server-side or by strict DB policies.

Other findings
- Middleware redirecting API calls (fixed)
- Missing database atomic RPCs for cascading deletes (we call RPC when available, otherwise fallback)
- Need to verify RLS policies and secret management

---

## 5) Concrete changes made (files created/modified)
I implemented the minimal secure server-side endpoints and updated clients to call them:

- New server routes (request-scoped, verify auth and membership):
  - `app/api/clients/delete/route.ts` — server-side client delete (authorization & RPC fallback)
  - `app/api/projects/delete/route.ts` — server-side project delete (company membership authorization; RPC fallback)
  - `app/api/projects/archive/route.ts` — server-side archive endpoint (company membership authorization)

- Client updates (switched out browser direct deletes/updates with fetch → server endpoint):
  - `app/[locale]/dashboard/clients/page.tsx` — confirmDeleteClient now POSTs to `/api/clients/delete`
  - `app/[locale]/dashboard/projects/page.tsx` — confirmDeleteProject now POSTs to `/api/projects/delete`; handleArchiveClick POSTs to `/api/projects/archive`; fixed base URL usage

- Middleware
  - `middleware.ts` — updated matcher to exclude `api` paths so locale middleware does not intercept API calls

- Authorization logic
  - Project authorization changed from a non-existent `owner_id` approach to company membership check:
    - The routes now verify that the authenticated user's company association (`user_companies`) matches the project's `company_id`.

Notes:
- Endpoints call RPCs `delete_project_and_children` and `delete_client_and_children` if present (prefer DB atomic operations). If RPC missing, fallback to sequenced safe deletes and updates.
- All server routes use `createServerClient()` to use the request cookie storage and `supabase.auth.getUser()`.

---

## 6) How to test locally (quick checklist)
1. Start dev server:
   - npm run dev
2. Sign in as an admin (or the user associated with the project/company).
3. On Projects page:
   - Attempt Archive → Network tab should show POST `/api/projects/archive` → expect HTTP 200 with `{"success": true}` and project status changed.
   - Attempt Delete → Network tab should show POST `/api/projects/delete` → expect HTTP 200 with `{"success": true}` and project removed.
4. On Clients page:
   - Attempt Delete → POST `/api/clients/delete` → HTTP 200 with `{"success": true}`; verify DB changes.
5. Verify unauthorized scenarios:
   - Sign out (or use a non-associated user) → the endpoints should return 401 or 403.

View request/response
- DevTools → Network → find the POST request → Header → Payload to confirm the JSON sent → Response tab shows server JSON.

---

## 7) Remaining items & recommended next steps (for contributors)
Priority (must / should / nice-to-have):

- [ ] MUST: Create DB-level RPCs for atomic deletes
  - Implement `delete_project_and_children(p_project_id uuid)` and `delete_client_and_children(p_client_id uuid)` as single-transaction PL/pgSQL functions that enforce DB integrity and do cascades safely.

- [ ] MUST: Audit and enforce Row Level Security (RLS)
  - Ensure `projects_new`, `tasks`, `documents`, `communications`, and other sensitive tables have RLS policies (scripts/rls-*.sql exist and should be reviewed).
  - Policies should map to company membership (via `get_user_company_ids()` or `user_companies`) and roles (admin/manager/employee).

- [ ] SHOULD: Secrets & environment audit
  - Ensure service_role keys are never in NEXT_PUBLIC environment variables or client code.
  - Verify all deployment secrets are stored in CI/hosting secrets, not in repo or public env.

- [ ] SHOULD: Add server-side validation (zod)
  - Add zod schemas to the new endpoints to validate request bodies and return 400s for malformed requests.

- [ ] SHOULD: Rate limiting & brute-force protections
  - Confirm Supabase Auth project protections; consider middleware rate limiting for sign-in routes.

- [ ] SHOULD: Convert other client-side destructive flows
  - Use `search` results to find other `.from(...).delete()` / `.update()` usage in client files and migrate them to server endpoints.

- [ ] NICE: Add integration tests
  - Automated tests for auth flows, RLS, delete/archive server endpoints.
  - Manual QA checklist for token refresh, middleware cookie sync.

---

## 8) What the docs repo now contains (new/additional doc)
- `docs/auth-ssr.md` — existing (unchanged)
- `docs/onboarding.md` — existing (unchanged)
- `docs/review-supabase-i18n.md` — this file (recap + instructions + checklist)

Add this file to PRs so contributors can see the security rationale and next steps.

---

## 9) Example server endpoint (pattern)
This project now follows this secure pattern for destructive ops:

- Client (browser) -> fetch POST to `/api/...` (no supabase anon delete in UI)
- Server route:
  - createServerClient()
  - supabase.auth.getUser() → get authenticated user
  - check project existence → check company membership (user_companies)
  - call DB RPC (preferred) or sequenced fallback
  - return { success: true } or appropriate error + status

---

## 10) Where to go next
Pick one of the follow-ups and I will implement it and update docs:
- Create DB-level RPCs (atomic deletes) for projects and clients
- Audit and finalize RLS policies (update scripts/rls-*.sql)
- Add zod validation to endpoints and update docs
- Scan repository and deployment for exposed service_role keys

If you want me to proceed now, tell me which option to run and I'll implement it and update docs accordingly.
