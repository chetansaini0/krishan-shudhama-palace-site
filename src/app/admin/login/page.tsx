"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10";

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl border border-gold/10 bg-white p-10 shadow-2xl"
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-muted">Staff access</p>
          <h1 className="mt-2 font-serif text-3xl text-navy">Admin Login</h1>
        </div>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Email</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="gold" className="w-full !rounded-xl !py-3.5" disabled={busy}>
          {busy ? "Signing in..." : "Continue Securely"}
        </Button>
      </form>
    </div>
  );
}
