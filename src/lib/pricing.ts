import { differenceInCalendarDays, isWeekend, parseISO } from "date-fns";

export function countNights(checkIn: string, checkOut: string): number {
  const a = parseISO(checkIn);
  const b = parseISO(checkOut);
  return Math.max(0, differenceInCalendarDays(b, a));
}

function isWeekendDay(d: Date): boolean {
  return isWeekend(d);
}

/**
 * Simplified: weekend = Fri/Sat night pricing using multiplier for those nights.
 */
export function computeStayTotalPaise(
  checkIn: string,
  checkOut: string,
  basePriceRupees: number,
  weekendMultiplier: number,
): { nights: number; totalRupees: number } {
  const nights = countNights(checkIn, checkOut);
  if (nights <= 0) return { nights: 0, totalRupees: 0 };
  const start = parseISO(checkIn);
  let total = 0;
  for (let i = 0; i < nights; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const mult = isWeekendDay(d) ? weekendMultiplier : 1;
    total += Math.round(basePriceRupees * mult);
  }
  return { nights, totalRupees: total };
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}
