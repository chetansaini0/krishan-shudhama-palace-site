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
  paymentStatus?: string;
  razorpayPaymentId?: string;
  refundId?: string;
};

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setRows(data.bookings ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: Row["status"]) {
    setError(null);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    void load();
  }

  async function refundBooking(row: Row) {
    if (
      !window.confirm(
        `Refund ₹${row.totalAmount.toLocaleString("en-IN")} to ${row.guestName} and cancel this booking?`,
      )
    ) {
      return;
    }
    setBusyId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${row.id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin refund from dashboard" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Refund failed",
        );
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refund failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Container className="py-12">
      <h1 className="font-serif text-3xl text-maroon">Bookings</h1>
      <p className="mt-2 text-sm text-black-soft/70">
        Confirm, cancel, or refund captured Razorpay payments from here.
      </p>
      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-8 overflow-x-auto rounded-sm border border-gold/20 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gold/15 bg-cream text-xs uppercase tracking-wider text-maroon">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Stay</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-black-soft/60">
                  No bookings yet — complete a paid test reservation.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const canRefund =
                  r.paymentStatus === "captured" && Boolean(r.razorpayPaymentId);
                return (
                  <tr key={r.id} className="border-b border-gold/10">
                    <td className="px-4 py-3">
                      <div className="font-medium text-maroon">{r.guestName}</div>
                      <div className="text-xs text-black-soft/60">{r.email}</div>
                      <div className="text-xs text-black-soft/60">{r.phone}</div>
                    </td>
                    <td className="px-4 py-3">{r.roomSlug}</td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(r.checkIn).toLocaleDateString()} →{" "}
                      {new Date(r.checkOut).toLocaleDateString()}
                      <div className="text-black-soft/55">{r.nights} nights</div>
                    </td>
                    <td className="px-4 py-3">
                      ₹{r.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.paymentStatus ?? "unpaid"}
                      {r.refundId ? (
                        <div className="text-black-soft/55">{r.refundId}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) => void updateStatus(r.id, e.target.value)}
                        className="rounded-sm border border-gold/30 px-2 py-1 text-xs"
                      >
                        {["pending", "confirmed", "cancelled", "failed"].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {canRefund ? (
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => void refundBooking(r)}
                          className="rounded-sm border border-maroon/30 px-2 py-1 text-xs text-maroon hover:bg-maroon/5 disabled:opacity-50"
                        >
                          {busyId === r.id ? "Refunding…" : "Refund"}
                        </button>
                      ) : r.paymentStatus === "refunded" ? (
                        <span className="text-xs text-black-soft/55">Refunded</span>
                      ) : (
                        <span className="text-xs text-black-soft/40">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
