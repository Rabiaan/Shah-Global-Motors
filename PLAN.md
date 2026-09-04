# Deployment Plan — Shahglobal Exotics (Full-Stack, cPanel Root Domain + Vercel Demo)

This is the complete, ordered plan for taking the project from its current state to a
working production deployment on **cPanel (root domain, WordPress-free, PHP + MySQL)**,
while keeping a **Vercel** link for client previews.

---

## IMPORTANT: Current state (read this first)

The React frontend is **100% client-side**. All data (enquiries, test drives, sell
requests, admin session, vehicle inventory) lives in `localStorage`. The PHP API in
`public/api/` exists but the frontend **never calls it**. There are also **two
conflicting auth systems** (`admin_users` table with INT ids vs. the `users` UUID +
JWT system in `api-core/`).

Consequences:
- Uploading "files + DB" alone gives you a **working demo site** (renders, forms store
  locally) but connected forms/leads **do NOT reach the MySQL database**.
- For a true full-stack deployment you must first *wire the frontend to the backend*.

Two tracks are documented below:
- **Track A — Vercel demo link (quick, for the client now):** ship the static site
  safely to Vercel. No backend wiring.
- **Track B — Full-stack cPanel (the real goal):** development work + cPanel steps.

---

## TRACK A — Get a Vercel demo link now

Goal: a stable URL you can send the client showing the site. Backend data is not
required for this — the seeded demo data renders from frontend defaults.

### A1. Prevent PHP source leakage (security)
The `.php` files under `public/api/` ship to Vercel as **raw downloadable source code**,
exposing DB defaults and admin fallback credentials. Fix by adding a `.vercelignore`:

```
public/api/
api-core/
*.sql
```

Verify after deploy: `https://<your-app>.vercel.app/api/config.php` must return 404,
not the PHP source.

### A2. Push code to GitHub
```bash
git add -A
git commit -m "feat: add reusable api-core security scaffold + deployment plan"
git push -u origin main
```

### A3. Create the Vercel project
1. Vercel → **New Project** → Import the GitHub repo `Rabiaan/Shah-Global-Motors`
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables: none required (frontend is static)
6. Deploy → you now have a `https://<app>.vercel.app` link

> `vercel.json` is already present with SPA rewrites so `/new-cars`, `/car-details`,
> etc. load correctly on refresh.

### A4. Send client the link
Use the Vercel production URL. Optionally add a custom domain in Vercel later.

---

## TRACK B — Full-stack cPanel deployment (root domain)

### B1. Decisions to lock in (recommendations in bold)

| # | Decision | Recommendation |
|---|----------|----------------|
| D1 | Which auth system to keep | **Consolidate onto `api-core` (`users` UUID + JWT)**. Gives JWT, per-UUID scoping, 30-min password reset, rate limiting. Retire `admin_users` as primary; migrate/seed the admin into `users`. |
| D2 | Seed data source of truth | **Seed the 6 vehicles + sample leads into MySQL**; frontend reads from API, falls back to local seed only if unreachable. |
| D3 | Offline / API-down behavior | **Keep `localStorage` as a cache + fallback** so the site never fully breaks; API is the source of truth when reachable. |
| D4 | Admin account | **Seed `admin` into `users`** with the existing password, role `admin`. |

### B2. Development work (in order) — do these BEFORE upload

1. **Add an API client layer** (`src/lib/api.ts`):
   - Base URL constant (e.g. `VITE_API_URL` → `https://yourdomain.com/api`)
   - `apiFetch(path, {method, token, body})` wrapper with `Content-Type: application/json`
   - Auth token stored in `localStorage`; attached as `Authorization: Bearer <jwt>`

2. **Create api-core endpoint files** under `public/api/` (thin HTTP handlers that call
   the api-core libraries):
   - `register.php` — create user → return JWT
   - `login.php` — verify password → JWT (+ rate limit + brute-force lockout)
   - `logout.php` — revoke session (`DELETE FROM auth_sessions WHERE jti=...`)
   - `password-reset.php` — `POST {action:request}` and `POST {action:reset}`
   - `password-reset-confirm.php` — page/endpoint for the emailed 30-min link
   - `session.php` — `GET` returns CSRF token + current user

3. **Rewrite `AdminLoginPage.tsx`**: replace hardcoded creds (lines 43-45) + fake token
   (`'tok_' + Date.now()`, line 53) with a `POST /api/login.php` call.

4. **Rewrite backend CRUD** in `vehicles.php`, `enquiries.php`, `test-drives.php`,
   `sell-requests.php` to use `requireUser()` + `scoped*` helpers (per-UUID scoping).

5. **Wire frontend persistence** in `DealershipContext.tsx`:
   - `submitCustomerEnquiry` / `addEnquiry` → POST `/api/enquiries.php`, keep local cache
   - `submitTestDriveRequest` / `addTestDrive` → POST `/api/test-drives.php`
   - `addSellRequest` → POST `/api/sell-requests.php`
   - vehicles CRUD in `AdminDashboard.tsx` → `/api/vehicles.php`

6. **Migrate the seed data** into SQL (`seed.sql`) so the DB is the source of truth.

### B3. cPanel steps (root domain)

#### 1. Database
- cPanel → **MySQL® Databases**
  - Create database, e.g. `sgm_db`
  - Create user, e.g. `sgm_user` + strong password
  - **Add user to database** with **ALL PRIVILEGES**
- cPanel → **phpMyAdmin** → select `sgm_db` → **Import**:
  1. `public/api/schema.sql` (base tables)
  2. `api-core/security_schema.sql` (users, auth_sessions, password_reset_tokens, rate_limit, auth_failures)
  3. `seed.sql` (the seed data) *(created in B2.6)*

#### 2. Files (root domain → `public_html/`)
```
public_html/
  index.html
  assets/                ← Vite build output (npm run build → dist/*)
  api/
    *.php                ← backend endpoints (login.php, enquiries.php, ...)
    api-core/            ← security modules (bootstrap, auth, database, ...)
  .htaccess
```

Copy steps:
- Build: `npm run build`, upload `dist/` contents into `public_html/`
- Upload `public/api/` → `public_html/api/`

#### 3. `.env` placement (critical)
`public/api/config.php` resolves the env file via `dirname(__DIR__, 2) . '/.env'`.
With the API at `public_html/api/config.php`, that resolves to the **cPanel account
root** (`/home/<user>/`), i.e. **one level above `public_html`**.

- Create `/home/<user>/.env` with:
  ```
  ALLOWED_ORIGINS="https://yourdomain.com"
  JWT_SECRET="<generated: php -r 'echo bin2hex(random_bytes(32));'>"
  DB_HOST=localhost
  DB_NAME=sgm_db
  DB_USER=sgm_user
  DB_PASS="<your strong password>"
  APP_ENV=production
  APP_DEBUG=false
  ALERT_WEBHOOK_URL="<slack/discord/email webhook>"
  ```

> Confirm on your server that PHP can read `/home/<user>/.env` (correct permissions:
> `600`, owner = the cPanel user). If your host blocks reading outside `public_html`,
> adjust `config.php` to load `.env` from a web-inaccessible folder instead.

#### 4. Apache
- Ensure `public_html/api/.htaccess` and `api-core/.htaccess` are uploaded (they block
  `.env`, logs, and directory listing, and reject malicious query strings).
- Force HTTPS via `.htaccess` at `public_html/` (rule provided in `api-core/.htaccess`,
  commented — uncomment for production).

### B4. Post-deploy verification checklist
- [ ] `GET https://yourdomain.com/api/health?health=1` → `200 {"status":"ok"}`
- [ ] `POST /api/login.php` with admin creds → returns JWT
- [ ] Submit a test-drive/enquiry from the site → row appears in phpMyAdmin
- [ ] Hammer `/api/login.php` → 429 after limit (rate limiting works)
- [ ] Open a password-reset link after 30 min → rejected as expired
- [ ] Confirm `/home/<user>/.env`, `api-core/`, and `*.sql` are NOT web-accessible
- [ ] Confirm unauthenticated user cannot read another user's rows (scoping)

### B5. Blue-green (optional, for higher uptime)
Use `api-core/deploy-blue-green.sh` + `/api/health?health=1` if you later want two
live releases with automatic crash failback. Not required for initial launch.

---

## Rollback
- **Vercel:** every push to `main` auto-deploys; previous deployments remain in the
  Vercel dashboard to redeploy instantly.
- **cPanel:** keep a backup of the prior `public_html` and database before changes; use
  phpMyAdmin **Export** for a DB backup prior to running migrations.

---

## Files touched by Track B (for the implementer)
| Area | Files |
|------|-------|
| API client | `src/lib/api.ts` (new) |
| New endpoints | `public/api/login.php`, `register.php`, `logout.php`, `password-reset.php`, `session.php` (new) |
| Rework endpoints | `public/api/vehicles.php`, `enquiries.php`, `test-drives.php`, `sell-requests.php` |
| Frontend login | `src/components/AdminLoginPage.tsx` |
| Frontend context | `src/context/DealershipContext.tsx` |
| Frontend admin | `src/components/AdminDashboard.tsx` |
| Seed data | `seed.sql` (new) |
| Build config | `.vercelignore` (new), `.env` (server) |
