"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";

type Row = {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: number;
  message: string;
  status: string;
  quotedAmount?: number;
  adminNotes?: string;
};

export default function AdminInquiriesPage() {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const res = await fetch("/api/admin/inquiries");
    const data = await res.json();
    setRows(data.inquiries ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function patch(id: string, body: Partial<Pick<Row, "status" | "adminNotes" | "quotedAmount">>) {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    void load();
  }

  return (
    <Container className="py-12">
      <h1 className="font-serif text-3xl text-maroon">Banquet & event inquiries</h1>
      <p className="mt-2 text-sm text-black-soft/70">
        Track pipeline stages, attach commercial notes, and export to finance when proposals convert.
      </p>
      <div className="mt-8 space-y-6">
        {rows.length === 0 ? (
          <p className="rounded-sm border border-dashed border-gold/30 bg-white p-8 text-center text-sm text-black-soft/60">
            No inquiries yet — submissions appear here once MongoDB records event forms.
          </p>
        ) : (
          rows.map((r) => (
            <article
              key={r.id}
              className="rounded-sm border border-gold/20 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl text-maroon">{r.name}</h2>
                  <p className="text-xs text-black-soft/60">
                    {r.email} · {r.phone}
                  </p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => void patch(r.id, { status: e.target.value })}
                  className="rounded-sm border border-gold/30 px-3 py-1 text-xs"
                >
                  {["new", "quoted", "won", "lost"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-4 text-sm text-maroon">
                {r.eventType} · {r.guestCount} guests
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black-soft/80">{r.message}</p>
              <label className="mt-4 block text-xs font-medium text-maroon">
                Quote amount (INR)
                <input
                  type="number"
                  defaultValue={r.quotedAmount ?? ""}
                  onBlur={(e) =>
                    void patch(r.id, {
                      quotedAmount: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full max-w-xs rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="mt-3 block text-xs font-medium text-maroon">
                Internal notes
                <textarea
                  defaultValue={r.adminNotes ?? ""}
                  onBlur={(e) => void patch(r.id, { adminNotes: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
            </article>
          ))
        )}
      </div>
    </Container>
  );
}
