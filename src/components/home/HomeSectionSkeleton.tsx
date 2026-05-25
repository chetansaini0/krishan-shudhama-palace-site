"use client";

export function HomeSectionSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "bg-ivory py-10" : "bg-ivory py-16"}>
      <div className="mx-auto w-full max-w-6xl animate-pulse px-6">
        <div className="h-4 w-40 rounded-full bg-navy/10" />
        <div className="mt-4 h-8 w-3/4 rounded-full bg-navy/10" />
        <div className="mt-3 h-4 w-2/3 rounded-full bg-navy/10" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 rounded-2xl bg-navy/10" />
          <div className="h-48 rounded-2xl bg-navy/10" />
          <div className="h-48 rounded-2xl bg-navy/10" />
        </div>
      </div>
    </section>
  );
}
