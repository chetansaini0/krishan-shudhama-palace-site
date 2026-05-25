"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";

type Row = {
  id: string;
  roomSlug: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  status: string;
};

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setRows(data.bookings ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: Row["status"]) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    void load();
  }

  return (
    <Container className="py-12">
      <h1 className="font-serif text-3xl text-maroon">Bookings</h1>
      <p className="mt-2 text-sm text-black-soft/70">
        Live inventory control requires MongoDB + confirmed overlaps from guest checkout.
      </p>
      <div className="mt-8 overflow-x-auto rounded-sm border border-gold/20 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gold/15 bg-cream text-xs uppercase tracking-wider text-maroon">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Stay</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-black-soft/60">
                  No bookings yet — connect MongoDB and complete a test reservation.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-gold/10">
                  <td className="px-4 py-3">
                    <div className="font-medium text-maroon">{r.guestName}</div>
                    <div className="text-xs text-black-soft/60">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">{r.roomSlug}</td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(r.checkIn).toLocaleDateString()} →{" "}
                    {new Date(r.checkOut).toLocaleDateString()}
                    <div className="text-black-soft/55">{r.nights} nights</div>
                  </td>
                  <td className="px-4 py-3">₹{r.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => void updateStatus(r.id, e.target.value)}
                      className="rounded-sm border border-gold/30 px-2 py-1 text-xs"
                    >
                      {["pending", "confirmed", "cancelled", "failed"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
