import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SPIRITUAL_IMAGES } from "@/lib/spiritual-media";
import { HOTEL } from "@/lib/constants";
import Link from "next/link";
import { Clock, Leaf, UtensilsCrossed, Coffee, Wine } from "lucide-react";
import { RollingNumber } from "@/components/effects/RollingNumber";

export const metadata: Metadata = {
  title: "Dining",
  description: `Multi-cuisine restaurant and dining experiences at ${HOTEL.name}.`,
};

const menuHighlights = [
  { category: "Rajasthani Thali", items: ["Dal Baati Churma", "Gatte ki Sabzi", "Ker Sangri", "Bajra Roti"] },
  { category: "South Indian", items: ["Masala Dosa", "Idli Sambar", "Uttapam", "Filter Coffee"] },
  { category: "Chinese & Continental", items: ["Manchurian", "Fried Rice", "Pasta", "Grilled Paneer"] },
  { category: "Sweets & Beverages", items: ["Ghevar", "Malpua", "Lassi", "Fresh Juices"] },
];

const diningSpaces = [
  { name: "Main Restaurant", desc: "Air-conditioned multi-cuisine dining for all guests", icon: UtensilsCrossed },
  { name: "Garden Dining", desc: "Open-air seating amidst manicured gardens", icon: Leaf },
  { name: "Café Lounge", desc: "Quick bites, beverages, and casual meetings", icon: Coffee },
  { name: "Private Dining", desc: "Intimate celebrations and special occasions", icon: Wine },
];

const foodMenuGallery = [
  { title: "Royal Rajasthani Thali", category: "Signature", image: SPIRITUAL_IMAGES.hospitalityLobby },
  { title: "Satvik Temple Bhoj", category: "Pure Veg", image: SPIRITUAL_IMAGES.lampsWarmth },
  { title: "South Indian Breakfast", category: "Breakfast", image: SPIRITUAL_IMAGES.refinedLobby },
  { title: "Chinese Delights", category: "Main Course", image: SPIRITUAL_IMAGES.luxuryInterior },
  { title: "Tandoor & Kebabs", category: "Chef Special", image: SPIRITUAL_IMAGES.indiaHeritageFacade },
  { title: "Sweets & Desserts", category: "Dessert", image: SPIRITUAL_IMAGES.palaceSuiteDetail },
  { title: "Garden Café Snacks", category: "Snacks", image: SPIRITUAL_IMAGES.resortEvening },
  { title: "Mocktails & Beverages", category: "Drinks", image: SPIRITUAL_IMAGES.calmBedroom },
];

const menuBoard = Array.from({ length: 16 }, (_, i) => {
  const row = foodMenuGallery[i % foodMenuGallery.length];
  return {
    index: i + 1,
    title: row.title,
    category: row.category,
    image: row.image,
  };
});

export default function DiningPage() {
  const diningSectionImage = "/images/dining/dining-section-main.png";

  return (
    <div className="bg-ivory">
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={diningSectionImage}
          alt="Restaurant interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
        <Container className="relative z-10 flex h-full items-end pb-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-gold">
              Restaurant
            </p>
            <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">
              A feast for <span className="text-gold">every palate</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-ivory/60">
              From traditional Rajasthani thali to global favorites — every meal is an experience.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-24 lg:py-32">
        <Container>
          <div className="mb-14 grid gap-4 rounded-2xl border border-gold/10 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-muted">Dishes</p>
              <p className="mt-2 font-serif text-4xl text-navy">
                <RollingNumber value={85} suffix="+" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-muted">Rating</p>
              <p className="mt-2 font-serif text-4xl text-navy">
                <RollingNumber value={4.9} decimals={1} suffix="+" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-muted">Guests Served</p>
              <p className="mt-2 font-serif text-4xl text-navy">
                <RollingNumber value={35} suffix="k+" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-muted">Facilities</p>
              <p className="mt-2 font-serif text-4xl text-navy">
                <RollingNumber value={25} suffix="+" />
              </p>
            </div>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionTitle
                align="left"
                eyebrow="Multi-Cuisine"
                title="Flavors that tell a story"
                subtitle="Our chefs bring together the finest traditions of Rajasthani, South Indian, Chinese and Continental cuisines — all prepared with care and served with warmth."
              />
              <div className="space-y-3 rounded-xl border border-gold/10 bg-cream/50 p-6">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold-muted">
                  <Clock className="h-4 w-4" /> Hours
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-navy">Breakfast</span>
                  <span className="text-charcoal/50">7:00 AM — 10:30 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-navy">Lunch</span>
                  <span className="text-charcoal/50">12:00 PM — 3:30 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-navy">Dinner</span>
                  <span className="text-charcoal/50">7:00 PM — 11:00 PM</span>
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy transition hover:bg-gold-light"
              >
                Reserve a Table
              </Link>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={diningSectionImage}
                alt="Dining ambience"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-navy py-24 lg:py-32">
        <Container>
          <SectionTitle
            eyebrow="Menu Highlights"
            title="Curated selections"
            subtitle="A taste of what awaits — our menu changes seasonally to bring you the freshest flavors."
            dark
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {menuHighlights.map((m) => (
              <div
                key={m.category}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <h3 className="font-serif text-lg text-gold">{m.category}</h3>
                <ul className="mt-4 space-y-2">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ivory/60">
                      <Leaf className="h-3 w-3 shrink-0 text-gold/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="food-menu" className="py-24 lg:py-32">
        <Container>
          <SectionTitle
            eyebrow="Food Menu"
            title="Our menu"
            subtitle="Side-by-side visual menu board, inspired by the reference restaurant format."
          />
          <div className="rounded-2xl border border-gold/15 bg-white p-4 shadow-lg sm:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-4">
                  {menuBoard
                    .filter((_, idx) => idx % 2 === col)
                    .map((menu) => (
                      <article
                        key={menu.index}
                        className="group overflow-hidden rounded-xl border border-gold/10 bg-ivory shadow-sm transition hover:shadow-md"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={menu.image}
                            alt={`Menu Image ${menu.index} - ${menu.title}`}
                            fill
                            className="object-cover transition duration-700 group-hover:scale-105"
                            sizes="(max-width:768px) 100vw, 50vw"
                          />
                          <div className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
                            Menu Image {menu.index}
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] uppercase tracking-[0.26em] text-gold-muted">
                            {menu.category}
                          </p>
                          <h3 className="mt-1 font-serif text-base text-navy">{menu.title}</h3>
                        </div>
                      </article>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 lg:py-32">
        <Container>
          <SectionTitle
            eyebrow="Venues"
            title="Dining spaces for every mood"
            subtitle="From casual coffee to elegant private dining — choose your setting."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {diningSpaces.map((d) => (
              <div
                key={d.name}
                className="group rounded-xl border border-gold/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gold/10 p-3 text-gold transition group-hover:bg-gold/20">
                  <d.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg text-navy">{d.name}</h3>
                <p className="mt-2 text-sm text-charcoal/50">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-gold/15 bg-navy p-8 text-center text-ivory">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">Reservations</p>
            <p className="mt-2 font-serif text-3xl">
              Call <span className="text-gold">{HOTEL.phone}</span>
            </p>
            <p className="mt-2 text-sm text-ivory/60">
              For private dining, group bookings, and custom event menus.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={HOTEL.phoneTel}
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-light"
              >
                Call Now
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-ivory/20 px-6 py-2.5 text-sm text-ivory transition hover:border-gold/50 hover:text-gold"
              >
                Contact Restaurant
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
