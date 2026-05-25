export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] bg-ivory pt-28">
      <div className="mx-auto w-full max-w-6xl animate-pulse px-6 pb-16">
        <div className="h-10 w-1/2 rounded-xl bg-navy/10" />
        <div className="mt-4 h-5 w-2/3 rounded-xl bg-navy/10" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-56 rounded-2xl bg-navy/10" />
          <div className="h-56 rounded-2xl bg-navy/10" />
          <div className="h-56 rounded-2xl bg-navy/10" />
        </div>
      </div>
    </div>
  );
}
