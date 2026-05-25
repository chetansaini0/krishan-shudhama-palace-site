"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      <div className="border-b border-gold/20 bg-maroon text-ivory">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/admin/dashboard" className="font-serif text-lg">
            KSP · Operations
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/admin/dashboard"
              className={pathname === "/admin/dashboard" ? "text-gold-light" : "hover:text-gold-light"}
            >
              Overview
            </Link>
            <Link
              href="/admin/bookings"
              className={pathname === "/admin/bookings" ? "text-gold-light" : "hover:text-gold-light"}
            >
              Bookings
            </Link>
            <Link
              href="/admin/inquiries"
              className={pathname === "/admin/inquiries" ? "text-gold-light" : "hover:text-gold-light"}
            >
              Event leads
            </Link>
            <Link
              href="/admin/rooms"
              className={pathname === "/admin/rooms" ? "text-gold-light" : "hover:text-gold-light"}
            >
              Rooms
            </Link>
            <button type="button" onClick={() => void logout()} className="hover:text-gold-light">
              Logout
            </button>
            <Link href="/" className="text-ivory/60 hover:text-ivory">
              View site
            </Link>
          </nav>
        </Container>
      </div>
      {children}
    </div>
  );
}
