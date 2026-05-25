# Security Status (Latest Check)

## Runtime Protections Verified

- Security headers active on `/`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Cross-Origin-Opener-Policy: same-origin`
  - CSP enabled with Razorpay + Google Maps allowances.

- CSRF origin enforcement active on cookie-auth mutation endpoints:
  - `POST /api/admin/login` blocks foreign `Origin` with `403`.
  - `POST /api/admin/logout` blocks foreign `Origin` with `403`.
  - Admin mutate routes (`rooms`, `bookings`, `inquiries`) block foreign `Origin`.

- Rate limiting active and verified:
  - Repeated `POST /api/admin/login` attempts produced `429` after threshold.
  - Limits also enabled on booking, availability, inquiry, newsletter, and Razorpay endpoints.

- SEO security surfaces:
  - `/robots.txt` is live.
  - `/sitemap.xml` is live.

## Dependency Audit Snapshot (`npm audit --omit=dev`)

- Remaining vulnerabilities: **5 total**
  - **3 high**, **2 moderate**
- High severity currently tied mainly to Prisma CLI dependency chain (`@prisma/config` / `effect`) and can require version strategy updates from upstream.
- Next.js was upgraded from `15.5.15` to `15.5.18` to reduce known framework advisories.

## Residual Risks / Next Hardening Steps

1. Add CAPTCHA (Cloudflare Turnstile or reCAPTCHA) on public forms to reduce bot abuse.
2. Move rate limiting to shared external store (Redis) for multi-instance deployments.
3. Add SIEM-friendly structured security logs + alerting.
4. Add webhook signature replay protection and idempotency keys for payment callbacks.
5. Complete migration plan to PostgreSQL + Prisma runtime usage (currently foundation/scaffold added).
