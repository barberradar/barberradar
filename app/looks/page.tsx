"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LooksPage() {
  const [looks, setLooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLooks = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("barber_portfolio")
        .select("id, barber_slug, image_url, title, service_name, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading looks:", error);
        setLoading(false);
        return;
      }

      setLooks(data ?? []);
      setLoading(false);
    };

    loadLooks();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-2xl font-black"
          >
            BARBER<span className="text-red-500">RADAR</span>
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-red-500/50"
          >
            Home
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-bold uppercase tracking-widest text-red-500">
          Browse Inspiration
        </p>

        <h1 className="mt-2 text-4xl font-black">All Looks</h1>

        <p className="mt-3 text-zinc-400">
          Find a style you like and book that exact look.
        </p>

        {loading ? (
          <p className="mt-10 text-zinc-400">Loading looks...</p>
        ) : looks.length === 0 ? (
          <p className="mt-10 text-zinc-500">No looks uploaded yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {looks.map((look) => (
              <article
                key={look.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
              >
                <img
                  src={look.image_url}
                  alt={look.title || "Barber look"}
                  className="aspect-square w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-black">
                    {look.title || "Recent Cut"}
                  </h2>

                  {look.service_name && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {look.service_name}
                    </p>
                  )}

                  <button
                    onClick={() => {
                      const serviceParam = look.service_name
                        ? `?service=${encodeURIComponent(look.service_name)}`
                        : "";

                      window.location.href = `/barber/${look.barber_slug}${serviceParam}`;
                    }}
                    className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-500"
                  >
                    Book This Look
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}