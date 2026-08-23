"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Booking = {
  id: number;
  barber: string;
  service: string;
  date: string;
  time: string;
  status: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
const [notifications, setNotifications] = useState<any[]>([]);
const [showNotifications, setShowNotifications] = useState(false);

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
const { data: notificationData, error: notificationError } =
  await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

if (notificationError) {
  console.error("Error loading notifications:", notificationError);
} else {
  setNotifications(notificationData || []);
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

  const handleNotificationClick = async () => {
  const openingNotifications = !showNotifications;

  setShowNotifications(openingNotifications);

  if (!openingNotifications || unreadCount === 0) return;

  const supabase = createClient();

  const unreadIds = notifications
    .filter((notification) => !notification.read)
    .map((notification) => notification.id);

  if (unreadIds.length === 0) return;

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .in("id", unreadIds);

  if (error) {
    console.error("Error marking notifications as read:", error);
    return;
  }

  setNotifications((current) =>
    current.map((notification) => ({
      ...notification,
      read: true,
    }))
  );
};
const unreadCount = notifications.filter(
  (notification) => !notification.read
).length;


  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
       <div className="flex items-center justify-between">
  <p className="text-sm font-bold uppercase tracking-widest text-red-500">
    BarberRadar
  </p>

  <button
    onClick={handleNotificationClick}
    className="relative rounded-full border border-white/20 px-3 py-2 text-xl"
  >
    🔔

    {unreadCount > 0 && (
      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
        {unreadCount}
      </span>
    )}
  </button>
</div>
{showNotifications && (
  <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-4">
    <p className="mb-3 text-sm font-bold text-white">Notifications</p>

    {notifications.length === 0 ? (
      <p className="text-sm text-zinc-400">No notifications yet.</p>
    ) : (
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-xl border border-white/10 bg-black p-3"
          >
            <p className="text-sm text-zinc-200">
              {notification.message}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}
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

<a
  href="/"
  className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
>
  ← Home
</a>
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
                {booking.status === "confirmed"
  ? "✓ Confirmed"
  : "Waiting for barber confirmation"}
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