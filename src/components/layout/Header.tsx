"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { HOTEL } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

const stayLinks = [
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/amenities", label: "Amenities" },
];

const restaurantLinks = [
  { href: "/dining", label: "Our Restaurant" },
  { href: "/dining#food-menu", label: "Food Menu" },
];

type NavLink = { kind: "link"; href: string; label: string };
type NavDropdown = {
  kind: "dropdown";
  id: "stay" | "restaurant";
  label: string;
  links: { href: string; label: string }[];
  isActive: (pathname: string) => boolean;
};

const navItems: (NavLink | NavDropdown)[] = [
  { kind: "link", href: "/", label: "Home" },
  {
    kind: "dropdown",
    id: "stay",
    label: "Rooms & Amenities",
    links: stayLinks,
    isActive: (p) => p === "/rooms" || p.startsWith("/rooms/") || p === "/amenities",
  },
  { kind: "link", href: "/banquet", label: "Banquet" },
  {
    kind: "dropdown",
    id: "restaurant",
    label: "Restaurant",
    links: restaurantLinks,
    isActive: (p) => p.startsWith("/dining"),
  },
  { kind: "link", href: "/gallery", label: "Gallery" },
  { kind: "link", href: "/location", label: "Location" },
  { kind: "link", href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"stay" | "restaurant" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 50;
        setScrolled((prev) => (prev === next ? prev : next));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setOpen(false);
      }
    };
    const onClickAway = (event: MouseEvent) => {
      if (!openDropdown) return;
      const node = rootRef.current;
      if (!node?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickAway);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickAway);
    };
  }, [openDropdown]);

  const isHome = pathname === "/";
  const navBg = scrolled
    ? "bg-navy/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-gold/10"
    : isHome
      ? "bg-transparent"
      : "bg-navy/90 backdrop-blur-md";

  function renderDropdown(item: NavDropdown) {
    const active = item.isActive(pathname);
    const isOpen = openDropdown === item.id;
    const menuId = `${item.id}-menu`;
    const underlineId = `${item.id}-underline`;

    return (
      <div
        key={item.id}
        className="group relative"
        onMouseEnter={() => setOpenDropdown(item.id)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button
          type="button"
          className={`relative inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
            active ? "text-gold" : "text-ivory/70 hover:text-ivory"
          }`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
          onClick={() => setOpenDropdown((v) => (v === item.id ? null : item.id))}
        >
          {item.label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
          {active && (
            <motion.div
              layoutId={underlineId}
              className="absolute bottom-0 left-4 right-4 h-[1px] bg-gold"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </button>
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              id={menuId}
              role="menu"
              className="absolute left-0 top-full z-30 mt-2 w-52 rounded-xl border border-gold/10 bg-navy/95 p-2 backdrop-blur-xl"
            >
              {item.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm text-ivory/80 transition hover:bg-white/5 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  role="menuitem"
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <header
      ref={rootRef}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${navBg}`}
    >
      <Container className="flex items-center justify-between py-4 lg:py-5">
        <Link href="/" className="group flex items-center gap-3 pl-1">
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30 lg:h-12 lg:w-12">
            <Image
              src="/logo-light.png"
              alt={`${HOTEL.name} logo`}
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg tracking-wide text-gold transition-colors group-hover:text-gold-light lg:text-2xl">
              {HOTEL.shortName}
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.45em] text-ivory/55">
              Palace
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.kind === "link" ? (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-4 py-2 text-sm tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  pathname === item.href
                    ? "text-gold"
                    : "text-ivory/70 hover:text-ivory"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-[1px] bg-gold"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </Link>
            ) : (
              renderDropdown(item)
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={HOTEL.phoneTel}
            className="flex items-center gap-2 text-sm text-ivory/60 transition hover:text-gold"
          >
            <Phone className="h-3.5 w-3.5" />
            {HOTEL.phone}
          </a>
          <Link
            href="/book"
            className="btn-shimmer rounded-full bg-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-ivory/20 p-2.5 text-ivory transition hover:border-gold/40 hover:text-gold lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            id="mobile-menu"
            className="overflow-hidden border-t border-gold/10 bg-navy/98 backdrop-blur-xl lg:hidden"
          >
            <Container className="py-6">
              <div className="flex flex-col gap-1">
                {navItems.map((item, i) =>
                  item.kind === "link" ? (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-lg px-4 py-3 text-base transition ${
                          pathname === item.href
                            ? "bg-gold/10 text-gold"
                            : "text-ivory/80 hover:bg-white/5 hover:text-ivory"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="mt-1 rounded-lg border border-white/5 bg-white/[0.03] p-2"
                    >
                      <p className="px-2 pb-2 pt-1 text-[10px] uppercase tracking-[0.3em] text-gold/60">
                        {item.label}
                      </p>
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-4 py-2 text-sm text-ivory/75 transition hover:bg-white/5 hover:text-gold"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  ),
                )}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4"
                >
                  <Link
                    href="/book"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-full bg-gold py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-navy"
                  >
                    Book Now
                  </Link>
                </motion.div>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-ivory/50">
                  <a href={HOTEL.phoneTel} className="hover:text-gold">
                    {HOTEL.phone}
                  </a>
                  <span className="text-gold/30">|</span>
                  <a href={`mailto:${HOTEL.email}`} className="hover:text-gold">
                    Email
                  </a>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
