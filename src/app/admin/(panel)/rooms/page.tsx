"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

type RoomRow = {
  id: string;
  slug: string;
  name: string;
  category: "deluxe" | "suite" | "executive";
  tagline: string;
  description: string;
  images: string[];
  amenities: string[];
  basePrice: number;
  weekendMultiplier: number;
  maxGuests: number;
  sizeSqFt?: number;
  active: boolean;
};

const emptyForm: RoomRow = {
  id: "",
  slug: "",
  name: "",
  category: "deluxe",
  tagline: "",
  description: "",
  images: [],
  amenities: [],
  basePrice: 9999,
  weekendMultiplier: 1.15,
  maxGuests: 2,
  active: true,
};

function splitLines(s: string): string[] {
  return s
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminRoomsPage() {
  const [rows, setRows] = useState<RoomRow[]>([]);
  const [noDb, setNoDb] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<RoomRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [imagesText, setImagesText] = useState("");
  const [amenitiesText, setAmenitiesText] = useState("");
  const [busy, setBusy] = useState(false);
  /** Slug in DB when edit modal opened — PATCH targets this path even if slug field changes */
  const [patchSlug, setPatchSlug] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/admin/rooms");
    const data = await res.json();
    if (res.status === 503) {
      setNoDb(true);
      setRows([]);
      setError(data.error ?? "Configure MongoDB to manage rooms.");
      return;
    }
    setNoDb(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to load rooms");
      return;
    }
    setRows(data.rooms ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  function openEdit(r: RoomRow) {
    setCreating(false);
    setPatchSlug(r.slug);
    setEditing({ ...r });
    setImagesText(r.images.join("\n"));
    setAmenitiesText(r.amenities.join("\n"));
  }

  function openCreate() {
    setCreating(true);
    setPatchSlug(null);
    setEditing({ ...emptyForm });
    setImagesText("");
    setAmenitiesText("");
  }

  async function save() {
    if (!editing) return;
    setBusy(true);
    setError(null);
    const images = splitLines(imagesText);
    const amenities = splitLines(amenitiesText);
    const payload = {
      slug: editing.slug.trim(),
      name: editing.name.trim(),
      category: editing.category,
      tagline: editing.tagline.trim(),
      description: editing.description.trim(),
      images,
      amenities,
      basePrice: editing.basePrice,
      weekendMultiplier: editing.weekendMultiplier,
      maxGuests: editing.maxGuests,
      active: editing.active,
      ...(editing.sizeSqFt != null && editing.sizeSqFt > 0
        ? { sizeSqFt: editing.sizeSqFt }
        : {}),
    };

    try {
      if (creating) {
        const res = await fetch("/api/admin/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Create failed");
      } else {
        if (!patchSlug) throw new Error("Missing room slug");
        const res = await fetch(`/api/admin/rooms/${encodeURIComponent(patchSlug)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Save failed");
      }
      setEditing(null);
      setCreating(false);
      setPatchSlug(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function deactivate(slug: string) {
    if (!confirm("Deactivate this room on the public site?")) return;
    setBusy(true);
    await fetch(`/api/admin/rooms/${encodeURIComponent(slug)}`, { method: "DELETE" });
    setBusy(false);
    await load();
  }

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-maroon">Rooms & pricing</h1>
          <p className="mt-2 max-w-2xl text-sm text-black-soft/75">
            Edit suites synced to MongoDB. Public pages pull active rooms only. Image URLs must be valid https links (one per line).
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          disabled={noDb}
          className="rounded-sm bg-maroon px-5 py-2.5 text-sm font-medium text-ivory disabled:opacity-50 hover:bg-black-soft"
        >
          Add room
        </button>
      </div>

      {error ? <p className="mt-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      <div className="mt-10 overflow-x-auto rounded-sm border border-gold/20 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gold/15 bg-cream text-xs uppercase tracking-wider text-maroon">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Base / night</th>
              <th className="px-4 py-3">Weekend ×</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !noDb ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-black-soft/55">
                  No rooms in database yet — seed runs on first public load, or add a room above.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-gold/10">
                  <td className="px-4 py-3 font-medium text-maroon">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.slug}</td>
                  <td className="px-4 py-3">₹{r.basePrice.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{r.weekendMultiplier}</td>
                  <td className="px-4 py-3">{r.active ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="mr-3 text-gold hover:underline" onClick={() => openEdit(r)}>
                      Edit
                    </button>
                    <Link href={`/rooms/${r.slug}`} className="mr-3 text-sm text-maroon hover:underline" target="_blank">
                      View
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-red-700 hover:underline"
                      onClick={() => void deactivate(r.slug)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-gold/30 bg-ivory p-8 shadow-2xl">
            <h2 className="font-serif text-2xl text-maroon">{creating ? "New room" : "Edit room"}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium text-maroon">
                Slug (URL)
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 font-mono text-sm"
                  placeholder="deluxe-king"
                />
              </label>
              <label className="text-xs font-medium text-maroon">
                Name
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-maroon">
                Category
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      category: e.target.value as RoomRow["category"],
                    })
                  }
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                >
                  <option value="deluxe">deluxe</option>
                  <option value="suite">suite</option>
                  <option value="executive">executive</option>
                </select>
              </label>
              <label className="text-xs font-medium text-maroon">
                Max guests
                <input
                  type="number"
                  min={1}
                  value={editing.maxGuests}
                  onChange={(e) =>
                    setEditing({ ...editing, maxGuests: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-maroon sm:col-span-2">
                Tagline
                <input
                  value={editing.tagline}
                  onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-maroon sm:col-span-2">
                Description
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-maroon">
                Base price (INR / night)
                <input
                  type="number"
                  value={editing.basePrice}
                  onChange={(e) =>
                    setEditing({ ...editing, basePrice: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-maroon">
                Weekend multiplier
                <input
                  type="number"
                  step="0.01"
                  min={1}
                  value={editing.weekendMultiplier}
                  onChange={(e) =>
                    setEditing({ ...editing, weekendMultiplier: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-maroon">
                Size (sq.ft) · optional
                <input
                  type="number"
                  value={editing.sizeSqFt ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sizeSqFt: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 pt-6 text-sm text-maroon">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                />
                Active on website
              </label>
              <label className="text-xs font-medium text-maroon sm:col-span-2">
                Image URLs (one per line, https)
                <textarea
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 font-mono text-xs"
                />
              </label>
              <label className="text-xs font-medium text-maroon sm:col-span-2">
                Amenities (one per line)
                <textarea
                  value={amenitiesText}
                  onChange={(e) => setAmenitiesText(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-sm border border-gold/30 px-3 py-2 text-sm"
                />
              </label>
            </div>
            {patchSlug && patchSlug !== editing.slug ? (
              <p className="mt-4 text-xs text-amber-800">
                Slug change updates the public URL from <code>/rooms/{patchSlug}</code> to{" "}
                <code>/rooms/{editing.slug}</code>.
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void save()}
                className="rounded-sm bg-maroon px-6 py-2.5 text-sm font-medium text-ivory hover:bg-black-soft disabled:opacity-50"
              >
                {busy ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                  setPatchSlug(null);
                }}
                className="rounded-sm border border-maroon/25 px-6 py-2.5 text-sm text-maroon hover:bg-maroon/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Container>
  );
}
