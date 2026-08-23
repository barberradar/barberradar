"use client";

import { useState } from "react";
import NotificationBell from "./components/NotificationBell";

const barbers = [
  {
    name: "Fade District",
   slug: "fade-district",
    city: "Los Angeles, CA",
    rating: "4.9",
    specialty: "Fades and beard sculpting",
    price: "$35",
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
    services: [
  { name: "Haircut", description: "Taper, cleanup and styling", price: "$40" },
  { name: "Loc Maintenance", description: "Loc cleanup and maintenance", price: "$65" },
  { name: "Braids", description: "Protective styling and braids", price: "$70" },
],
  },
];

export default function Home() {
 const [selectedBarber, setSelectedBarber] = useState("");
const [selectedStyle, setSelectedStyle] = useState("");
  const [showLookBooking, setShowLookBooking] = useState(false);
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
  onClick={() => (window.location.href = "/login")}
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
            className="h-14 flex-1 rounded-xl bg-zinc-900 px-5 outline-none placeholder:text-zinc-500"
            placeholder="Search by city, ZIP code or hairstyle"
          />
<button
  onClick={() =>
    document.getElementById("barbers")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="min-h-12 rounded-xl bg-red-600 px-8 font-bold transition duration-200 hover:scale-[1.02] hover:bg-red-500"
>
  Find My Barber
</button>
        </div>
      </section>

     <section id="barbers" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8">
          <p className="font-bold uppercase tracking-widest text-red-500">
            Trending near you
          </p>
          <h3 className="mt-2 text-3xl font-black">Barbers worth booking</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {barbers.map((barber) => (
            <article
              key={barber.name}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="mb-6 flex h-40 items-center justify-center rounded-2xl bg-zinc-900 text-6xl">
                💈
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xl font-black">{barber.name}</h4>
                  <p className="mt-1 text-sm text-zinc-500">{barber.city}</p>
                </div>

                <span className="rounded-lg bg-yellow-500/10 px-2 py-1 text-sm font-bold text-yellow-400">
                  ★ {barber.rating}
                </span>
              </div>

              <p className="mt-5 text-zinc-300">{barber.specialty}</p>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <p className="font-bold">From {barber.price}</p>

                <button className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold hover:bg-red-500">
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
<section className="mx-auto max-w-6xl px-6 py-20">
  <div className="mb-8">
    <p className="font-bold uppercase tracking-widest text-red-500">
      Trending near you
    </p>
    <h2 className="mt-2 text-3xl font-black">Barbers worth booking</h2>
  </div>

  <div className="grid gap-6 md:grid-cols-3">
    {barbers.map((barber) => (
      <article
        key={barber.name}
      className="rounded-3xl border border-white/10 bg-zinc-950 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/10"
      >
      <div className="mb-6 h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
  <div className="flex h-full items-center justify-center text-center">
    <div>
      <div className="text-6xl">💈</div>
      <p className="mt-2 text-xs uppercase tracking-widest text-zinc-400">
        Barber Photo Coming Soon
      </p>
    </div>
  </div>
</div>
<div className="flex items-start justify-between gap-4">
  <div>
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-black">{barber.name}</h3>

      <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
        ✓ Verified
      </span>
    </div>

    <div className="mt-2 space-y-1">
      <p className="text-sm text-zinc-500">
        📍 {barber.city}
      </p>

      <p className="text-sm font-semibold text-green-400">
        🟢 Available Today • 4:30 PM
      </p>
    </div>
  </div>

  <span className="rounded-lg bg-yellow-500/10 px-2 py-1 text-sm font-bold text-yellow-400">
    ★ {barber.rating}
  </span>
</div>
        <p className="mt-5 text-zinc-300">{barber.specialty}</p>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <p className="font-bold">From {barber.price}</p>

          <button
  onClick={() => {
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

    <button className="text-sm font-semibold text-zinc-400 hover:text-white">
      View All →
    </button>
  </div>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[
      { style: "Low Fade", barber: "Fade District", likes: "2.4k" },
      { style: "Burst Fade", barber: "The Cut Society", likes: "1.8k" },
      { style: "Curly Taper", barber: "Crown and Clippers", likes: "1.3k" },
    ].map((cut) => (
      <article
        key={cut.style}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/20"
      >
        <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
          <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-bold backdrop-blur">
  ❤️ {cut.likes}
</div>
          <div className="text-center">
            <div className="text-6xl">✂️</div>
            <p className="mt-3 text-sm text-zinc-500">Photo coming soon</p>
          </div>
        </div>

        <div className="p-5">
<div className="flex items-start justify-between">

  <div>
    <div className="mb-2 inline-flex rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
      🔥 Trending
    </div>

    <h3 className="text-xl font-bold">{cut.style}</h3>

    <p className="mt-1 text-sm text-zinc-500">
      {cut.barber}
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
      ❤️ {cut.likes}
    </div>

    <button
  onClick={() => {
    setSelectedBarber(cut.barber);
    setSelectedStyle(cut.style);
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
  const barberSlugMap = {
  "Fade District": "fade-district",
  "The Cut Society": "the-cut-society",
  "Crown and Clippers": "crown-and-clippers",
};

const selectedBarberSlug =
  barberSlugMap[selectedBarber as keyof typeof barberSlugMap] ||
  "fade-district";

  setShowLookBooking(false);

  window.location.href = `/barber/${selectedBarberSlug}?style=${encodeURIComponent(
    selectedStyle
  )}&barber=${encodeURIComponent(selectedBarber)}`;
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
