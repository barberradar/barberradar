"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Booking = {
  id: number;
  barber: string;
  service: string;
  date: string;
  time: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const signOut = async () => {
  const supabase = createClient();

  await supabase.auth.signOut();

  window.location.href = "/login";
};

  useEffect(() => {
  const loadBookings = async () => {
    const supabase = createClient();

    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/login";
  return;
}

const { data, error } = await supabase
  .from("bookings")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading bookings:", error);
      return;
    }

    setBookings(data || []);
  };

  loadBookings();
}, []);


const cancelBooking = async (indexToRemove: number) => {
  const bookingToRemove = bookings[indexToRemove];

  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingToRemove.id);

  if (error) {
    console.error("Error cancelling booking:", error);
    return;
  }

  setBookings(
    bookings.filter((booking) => booking.id !== bookingToRemove.id)
  );
};

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          BarberRadar
        </p>
        <div className="mt-6 flex items-center gap-3">
  <a
    href="/"
    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:border-red-500 hover:text-red-400"
  >
    Find a Barber
  </a>

  <button
    onClick={signOut}
    className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
  >
    Sign Out
  </button>
</div>

        <h1 className="mt-2 text-4xl font-black">
          My Bookings
        </h1>

        <p className="mt-2 text-zinc-400">
          Your upcoming appointments.
        </p>

        <div className="mt-8 space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-zinc-400">
                You don't have any bookings yet.
              </p>
            </div>
          ) : (
            bookings.map((booking, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-6"
              >
                <p className="text-sm uppercase tracking-widest text-red-400">
                  Upcoming Appointment
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                {booking.barber
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")}
                </h2>

                <div className="mt-4 space-y-2 text-zinc-300">
                  <p>
                    <span className="text-zinc-500">Service:</span>{" "}
                    {booking.service}
                  </p>

                  <p>
                    <span className="text-zinc-500">Date:</span>{" "}
                    {booking.date}
                  </p>

                  <p>
                    <span className="text-zinc-500">Time:</span>{" "}
                    {booking.time}
                  </p>
                </div>
                <button
  onClick={() => cancelBooking(index)}
  className="mt-5 w-full rounded-xl border border-red-500/40 px-4 py-3 font-bold text-red-400 transition hover:bg-red-500/10"
>
  Cancel Appointment
</button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}