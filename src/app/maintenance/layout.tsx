import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Nested layout keeps the lock route free of extra chrome. Root layout also strips nav when locked. */
export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
