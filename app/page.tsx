"use client";

import { useEffect, useState } from "react";
import NotificationBell from "./components/NotificationBell";
import { createClient } from "@/utils/supabase/client";

const barbers = [
  {
    name: "Fade District",
   slug: "fade-district",
    city: "Los Angeles, CA",
    rating: "4.9",
    specialty: "Fades and beard sculpting",
    price: "$35",
    availableTime: "2:00 PM",
    services: [
  { name: "Haircut", description: "Clean cut, lineup and styling", price: "$35" },
  { name: "Haircut + Beard", description: "Haircut, beard shaping and lineup", price: "$50" },
  { name: "Kids Cut", description: "Ages 12 and under", price: "$25" },
],
  },
  {
    name: "The Cut Society",
    slug: "the-cut-society",
    city: "Inglewood, CA",
    rating: "4.8",
    specialty: "Lineups and hair designs",
    price: "$30",
    availableTime: "1:00 PM",
    services: [
  { name: "Haircut", description: "Lineup, styling and finishing", price: "$30" },
  { name: "Hair Design", description: "Custom linework and designs", price: "$45" },
  { name: "Kids Cut", description: "Ages 12 and under", price: "$25" },
],
  },
  {
    name: "Crown and Clippers",
    slug: "crown-and-clippers",
    city: "Long Beach, CA",
    rating: "4.9",
    specialty: "Locs, braids and tapers",
    price: "$40",
    availableTime: "10:00 AM",
    services: [
  { name: "Haircut", description: "Taper, cleanup and styling", price: "$40" },
  { name: "Loc Maintenance", description: "Loc cleanup and maintenance", price: "$65" },
  { name: "Braids", description: "Protective styling and braids", price: "$70" },
],
  },
];

export default function Home() {
  const [homeSearch, setHomeSearch] = useState("");
 const [selectedBarber, setSelectedBarber] = useState("");
const [selectedStyle, setSelectedStyle] = useState("");
const [selectedService, setSelectedService] = useState("");
  const [showLookBooking, setShowLookBooking] = useState(false);
  const [dbBarbers, setDbBarbers] = useState<any[]>([]);
  const [dbLooks, setDbLooks] = useState<any[]>([]);

useEffect(() => {
  const loadBarbers = async () => {
    const supabase = createClient();

    const { data: looksData, error: looksError } = await supabase
  .from("barber_portfolio")
  .select("id, barber_slug, image_url, title, service_name, created_at")
  .order("created_at", { ascending: false })
  .limit(3);

if (looksError) {
  console.error("Error loading homepage looks:", looksError);
} else {
  setDbLooks(looksData ?? []);
}

    const { data, error } = await supabase
      .from("barbers")
      .select("*");

    if (error) {
      console.error("Error loading barbers:", error);
      return;
    }

const { data: servicesData, error: servicesError } = await supabase
  .from("barber_services")
  .select("barber_slug, price");

if (servicesError) {
  console.error("Error loading barber services:", servicesError);
}

const { data: availabilityData, error: availabilityError } = await supabase
  .from("barber_availability")
  .select("barber_slug, day, time, is_available");

if (availabilityError) {
  console.error("Error loading barber availability:", availabilityError);
}
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
});
const barbersWithPrices = (data ?? []).map((barber) => {
  const barberPrices = (servicesData ?? [])
    .filter((service) => service.barber_slug === barber.slug)
    .map((service) => Number(service.price))
    .filter((price) => !Number.isNaN(price));

  const minPrice =
    barberPrices.length > 0 ? Math.min(...barberPrices) : null;

  return {
    ...barber,
    price: minPrice !== null ? `$${minPrice}` : "",
  availableToday:
  (availabilityData ?? []).some(
    (slot) =>
      slot.barber_slug === barber.slug &&
      slot.is_available === true &&
      slot.day === today
  ),
  };
});

setDbBarbers(barbersWithPrices);
    console.log("Homepage barbers:", data);
  };

  loadBarbers();
}, []);
const homepageBarbers = [
  ...dbBarbers,
  ...barbers.filter(
    (demoBarber) =>
      !dbBarbers.some((dbBarber) => dbBarber.slug === demoBarber.slug)
  ),
].slice(0, 3);

return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-black">
            BARBER<span className="text-red-500">RADAR</span>
          </h1>

         <div className="flex items-center gap-3">
  <NotificationBell />

  <button
onClick={() => (window.location.href = "/login?role=barber")}
  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold"
>
  Barber Login
</button>
</div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20 md:py-24">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-red-500">
          Find local talent
        </p>

        <h2 className="text-3xl font-black leading-tight sm:text-5xl md:text-7xl">
  Find the right barber
  <span className="mt-1 block text-red-500 sm:mt-2">
    for your next cut.
  </span>
</h2>
<p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
          Discover nearby barbers, view their work, compare prices and book with
          confidence.
        </p>

       <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-3 sm:mt-10 sm:flex-row">
 <input
  value={homeSearch}
  onChange={(e) => setHomeSearch(e.target.value)}
  className="h-14 flex-1 rounded-xl bg-zinc-900 px-5 outline-none placeholder:text-zinc-500"
  placeholder="Search by city, ZIP code or hairstyle"
/>
<button
  onClick={() => {
  const term = homeSearch.trim();

  window.location.href = term
    ? `/barbers?search=${encodeURIComponent(term)}`
    : "/barbers";
}}
  className="min-h-12 rounded-xl bg-red-600 px-8 font-bold transition duration-200 hover:scale-[1.02] hover:bg-red-500"
>
  Find My Barber
</button>
        </div>
      </section>

     <section id="barbers" className="mx-auto max-w-6xl px-6 pb-24">
     <div className="mb-8 flex items-end justify-between">
  <div>
    <p className="font-bold uppercase tracking-widest text-red-500">
      Trending near you
    </p>
    <h3 className="mt-2 text-3xl font-black">Barbers worth booking</h3>
  </div>

  <a
    href="/barbers"
    className="text-sm font-bold text-zinc-400 transition hover:text-white"
  >
    View All →
  </a>
</div>

        <div className="grid gap-6 md:grid-cols-3">
  {homepageBarbers.map((barber) => (
         <article
  key={barber.name}
  onClick={() => (window.location.href = `/barber/${barber.slug}`)}
  className="cursor-pointer rounded-3xl border border-white/10 bg-zinc-950 p-6 transition hover:border-white/20"
>
              <div className="mb-6 flex h-40 items-center justify-center rounded-2xl bg-zinc-900 text-6xl">
                💈
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xl font-black">{barber.name}</h4>
             <p className="mt-1 text-sm text-zinc-500">
  {"city" in barber ? barber.city : barber.location}
</p>

{"availableToday" in barber && barber.availableToday && (
  <p className="mt-2 text-sm font-semibold text-green-400">
    🟢 Available Today
  </p>
)}
                </div>

                <span className="rounded-lg bg-yellow-500/10 px-2 py-1 text-sm font-bold text-yellow-400">
              {"rating" in barber ? `★ ${barber.rating}` : "New"}
                </span>
              </div>

              <p className="mt-5 text-zinc-300">{barber.specialty}</p>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <p className="font-bold">From {barber.price}</p>

               <button
  onClick={(e) => {
    e.stopPropagation();
    window.location.href = `/barber/${barber.slug}`;
  }}
  className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold hover:bg-red-500"
>
  Book Now
</button>
              </div>
            </article>
          ))}
        </div>
      </section>

  <section className="mx-auto max-w-6xl px-6 py-20">
  <div className="mb-8 flex items-end justify-between">
    <div>
      <p className="font-bold uppercase tracking-widest text-red-500">
        🔥 Trending This Week
      </p>
      <h2 className="mt-2 text-3xl font-black">
        Fresh cuts worth seeing
      </h2>
    </div>

   <button
  onClick={() => (window.location.href = "/looks")}
  className="text-sm font-semibold text-zinc-400 hover:text-white"
>
  View All →
</button>
  </div>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {dbLooks.map((cut) => (
      <article
    key={cut.id}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/20"
      >
        <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
          <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-bold backdrop-blur">
❤️ New
</div>
        {cut.image_url ? (
  <img
    src={cut.image_url}
    alt={cut.title || "Barber look"}
    className="h-full w-full object-cover"
  />
) : (
  <div className="text-center">
    <div className="text-6xl">✂️</div>
    <p className="mt-3 text-sm text-zinc-500">Photo coming soon</p>
  </div>
)}
        </div>

        <div className="p-5">
<div className="flex items-start justify-between">

  <div>
    <div className="mb-2 inline-flex rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
      🔥 Trending
    </div>

 {cut.title || "Recent Cut"}

    <p className="mt-1 text-sm text-zinc-500">
  {cut.service_name || "Barber Service"}
    </p>

    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
      <span>👀 18K</span>
      <button className="hover:text-white transition">
        🔖 Save
      </button>
    </div>

  </div>

  <div className="text-right">
 <div className="text-lg font-bold">
  ❤️ New
</div>

    <button
  onClick={() => {
 setSelectedBarber(cut.barber_slug);
setSelectedStyle(cut.title);
setSelectedService(cut.service_name || "");
setShowLookBooking(true);
  }}
  className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold transition hover:bg-red-500"
>
  Book This Look
</button>

  </div>

</div>
        </div>
      </article>
    ))}
  </div>
</section>    
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        © 2026 BarberRadar. Find the cut. Book the barber.
      </footer>
    {showLookBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-8">
      <p className="text-sm font-bold uppercase tracking-widest text-red-500">
        Book This Look
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {selectedStyle}
      </h2>

      <p className="mt-2 text-zinc-400">
        by <span className="font-semibold text-white">{selectedBarber}</span>
      </p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setShowLookBooking(false)}
          className="flex-1 rounded-xl border border-white/10 py-3"
        >
          Cancel
        </button>

       <button
  onClick={() => {
setShowLookBooking(false);

const params = new URLSearchParams();

if (selectedStyle) {
  params.set("style", selectedStyle);
}

if (selectedService) {
  params.set("service", selectedService);
}

window.location.href = `/barber/${selectedBarber}?${params.toString()}`;
}}
  className="flex-1 rounded-xl bg-red-600 py-3 font-bold hover:bg-red-500"
>
  Continue
</button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
