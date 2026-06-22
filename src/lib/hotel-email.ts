/** Official hotel inbox — use for admin login, staff alerts, and reply-to on guest emails. */
export const KRISHAN_HOTEL_EMAIL = "krishanshudhama1902@gmail.com";

/** Server-side ops inbox (ADMIN_EMAIL should match KRISHAN_HOTEL_EMAIL in production). */
export function hotelOpsEmail(): string {
  const admin = process.env.ADMIN_EMAIL?.trim();
  const publicHotel = process.env.NEXT_PUBLIC_HOTEL_EMAIL?.trim();
  return admin || publicHotel || KRISHAN_HOTEL_EMAIL;
}
