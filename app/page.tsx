const barbers = [
  {
    name: "Fade District",
    city: "Los Angeles, CA",
    rating: "4.9",
    specialty: "Fades and beard sculpting",
    price: "$35",
  },
  {
    name: "The Cut Society",
    city: "Inglewood, CA",
    rating: "4.8",
    specialty: "Lineups and hair designs",
    price: "$30",
  },
  {
    name: "Crown and Clippers",
    city: "Long Beach, CA",
    rating: "4.9",
    specialty: "Locs, braids and tapers",
    price: "$40",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-black">
            BARBER<span className="text-red-500">RADAR</span>
          </h1>

          <button className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold">
            Barber Login
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-red-500">
          Find local talent
        </p>

        <h2 className="text-5xl font-black leading-tight md:text-7xl">
          Find the right barber
          <span className="block text-red-500">for your next cut.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Discover nearby barbers, view their work, compare prices and book with
          confidence.
        </p>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-3 md:flex-row">
          <input
            className="h-14 flex-1 rounded-xl bg-zinc-900 px-5 outline-none placeholder:text-zinc-500"
            placeholder="Search by city, ZIP code or hairstyle"
          />

          <button className="h-14 rounded-xl bg-red-600 px-8 font-bold hover:bg-red-500">
            Find My Barber
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
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

          <button className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold hover:bg-red-500">
            Book Now
          </button>
        </div>
      </article>
    ))}
  </div>
</section>
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        © 2026 BarberRadar. Find the cut. Book the barber.
      </footer>
    </main>
  );
}
