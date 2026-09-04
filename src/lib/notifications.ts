import { Resend } from "resend";
import { format } from "date-fns";
import { HOTEL } from "@/lib/constants";
import { hotelOpsEmail } from "@/lib/hotel-email";
import {
  formatOwnerBookingWhatsAppMessage,
  notifyOwnerWhatsAppBooking,
} from "@/lib/owner-whatsapp";
import { getRoomBySlug } from "@/lib/rooms";

function formatInr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Normalize to MSG91-style digits (India default: 91 + 10 digits). */
export function normalizeIndiaMobile(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  if (d.length === 12 && d.startsWith("91")) return d;
  if (d.length === 11 && d.startsWith("0")) return `91${d.slice(1)}`;
  return d;
}

function bookingEmailHtml(booking: {
  guestName: string;
  roomSlug: string;
  roomName?: string;
  assignedRoomNumber?: string;
  guests?: number;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalAmount: number;
  id: string;
}): string {
  const stay = `${format(booking.checkIn, "dd MMM yyyy")} → ${format(booking.checkOut, "dd MMM yyyy")}`;
  const roomLabel = booking.assignedRoomNumber
    ? `${booking.roomName ?? booking.roomSlug} · Room ${booking.assignedRoomNumber}`
    : (booking.roomName ?? booking.roomSlug);
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family:Georgia,serif;background:#faf7f2;color:#0f0f0f;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e8d5a3;padding:32px;">
      <p style="letter-spacing:0.25em;text-transform:uppercase;font-size:11px;color:#c9a227;margin:0;">${HOTEL.shortName}</p>
      <h1 style="font-size:22px;color:#4a0e1c;margin:12px 0 8px;">Booking confirmed</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Dear ${booking.guestName},</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
        Thank you for reserving directly with us. Your payment has been verified and your stay is confirmed.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Confirmation</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-family:monospace;">${booking.id.slice(-10)}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Room</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${roomLabel}</td></tr>
        ${
          typeof booking.guests === "number"
            ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Guests</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${booking.guests}</td></tr>`
            : ""
        }
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Stay</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${stay}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;">Nights</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${booking.nights}</td></tr>
        <tr><td style="padding:8px 0;"><strong>Total paid</strong></td><td style="padding:8px 0;text-align:right;"><strong>${formatInr(booking.totalAmount)}</strong></td></tr>
      </table>
      <p style="font-size:13px;color:#444;line-height:1.6;margin:16px 0 0;">
        Need changes? Reply to this email or WhatsApp us at <strong>${HOTEL.phone}</strong>.
      </p>
      <p style="font-size:12px;color:#888;margin-top:24px;">${HOTEL.fullAddress}</p>
    </div>
  </body>
  </html>`;
}

/**
 * MSG91 Flow API — template in panel must define matching variables (VAR1–VAR5 by default).
 * VAR1 guest name · VAR2 room · VAR3 stay dates · VAR4 total · VAR5 short ref
 */
async function sendMsg91BookingSms(booking: {
  guestName: string;
  phone: string;
  roomSlug: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  id: string;
}): Promise<void> {
  const authkey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_FLOW_TEMPLATE_ID;
  if (!authkey || !templateId) return;

  const mobile = normalizeIndiaMobile(booking.phone);
  if (mobile.length < 12) {
    console.warn("[msg91] skip SMS — could not normalize phone", booking.phone);
    return;
  }

  const stay = `${format(booking.checkIn, "dd MMM")}-${format(booking.checkOut, "dd MMM yyyy")}`;
  const total = formatInr(booking.totalAmount);
  const ref = booking.id.slice(-8);

  const body = {
    template_id: templateId,
    short_url: "0",
    recipients: [
      {
        mobiles: mobile,
        VAR1: booking.guestName,
        VAR2: booking.roomSlug,
        VAR3: stay,
        VAR4: total,
        VAR5: ref,
      },
    ],
  };

  const res = await fetch("https://control.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: {
      authkey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`MSG91 HTTP ${res.status}: ${text}`);
  }
}

export type NotifyResult = {
  emailSent: boolean;
  smsSent: boolean;
  ownerWhatsAppSent: boolean;
  skipped: { email?: string; sms?: string; ownerWhatsApp?: string };
  errors: string[];
};

export async function notifyBookingConfirmed(booking: {
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
}): Promise<NotifyResult> {
  const errors: string[] = [];
  const skipped: NotifyResult["skipped"] = {};
  let emailSent = false;
  let smsSent = false;
  let ownerWhatsAppSent = false;

  const room = await getRoomBySlug(booking.roomSlug);
  const payload = {
    guestName: booking.guestName,
    roomSlug: booking.roomSlug,
    roomName: room?.name,
    assignedRoomNumber: booking.assignedRoomNumber,
    guests: booking.guests,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    totalAmount: booking.totalAmount,
    id: booking._id.toString(),
  };

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (resendKey && from) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from,
        to: booking.email,
        replyTo: hotelOpsEmail(),
        subject: `Booking confirmed — ${HOTEL.shortName}`,
        html: bookingEmailHtml(payload),
      });
      emailSent = true;

      const ownerText = await formatOwnerBookingWhatsAppMessage({
        _id: booking._id,
        guestName: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        roomSlug: booking.roomSlug,
        assignedRoomNumber: booking.assignedRoomNumber,
        guests: booking.guests,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        totalAmount: booking.totalAmount,
      });

      await sendStaffEmail(
        `New paid booking — ${booking.guestName} · ${room?.name ?? booking.roomSlug}`,
        `<p>A guest completed Razorpay payment. Details:</p>
         <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:13px;background:#faf7f2;padding:16px;border:1px solid #e8d5a3;">${ownerText
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/\*/g, "")}</pre>`,
      );
    } catch (e) {
      errors.push(`Resend: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    skipped.email = !resendKey
      ? "RESEND_API_KEY missing"
      : "RESEND_FROM_EMAIL missing";
  }

  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_FLOW_TEMPLATE_ID) {
    try {
      await sendMsg91BookingSms({
        guestName: booking.guestName,
        phone: booking.phone,
        roomSlug: booking.roomSlug,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalAmount: booking.totalAmount,
        id: booking._id.toString(),
      });
      smsSent = true;
    } catch (e) {
      errors.push(`MSG91: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    skipped.sms = "MSG91_AUTH_KEY or MSG91_FLOW_TEMPLATE_ID missing";
  }

  try {
    const wa = await notifyOwnerWhatsAppBooking({
      _id: booking._id,
      guestName: booking.guestName,
      email: booking.email,
      phone: booking.phone,
      roomSlug: booking.roomSlug,
      assignedRoomNumber: booking.assignedRoomNumber,
      guests: booking.guests,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      totalAmount: booking.totalAmount,
    });
    ownerWhatsAppSent = wa.sent;
    if (wa.skipped) skipped.ownerWhatsApp = wa.skipped;
    if (wa.error) errors.push(`Owner WhatsApp: ${wa.error}`);
  } catch (e) {
    errors.push(
      `Owner WhatsApp: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  if (errors.length) {
    console.error("[notifyBookingConfirmed]", { skipped, errors });
  } else {
    console.info("[notifyBookingConfirmed]", {
      emailSent,
      smsSent,
      ownerWhatsAppSent,
      skipped,
    });
  }

  return { emailSent, smsSent, ownerWhatsAppSent, skipped, errors };
}

async function sendStaffEmail(subject: string, html: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resendKey || !from) return;

  const resend = new Resend(resendKey);
  await resend.emails.send({
    from,
    to: hotelOpsEmail(),
    replyTo: hotelOpsEmail(),
    subject,
    html,
  });
}

export async function notifyStaffContactInquiry(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<void> {
  try {
    await sendStaffEmail(
      `New website inquiry — ${data.name}`,
      `<p><strong>Name:</strong> ${data.name}</p>
       <p><strong>Phone:</strong> ${data.phone}</p>
       ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ""}
       <p><strong>Message:</strong><br/>${data.message.replace(/\n/g, "<br/>")}</p>`,
    );
  } catch (e) {
    console.error("[notifyStaffContactInquiry]", e);
  }
}

export async function notifyStaffEventInquiry(data: {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: number;
  message: string;
}): Promise<void> {
  try {
    await sendStaffEmail(
      `New banquet inquiry — ${data.name}`,
      `<p><strong>Name:</strong> ${data.name}</p>
       <p><strong>Email:</strong> ${data.email}</p>
       <p><strong>Phone:</strong> ${data.phone}</p>
       <p><strong>Event:</strong> ${data.eventType} · ${data.guestCount} guests</p>
       <p><strong>Details:</strong><br/>${data.message.replace(/\n/g, "<br/>")}</p>`,
    );
  } catch (e) {
    console.error("[notifyStaffEventInquiry]", e);
  }
}
