import { format } from "date-fns";
import { HOTEL } from "@/lib/constants";
import { listRoomNumberStatus } from "@/lib/availability";
import { getRooms } from "@/lib/rooms";

function normalizeIndiaMobile(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  if (d.length === 12 && d.startsWith("91")) return d;
  if (d.length === 11 && d.startsWith("0")) return `91${d.slice(1)}`;
  return d;
}

export type OwnerBookingAlert = {
  _id: { toString: () => string };
  guestName: string;
  email: string;
  phone: string;
  roomSlug: string;
  assignedRoomNumber?: string;
  guests: number;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalAmount: number;
};

function formatInr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Checkbox-style inventory snapshot for the guest's stay dates. */
export async function buildRoomAvailabilityChecklist(
  checkIn: Date,
  checkOut: Date,
  bookedRoomSlug: string,
  assignedRoomNumber?: string,
): Promise<string[]> {
  const rooms = await getRooms();
  const lines: string[] = [];

  for (const room of rooms) {
    if (room.comingSoon || room.inventory <= 0) {
      lines.push(`⬜ ${room.name} — Coming soon`);
      continue;
    }

    const numbers = room.roomNumbers ?? [];
    if (numbers.length === 0) {
      lines.push(`⬜ ${room.name} — ${room.inventory} units`);
      continue;
    }

    lines.push(`*${room.name}*`);
    const status = await listRoomNumberStatus(
      room.slug,
      numbers,
      checkIn,
      checkOut,
    );
    for (const item of status) {
      const thisStay =
        room.slug === bookedRoomSlug && item.number === assignedRoomNumber;
      if (item.booked) {
        lines.push(
          `✅ ${item.number} — BOOKED${thisStay ? " (this booking)" : ""}`,
        );
      } else {
        lines.push(`⬜ ${item.number} — AVAILABLE`);
      }
    }
  }

  return lines;
}

export async function formatOwnerBookingWhatsAppMessage(
  booking: OwnerBookingAlert,
): Promise<string> {
  const rooms = await getRooms();
  const roomName =
    rooms.find((r) => r.slug === booking.roomSlug)?.name ?? booking.roomSlug;
  const stayStart = format(booking.checkIn, "dd MMM yyyy");
  const stayEnd = format(booking.checkOut, "dd MMM yyyy");
  const checklist = await buildRoomAvailabilityChecklist(
    booking.checkIn,
    booking.checkOut,
    booking.roomSlug,
    booking.assignedRoomNumber,
  );
  const ref = booking._id.toString().slice(-10);
  const roomLine = booking.assignedRoomNumber
    ? `${roomName} · Room ${booking.assignedRoomNumber}`
    : roomName;

  return [
    `*New paid booking — ${HOTEL.shortName}*`,
    "",
    `*Guest:* ${booking.guestName}`,
    `*Phone:* ${booking.phone}`,
    `*Email:* ${booking.email}`,
    `*Room:* ${roomLine}`,
    `*Guests:* ${booking.guests}`,
    `*Check-in:* ${stayStart}`,
    `*Check-out:* ${stayEnd}`,
    `*Duration:* ${booking.nights} night${booking.nights === 1 ? "" : "s"}`,
    `*Amount:* ${formatInr(booking.totalAmount)}`,
    `*Ref:* ${ref}`,
    "",
    `*Room status (${stayStart} → ${stayEnd}):*`,
    ...checklist,
    "",
    `Admin: ${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.krishanshudhamapalace.com"}/admin/bookings`,
  ].join("\n");
}

function ownerWhatsAppDigits(): string {
  const raw =
    process.env.OWNER_WHATSAPP?.trim() ||
    process.env.NEXT_PUBLIC_WHATSAPP?.trim() ||
    HOTEL.whatsapp;
  return normalizeIndiaMobile(raw);
}

/**
 * Sends a WhatsApp text to the hotel owner.
 * Supports CallMeBot (easiest) or Meta WhatsApp Cloud API.
 */
export async function sendOwnerWhatsApp(text: string): Promise<{
  sent: boolean;
  provider?: "callmebot" | "meta";
  skipped?: string;
  error?: string;
}> {
  const phone = ownerWhatsAppDigits();
  if (!phone || phone.length < 12) {
    return { sent: false, skipped: "Owner WhatsApp number missing/invalid" };
  }

  const callMeBotKey = process.env.CALLMEBOT_APIKEY?.trim();
  if (callMeBotKey) {
    try {
      const url = new URL("https://api.callmebot.com/whatsapp.php");
      url.searchParams.set("phone", phone);
      url.searchParams.set("text", text);
      url.searchParams.set("apikey", callMeBotKey);
      const res = await fetch(url.toString(), { method: "GET" });
      const body = await res.text();
      if (!res.ok) {
        return {
          sent: false,
          provider: "callmebot",
          error: `CallMeBot HTTP ${res.status}: ${body}`,
        };
      }
      return { sent: true, provider: "callmebot" };
    } catch (e) {
      return {
        sent: false,
        provider: "callmebot",
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (token && phoneNumberId) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: { preview_url: false, body: text },
          }),
        },
      );
      const body = await res.text();
      if (!res.ok) {
        return {
          sent: false,
          provider: "meta",
          error: `Meta WhatsApp HTTP ${res.status}: ${body}`,
        };
      }
      return { sent: true, provider: "meta" };
    } catch (e) {
      return {
        sent: false,
        provider: "meta",
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  return {
    sent: false,
    skipped:
      "Set CALLMEBOT_APIKEY (easy) or WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID",
  };
}

export async function notifyOwnerWhatsAppBooking(
  booking: OwnerBookingAlert,
): Promise<{
  sent: boolean;
  provider?: string;
  skipped?: string;
  error?: string;
  message: string;
}> {
  const message = await formatOwnerBookingWhatsAppMessage(booking);
  const result = await sendOwnerWhatsApp(message);
  return { ...result, message };
}
