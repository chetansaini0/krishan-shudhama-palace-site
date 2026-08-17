# Hotel Website Audit and Upgrade Report

## 1) Existing Features
- Modern Next.js App Router + TypeScript + Tailwind + Framer Motion.
- Public pages: home, rooms, room detail, booking, banquet, gallery, dining, location, contact.
- Admin flows: login, dashboard, bookings, inquiries, rooms.
- Booking engine baseline: room selection, date range, guest count, availability check, total pricing.
- Payments: Razorpay order creation + client checkout + signature verification.
- Notifications: Resend email + MSG91 SMS hooks after confirmation.
- Dynamic content: offers API, room APIs, admin CRUD APIs.

## 2) Missing / Partial / Weak Areas Found
- No global API rate limiting.
- Contact inquiries were not persisted in DB.
- Newsletter form had no backend integration.
- Banquet form payload mismatched the inquiry API contract (`preferredDate/notes` vs `eventDate/message`).
- SEO infra incomplete: no sitemap or robots routes.
- Security headers were not configured centrally.
- Structured data was minimal and lacked richer fields.
- No explicit production-level anti-abuse controls for payment endpoints.
- Cross-origin dev warning present for LAN testing.

## 3) Implemented in This Upgrade

### Security + API Hardening
- Added reusable request IP helper: `src/lib/request.ts`
- Added reusable in-memory rate limiter: `src/lib/rate-limit.ts`
- Applied rate limits to:
  - `POST /api/admin/login`
  - `POST /api/availability`
  - `POST /api/bookings`
  - `POST /api/inquiries/contact`
  - `POST /api/inquiries/event`
  - `POST /api/razorpay/create-order`
  - `POST /api/razorpay/verify`
  - `POST /api/newsletter`

### Data Persistence
- Added contact inquiry model:
  - `src/models/ContactInquiry.ts`
- Updated contact inquiry API to persist records when DB is configured:
  - `src/app/api/inquiries/contact/route.ts`

### Newsletter System
- Added newsletter subscriber model:
  - `src/models/NewsletterSubscriber.ts`
- Added newsletter subscribe API:
  - `src/app/api/newsletter/route.ts`
- Wired footer newsletter form to API with success/error state:
  - `src/components/layout/Footer.tsx`

### Banquet Inquiry Reliability
- Fixed API parsing to accept both old + new frontend payload names:
  - `eventDate` or `preferredDate`
  - `message` or `notes`
- File: `src/app/api/inquiries/event/route.ts`

### SEO Upgrades
- Added dynamic `robots.txt` route:
  - `src/app/robots.ts`
- Added dynamic sitemap route including room detail URLs:
  - `src/app/sitemap.ts`
- Enhanced schema.org Hotel JSON-LD:
  - Added `image`, `sameAs`, `checkinTime`, `checkoutTime`, `priceRange`
  - File: `src/components/seo/JsonLd.tsx`
- Enhanced metadata in root layout:
  - Canonical alternates, richer OpenGraph, Twitter card image
  - File: `src/app/layout.tsx`

### Security Headers and Dev LAN DX
- Added secure headers in `next.config.ts`:
  - `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
    `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Content-Security-Policy`
- Added `allowedDevOrigins` for LAN development warning reduction.

## 4) Remaining Strategic Gaps (Recommended Next Phase)
- Database modernization target (requested): PostgreSQL + Prisma migration.
- Keep Razorpay as the sole payment provider (no Stripe).
- Coupon + seasonal pricing engine with admin controls.
- Reviews moderation workflow + anti-spam controls.
- Real analytics dashboards (occupancy, ADR, RevPAR, revenue trends).
- Role-based admin permissions and audit logs.
- reCAPTCHA / Turnstile on public forms.
- Cloudinary media pipeline and signed uploads.
- CI/CD checks + automated test coverage + preview deploy policies.

## 5) Production Deployment Checklist
- Set all required env vars:
  - `MONGODB_URI`, `JWT_SECRET`
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (avoid plain password in prod)
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
  - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
  - `MSG91_AUTH_KEY`, `MSG91_FLOW_TEMPLATE_ID`
  - `NEXT_PUBLIC_SITE_URL`
- Confirm CSP allowances for final domains/apis.
- Enable HTTPS and HSTS at CDN/edge.
- Add external uptime + error monitoring.
