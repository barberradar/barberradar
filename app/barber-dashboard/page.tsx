"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function BarberDashboard() {
    const [barberName, setBarberName] = useState("");
const [bookings, setBookings] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const loadDashboard = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: barber, error: barberError } = await supabase
      .from("barbers")
      .select("slug, name")
      .eq("owner_id", user.id)
      .single();

    if (barberError || !barber) {
      console.error("Barber profile error:", barberError);
      setLoading(false);
      return;
    }

    setBarberName(barber.name);

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("barber", barber.slug)
      .order("created_at", { ascending: false });

    if (bookingError) {
      console.error("Barber bookings error:", bookingError);
      setLoading(false);
      return;
    }

    setBookings(bookingData || []);
    setLoading(false);
  };

  loadDashboard();
}, []);
const updateBookingStatus = async (
  bookingId: number,
  newStatus: string
) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId);

  if (error) {
    console.error("Status update error:", error);
    return;
  }

  setBookings((current) =>
    current.map((booking) =>
      booking.id === bookingId
        ? { ...booking, status: newStatus }
        : booking
    )
  );
};
const reopenSlot = async (bookingId: number) => {
  const supabase = createClient();

  const { error } = await supabase
  .from("bookings")
  .update({ status: "reopened" })
  .eq("id", bookingId);

  if (error) {
    console.error("Reopen slot error:", error);
    return;
  }

  setBookings((current) =>
  current.map((booking) =>
    booking.id === bookingId
      ? { ...booking, status: "reopened" }
      : booking
  )
);
};
const activeBookings = bookings.filter(
  (booking) =>
    booking.status !== "cancelled" &&
    booking.status !== "reopened"
);

const upcomingCount = activeBookings.length;
const today = new Date();

const todayLabel = today.toLocaleDateString("en-US", {
  weekday: "short",
  day: "numeric",
});

const todaysAppointments = activeBookings.filter(
  (booking) => booking.date === todayLabel
);

const todayCount = todaysAppointments.length;

const earnings = activeBookings.reduce(
  (total, booking) => total + Number(booking.price || 0),
  0
);
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <p className="text-sm font-bold tracking-[0.2em] text-red-500">
          BARBERRADAR
        </p>

        <div className="mt-4">
          <h1 className="text-4xl font-bold">
            Barber Dashboard
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your appointments and business.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-400">
              Today's Appointments
            </p>
           <p className="mt-2 text-3xl font-bold">{todayCount}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-400">
              Upcoming
            </p>
            <p className="mt-2 text-3xl font-bold">{upcomingCount}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-400">
              Earnings
            </p>
           <p className="mt-2 text-3xl font-bold">${earnings}</p>
          </div>

        </div>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-bold">
            Upcoming Appointments
          </h2>

          {bookings.length === 0 ? (
  <p className="mt-4 text-zinc-500">
    No upcoming appointments yet.
  </p>
) : (
  <div className="mt-4 space-y-4">
 {activeBookings.map((booking) => (
      <div
        key={booking.id}
        className="rounded-xl border border-zinc-800 bg-black p-4"
      >
        <p className="font-bold text-white">
          {booking.service}
        </p>

        <p className="mt-2 text-zinc-400">
          Date: {booking.date}
        </p>

        <p className="text-zinc-400">
          Time: {booking.time}
        </p>
    {booking.status === "cancelled" ? (
  <div className="mt-4 flex flex-wrap gap-3">
    <span className="rounded-xl border border-red-600 px-4 py-2 font-semibold text-red-400">
      ✕ Cancelled
    </span>

    <button
      onClick={() => reopenSlot(booking.id)}
      className="rounded-xl border border-yellow-500 px-4 py-2 font-semibold text-yellow-400"
    >
      Reopen Slot
    </button>
  </div>

) : (
  <div className="mt-4 flex flex-wrap gap-3">
    {booking.status === "confirmed" ? (
      <span className="rounded-xl border border-green-600 px-4 py-2 font-semibold text-green-400">
        ✓ Confirmed
      </span>
    ) : (
      <button
        onClick={() => updateBookingStatus(booking.id, "confirmed")}
        className="rounded-xl border border-green-600 px-4 py-2 font-semibold text-green-400 transition hover:bg-green-600/10"
      >
        Confirm
      </button>
    )}

    <button
      onClick={() => updateBookingStatus(booking.id, "cancelled")}
      className="rounded-xl border border-red-600 px-4 py-2 font-semibold text-red-400 transition hover:bg-red-600/10"
    >
      Cancel Appointment
    </button>
  </div>
)}
  </div>
))}
</div>
)}     
        </section>

      </div>
    </main>
  );
}