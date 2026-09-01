"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
  const searchFromUrl = searchParams.get("search");

  if (searchFromUrl) {
    setSearchTerm(searchFromUrl);
  }
}, [searchParams]);

  useEffect(() => {
    const loadBarbers = async () => {
      const supabase = createClient();

      const { data: barberData, error: barberError } = await supabase
        .from("barbers")
        .select("*");

      if (barberError) {
        console.error("Error loading barbers:", barberError);
        setLoading(false);
        return;
      }

      const { data: servicesData } = await supabase
        .from("barber_services")
        .select("barber_slug, price");

      const { data: availabilityData } = await supabase
        .from("barber_availability")
        .select("barber_slug, day, is_available");

      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
      });

      const completeBarbers = (barberData ?? []).map((barber) => {
        const prices = (servicesData ?? [])
          .filter((service) => service.barber_slug === barber.slug)
          .map((service) => Number(service.price))
          .filter((price) => !Number.isNaN(price));

        const minPrice = prices.length ? Math.min(...prices) : null;

        const availableToday = (availabilityData ?? []).some(
          (slot) =>
            slot.barber_slug === barber.slug &&
            slot.is_available === true &&
            slot.day === today
        );

        return {
          ...barber,
          price: minPrice !== null ? `$${minPrice}` : "",
          availableToday,
        };
      });

      setBarbers(completeBarbers);
      setLoading(false);
    };

    loadBarbers();
  }, []);

const filteredBarbers = barbers.filter((barber) => {
  const term = searchTerm.toLowerCase().trim();

  const matchesSearch =
    !term ||
    barber.name?.toLowerCase().includes(term) ||
    barber.location?.toLowerCase().includes(term) ||
    barber.specialty?.toLowerCase().includes(term);

  const matchesAvailability =
    !availableOnly || barber.availableToday === true;

  return matchesSearch && matchesAvailability;
});

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
          Explore BarberRadar
        </p>

        <h1 className="mt-2 text-4xl font-black">All Barbers</h1>

        <p className="mt-3 text-zinc-400">
          Find the right barber, compare services and book your next cut.
        </p>

        <div className="mt-6">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by barber, city, or specialty"
    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-red-500/50"
  />
</div>

<div className="mt-4">
  <button
    type="button"
    onClick={() => setAvailableOnly((current) => !current)}
    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
      availableOnly
        ? "border-green-500 bg-green-500/10 text-green-400"
        : "border-white/10 text-zinc-400 hover:text-white"
    }`}
  >
    {availableOnly ? "✓ Available Today" : "Available Today"}
  </button>
</div>

  {loading ? (
  <p className="mt-10 text-zinc-400">Loading barbers...</p>
) : (
  <>
    {filteredBarbers.length === 0 && (
      <div className="mt-10 rounded-2xl border border-white/10 bg-zinc-950 p-8 text-center">
        <p className="text-lg font-bold text-white">
          No barbers found
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Try another barber name, city, or specialty.
        </p>
      </div>
    )}

    <div className="mt-10 grid gap-6 md:grid-cols-3">
   {filteredBarbers.map((barber) => (
              <article
                key={barber.slug}
                onClick={() =>
                  (window.location.href = `/barber/${barber.slug}`)
                }
                className="cursor-pointer rounded-3xl border border-white/10 bg-zinc-950 p-6 transition hover:border-red-500/40"
              >
                <div className="mb-6 flex h-40 items-center justify-center rounded-2xl bg-zinc-900 text-5xl">
                  💈
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black">{barber.name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {barber.location}
                    </p>
                  </div>

                  <span className="rounded-lg bg-yellow-500/10 px-2 py-1 text-xs font-bold text-yellow-400">
                    New
                  </span>
                </div>

                {barber.availableToday && (
                  <p className="mt-2 text-sm font-semibold text-green-400">
                    🟢 Available Today
                  </p>
                )}

                <p className="mt-5 text-zinc-300">{barber.specialty}</p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <p className="font-bold">
                    {barber.price ? `From ${barber.price}` : "View services"}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/barber/${barber.slug}`;
                    }}
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold hover:bg-red-500"
                  >
                    View Profile
                  </button>
                </div>
              </article>
            ))}
          </div>
          </>
        )}
      </section>
    </main>
  );
}