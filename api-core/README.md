# api-core — Reusable PHP API Security Scaffold

A **drop-in, copy-pasteable hardened backend layer** for any PHP + MySQL REST
API on Apache/cPanel shared hosting. Extract the `api-core/` folder into any
project and wire your endpoints to it.

It implements every hard requirement you asked for, production-first.

---

## What it covers

| # | Requirement | Where implemented |
|---|-------------|-------------------|
| 1 | Users are strictly scoped to their own UUID | `auth.php` (`requireUser`, `scopedRow/List/Delete`) |
| 2 | Password reset links expire in **30 minutes**, single-use | `password_reset.php` |
| 3 | Standard SQL injection & XSS procedures | `database.php` (prepared stmts + guard), `security.php` (sanitize + escape) |
| 4 | API serves **only** requests from own domain | `bootstrap.php` (strict CORS, rejects all others) |
| 5 | Error handling + rate limiting | `bootstrap.php` (global handler), `rate_limit.php` |
| 6 | Indexing on high-traffic fields | `security_schema.sql` (+ guidance) |
| 7 | **Blue-green** strategy with crash failback | `deploy.php`, `deploy-blue-green.sh`, `/health` probe |
| 8 | Logging + alerts for critical failure | `bootstrap.php` (`apiCoreLog`, webhook alerts) |

---

## Files

| File | Purpose |
|------|---------|
| `bootstrap.php` | Entry point: env loading, **own-domain CORS**, security headers, global error handler, JSON helpers, logging + **critical webhook alerts** |
| `database.php` | PDO factory (`EMULATE_PREPARES=false`), prepared query helpers, **SQL injection guard** |
| `security.php` | **XSS** sanitize/escape, input validation, **CSRF** issue/validate |
| `auth.php` | Dependency-free **HS256 JWT**, **per-UUID scoping**, device-bound tokens, role gate |
| `password_reset.php` | **30-minute, single-use** reset links (stored hashed) |
| `rate_limit.php` | MySQL-backed sliding-window limiter + brute-force lockout |
| `deploy.php` | Health payload + blue-green failback latch |
| `deploy-blue-green.sh` | Automated blue/green deploy script with automatic rollback |
| `security_schema.sql` | `users`(UUID), `auth_sessions`, `password_reset_tokens`, `rate_limit`, `auth_failures` + index policy |
| `example_endpoint.php` | Complete template showing all modules wired together |
| `.htaccess` | Apache hardening (block `.env`, logs, directory listing, malicious inputs) |
| `.env.example` | Environment template |

---

## Quick start

```bash
# 1. Copy the folder into your project
cp -r api-core /path/to/your-project/api

# 2. Configure
cp api-core/.env.example .env
# edit .env — set ALLOWED_ORIGINS, JWT_SECRET, DB_*, etc.

# 3. Create the security tables (once)
#    import api-core/security_schema.sql via phpMyAdmin or:
mysql -u user -p yourdb < api-core/security_schema.sql

# 4. Require bootstrap at the top of every endpoint
```
Your endpoint:
```php
require_once __DIR__ . '/bootstrap.php';   // FIRST line, no whitespace before
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/rate_limit.php';

checkRateLimit('orders');
$auth = requireUser();                 // $auth['uuid'] = caller's UUID
$rows = scopedList($auth['uuid'], 'orders');  // only THEIR rows
apiResponse(['status' => 'success', 'data' => $rows]);
```

---

## How the key requirements are enforced

### 1. Strict per-user (UUID) scoping
- Every protected endpoint calls `requireUser()` which returns the caller's UUID from the JWT `sub` claim.
- Reading/writing user data **must** go through `scopedRow()`, `scopedList()`, `scopedDelete()` — each forces `WHERE user_uuid = <auth UUID>`, so a user can never touch another user's rows.
- JWT is **device-bound**: token validated against a fingerprint of the UA + IP (`sid` claim), so a stolen token can't be replayed from another machine.
- Tokens are revocable via `auth_sessions` (revoked on password reset / logout).

### 2. Password reset — 30-minute + single-use
- `generateResetToken($uuid)` → stores **SHA-256 hash** (never the raw token) with `expires_at = now + PASSWORD_RESET_TTL_SECONDS` (default **1800s = 30 min**).
- `consumeResetToken()` marks it `used = 1` immediately → each link works exactly once.
- Token revoked server-side on any expiry sweep.

### 3. SQL injection & XSS
- **SQL injection:** all queries via PDO `EMULATE_PREPARES=false` (native prepared statements) + `?` placeholders. A `sqlInjectionGuard()` regex rejects stacked DDL, comments, `UNION SELECT`, `SLEEP`/`BENCHMARK`, `LOAD_FILE`, etc. as defense-in-depth.
- **XSS:** all input passes `sanitizeInput()` (strips `<script>`, `onerror=`, `javascript:`, etc.) and all output you later render to HTML must pass `htmlEscape()` at output time. The API also sets a locked-down `Content-Security-Policy`.

### 4. Own-domain CORS
`bootstrap.php` compares the request `Origin` (or `Referer`) against the exact `ALLOWED_ORIGINS` list. `*` is never accepted. Any request from an unlisted origin → **403**. Preflight `OPTIONS` is handled with the correct headers.

### 5. Error handling & rate limiting
- Global `set_error_handler` / `set_exception_handler` return structured JSON (no stack traces in production) and log every failure.
- `checkRateLimit('scope')` → sliding window per IP+scope; auth endpoints use a stricter `checkAuthRateLimit()`; `bruteForceBackoff()` adds per-account lockout.

### 6. Indexing
`security_schema.sql` indexes every high-traffic lookup column:
- `users.email`, `users.role`
- `auth_sessions.user_uuid`, `.expires_at`, `.jti` (unique)
- `password_reset_tokens.token_hash` (unique), `.user_uuid`, `.expires_at`
- `rate_limit.(bucket,scope)` (unique), `.window_start`
- `auth_failures.bucket` (unique), `.last_fail`

Plus documented guidance for adding indexes to your existing business tables.

### 7. Blue-green crash strategy
`deploy-blue-green.sh` rolls a new build into the **green** slot, switches the active symlink, warms up, then **probes `/health`** (from `deploy.php`). If green is unhealthy → **automatic failback** to blue and a `DEPLOY_FAILED_FAILEDBACK` result. The PHP `deployFailback()` latch records state so runtime code can keep routing to blue.

### 8. Logging + critical alerts
- `apiCoreLog(level, message, context)` → daily rotating log files in `storage/logs/`.
- Severity threshold via `LOG_LEVEL`.
- On **critical** entries, a signed (HMAC-SHA256) JSON alert is POSTed to `ALERT_WEBHOOK_URL` (Slack/Discord/Teams). Secrets are never logged.

---

## Environment variables

See `.env.example`. Critical ones:

| Variable | Notes |
|----------|-------|
| `ALLOWED_ORIGINS` | Comma-separated exact origins (no `*`) |
| `JWT_SECRET` | `php -r "echo bin2hex(random_bytes(32));"` — min 32 chars |
| `PASSWORD_RESET_TTL_SECONDS` | default `1800` (30 min) |
| `RATE_LIMIT_*` | window/max/global/auth |
| `ALERT_WEBHOOK_URL` | POST target for critical alerts |
| `APP_DEBUG` | always `false` in production |

---

## Security checklist before going live

- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] `ALLOWED_ORIGINS` set to your real domain(s), never `*`
- [ ] `JWT_SECRET` generated (≥32 chars) and only in `.env` (never committed)
- [ ] `.env` and `storage/logs/` blocked from web access (`.htaccess` handles this)
- [ ] All your endpoints use prepared statements + `scoped*` helpers
- [ ] HTTPS enforced (blue-green script + `.htaccess` commented rule)
- [ ] `security_schema.sql` imported
- [ ] Webhook alert URL configured
