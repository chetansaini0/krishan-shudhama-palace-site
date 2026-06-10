# Krishan Shudhama Palace — Web

> **Copyright © 2026 Krishan Shudhama Palace / Chetan Saini. All Rights Reserved.**  
> This repository is **proprietary**. You may view it on GitHub, but you may **not** copy, fork, modify, deploy, or use any part of this project without **written permission**. See [LICENSE](./LICENSE).

Premium hotel marketing + direct booking experience built with **Next.js 15** (App Router), **Tailwind CSS v4**, **MongoDB** (Mongoose), and **Razorpay** checkout.

## Quick start

```bash
cd site
cp .env.example .env.local
# Set at least MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Run on Android (same Wi-Fi)

```bash
npm run dev:network
```

Then open `http://<YOUR_PC_IP>:3000` on Android.  
If it does not open, allow Node.js in Windows Firewall (Private network).

## Features

- **Public site**: Home (hero video, booking widget, rooms, amenities, offers, testimonials, map), Rooms + detail, Banquet/events, Gallery, Location, Contact, Booking flow.
- **Commerce**: Date-based pricing with weekend uplift, overlap checks when MongoDB is connected, Razorpay order + signature verification.
- **Events**: Banquet inquiry API + admin pipeline (status, quote amount, notes).
- **Admin**: JWT cookie auth, bookings, event leads, **rooms CRUD** (MongoDB), stats.
- **Notifications**: After successful Razorpay verification, **Resend** email + **MSG91** Flow SMS (optional via env).
- **Branding**: Phone, address, maps, hero media, and banquet copy via `NEXT_PUBLIC_*` variables (rebuild after changes).
- **SEO**: Metadata + JSON-LD `Hotel` schema.

## Environment

See `.env.example`.

- Without `MONGODB_URI`, the public site uses **static room data**; admin room tools and persisted bookings need MongoDB.
- **Resend**: `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (verified domain).
- **MSG91**: `MSG91_AUTH_KEY` + `MSG91_FLOW_TEMPLATE_ID`. Template should expose **VAR1**–**VAR5** (guest name, room, stay dates, total INR, short ref) — see `src/lib/notifications.ts`.

## Production

- Set `NEXT_PUBLIC_SITE_URL` for canonical URLs.
- Use strong `JWT_SECRET`, bcrypt `ADMIN_PASSWORD_HASH`, and live Razorpay keys.
- Terminate TLS at your host (SSL).
- Configure `RAZORPAY_WEBHOOK_SECRET` and register `/api/razorpay/webhook` in Razorpay dashboard.
- Set `NODE_OPTIONS=--use-system-ca` in environments with strict certificate chains.
- Verify before deploy:
  - `npm run lint`
  - `npm run build`
  - `npm audit`
  - `npm audit --omit=dev`
- Vercel: define all required env vars in Production + Preview and redeploy after branding (`NEXT_PUBLIC_*`) updates.

### Deploy from GitHub (Vercel)

1. Import the GitHub repo into Vercel.
2. Set Root Directory to `site`.
3. Add all variables from `.env.example` in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to your final HTTPS domain.
5. (Optional multi-domain) set `ALLOWED_ORIGINS` as comma-separated HTTPS origins.
6. Deploy and verify booking/contact/newsletter APIs from mobile and desktop.

## Security & Quality Notes

- Public form APIs include rate limiting, same-origin checks, and honeypot filtering.
- Admin routes use JWT httpOnly cookies and middleware role checks.
- Global security headers and CSP are configured in `next.config.ts`.
- Dependency versions are pinned and audited regularly via Dependabot + CodeQL workflows.

## Stack

Next.js · React 19 · Tailwind 4 · Mongoose · jose (JWT) · Razorpay · Resend · MSG91 · Framer Motion · Lucide
