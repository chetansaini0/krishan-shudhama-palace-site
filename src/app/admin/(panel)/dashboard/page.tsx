"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    rooms: number;
    bookings: number;
    confirmed: number;
    pendingInquiries: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <Container className="py-12">
      <h1 className="font-serif text-3xl text-maroon">Operations overview</h1>
      <p className="mt-2 max-w-2xl text-sm text-black-soft/75">
        Monitor direct bookings, banquet inquiries, and fulfillment — extend this hub with pricing rules,
        housekeeping boards, and CRM exports when you connect analytics.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active rooms" value={stats?.rooms ?? "—"} />
        <Stat label="Total bookings" value={stats?.bookings ?? "—"} />
        <Stat label="Confirmed stays" value={stats?.confirmed ?? "—"} />
        <Stat label="New event leads" value={stats?.pendingInquiries ?? "—"} />
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/bookings"
          className="rounded-sm border border-gold/25 bg-white p-8 shadow-sm transition hover:border-gold"
        >
          <p className="text-xs uppercase tracking-widest text-gold">Manage</p>
          <p className="mt-2 font-serif text-xl text-maroon">Bookings calendar</p>
          <p className="mt-2 text-sm text-black-soft/70">
            Confirm, cancel, or reconcile Razorpay settlements against folios.
          </p>
        </Link>
        <Link
          href="/admin/inquiries"
          className="rounded-sm border border-gold/25 bg-white p-8 shadow-sm transition hover:border-gold"
        >
          <p className="text-xs uppercase tracking-widest text-gold">Pipeline</p>
          <p className="mt-2 font-serif text-xl text-maroon">Banquet inquiries</p>
          <p className="mt-2 text-sm text-black-soft/70">
            Attach quotes, notes, and outcome tracking for weddings & corporate events.
          </p>
        </Link>
        <Link
          href="/admin/rooms"
          className="rounded-sm border border-gold/25 bg-white p-8 shadow-sm transition hover:border-gold"
        >
          <p className="text-xs uppercase tracking-widest text-gold">Inventory</p>
          <p className="mt-2 font-serif text-xl text-maroon">Rooms & rates</p>
          <p className="mt-2 text-sm text-black-soft/70">
            Edit suites, weekday/weekend multipliers, imagery, and activation — synced to the marketing site.
          </p>
        </Link>
      </div>
    </Container>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-gold/20 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-gold">{label}</p>
      <p className="mt-3 font-serif text-4xl text-maroon">{value}</p>
    </div>
  );
}
