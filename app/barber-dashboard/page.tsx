"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function BarberDashboard() {
    const [barberName, setBarberName] = useState("");
const [bookings, setBookings] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [services, setServices] = useState<any[]>([]);
const [showAddService, setShowAddService] = useState(false);
const [newServiceName, setNewServiceName] = useState("");
const [newServicePrice, setNewServicePrice] = useState("");
const [newServiceDescription, setNewServiceDescription] = useState("");
const [savingService, setSavingService] = useState(false);
const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
const [editServiceName, setEditServiceName] = useState("");
const [editServicePrice, setEditServicePrice] = useState("");
const [editServiceDescription, setEditServiceDescription] = useState("");
const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);
const [availability, setAvailability] = useState<any[]>([]);
const [newAvailabilityDay, setNewAvailabilityDay] = useState("");
const [newAvailabilityTime, setNewAvailabilityTime] = useState("");
const [savingAvailability, setSavingAvailability] = useState(false);

const [editingAvailabilityId, setEditingAvailabilityId] = useState<number | null>(null);
const [editAvailabilityDay, setEditAvailabilityDay] = useState("");
const [editAvailabilityTime, setEditAvailabilityTime] = useState("");

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
    const { data: serviceData, error: serviceError } = await supabase
  .from("barber_services")
  .select("*")
  .eq("barber_slug", barber.slug)
  .order("id", { ascending: true });

if (serviceError) {
  console.error("Barber services error:", serviceError);
} else {
  setServices(serviceData || []);
}
const { data: availabilityData, error: availabilityError } = await supabase
  .from("barber_availability")
  .select("*")
  .eq("barber_slug", barber.slug)
  .order("id", { ascending: true });

if (availabilityError) {
  console.error("Barber availability error:", availabilityError);
} else {
  setAvailability(availabilityData || []);
}
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
const addService = async () => {
  if (!newServiceName.trim() || !newServicePrice.trim()) return;

  setSavingService(true);

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setSavingService(false);
    return;
  }

  const { data: barber, error: barberError } = await supabase
    .from("barbers")
    .select("slug")
    .eq("owner_id", user.id)
    .single();

  if (barberError || !barber) {
    console.error("Barber lookup error:", barberError);
    setSavingService(false);
    return;
  }

  const { data, error } = await supabase
    .from("barber_services")
    .insert({
      barber_slug: barber.slug,
      service_name: newServiceName.trim(),
      price: Number(newServicePrice),
      description: newServiceDescription.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Add service error:", error);
    setSavingService(false);
    return;
  }

  setServices((current) => [...current, data]);
  setNewServiceName("");
  setNewServicePrice("");
  setNewServiceDescription("");
  setShowAddService(false);
  setSavingService(false);
};
const saveServiceEdit = async () => {
  if (
    editingServiceId === null ||
    !editServiceName.trim() ||
    !editServicePrice.trim()
  ) {
    return;
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("barber_services")
    .update({
      service_name: editServiceName.trim(),
      price: Number(editServicePrice),
      description: editServiceDescription.trim() || null,
    })
    .eq("id", editingServiceId)
    .select()
    .single();

  if (error) {
    console.error("Edit service error:", error);
    return;
  }

  setServices((current) =>
    current.map((service) =>
      service.id === editingServiceId ? data : service
    )
  );

  setEditingServiceId(null);
};
const deleteService = async (serviceId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this service?"
  );

  if (!confirmed) return;

  const supabase = createClient();

  const { error } = await supabase
    .from("barber_services")
    .delete()
    .eq("id", serviceId);

  if (error) {
    console.error("Delete service error:", error);
    return;
  }

  setServices((current) =>
    current.filter((service) => service.id !== serviceId)
  );

  setEditingServiceId(null);
};
const addAvailability = async () => {
  if (!newAvailabilityDay.trim() || !newAvailabilityTime.trim()) return;

  setSavingAvailability(true);

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setSavingAvailability(false);
    return;
  }

  const { data: barber, error: barberError } = await supabase
    .from("barbers")
    .select("slug")
    .eq("owner_id", user.id)
    .single();

  if (barberError || !barber) {
    console.error("Availability barber error:", barberError);
    setSavingAvailability(false);
    return;
  }

  const { data, error } = await supabase
    .from("barber_availability")
    .insert({
      barber_slug: barber.slug,
      day: newAvailabilityDay.trim(),
      time: newAvailabilityTime.trim(),
      is_available: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Add availability error:", error);
    setSavingAvailability(false);
    return;
  }

  setAvailability((current) => [...current, data]);

  setNewAvailabilityDay("");
  setNewAvailabilityTime("");
  setSavingAvailability(false);
};
const deleteAvailability = async (slotId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to remove this availability?"
  );

  if (!confirmed) return;

  const supabase = createClient();

  const { error } = await supabase
    .from("barber_availability")
    .delete()
    .eq("id", slotId);

  if (error) {
    console.error("Delete availability error:", error);
    return;
  }

  setAvailability((current) =>
    current.filter((slot) => slot.id !== slotId)
  );
};

const saveAvailabilityEdit = async () => {
  if (
    editingAvailabilityId === null ||
    !editAvailabilityDay.trim() ||
    !editAvailabilityTime.trim()
  ) {
    return;
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("barber_availability")
    .update({
      day: editAvailabilityDay.trim(),
      time: editAvailabilityTime.trim(),
    })
    .eq("id", editingAvailabilityId);

  if (error) {
    console.error("Edit availability error:", error);
    return;
  }

  setAvailability((current) =>
    current.map((slot) =>
      slot.id === editingAvailabilityId
        ? {
            ...slot,
            day: editAvailabilityDay.trim(),
            time: editAvailabilityTime.trim(),
          }
        : slot
    )
  );

  setEditingAvailabilityId(null);
  setEditAvailabilityDay("");
  setEditAvailabilityTime("");
};

const signOut = async () => {
  const supabase = createClient();

  await supabase.auth.signOut();

  window.location.href = "/";
};
const updateBookingStatus = async (
  bookingId: number,
  newStatus: string
) => {
  const supabase = createClient();

  const booking = bookings.find(
    (booking) => booking.id === bookingId
  );

  const { error } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId);

  if (error) {
    console.error("Status update error:", error);
    return;
  }

  if (newStatus === "cancelled" && booking?.user_id) {
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: booking.user_id,
          type: "booking_cancelled",
          message: `Your appointment with ${barberName} for ${booking.service} on ${booking.date} at ${booking.time} was cancelled by the barber.`,
        },
      ]);

    if (notificationError) {
      console.error(
        "Cancellation notification error:",
        notificationError
      );
    }
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


<div className="flex items-center justify-between">
  <a
    href="/"
    className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white"
  >
    ← Home
  </a>

  <button
    onClick={signOut}
    className="rounded-xl border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white"
  >
    Log Out
  </button>
</div>
        <div className="mt-4">
          <h1 className="text-4xl font-bold">
  Welcome back, {barberName}
</h1>

          <p className="mt-2 text-zinc-400">
            Manage your appointments and business.
          </p>
        </div>

<a
  href="/barber-profile/edit"
  className="mt-5 inline-flex rounded-xl border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white"
>
  Edit Profile
</a>
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
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-bold">Manage Services</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Add, edit, or remove the services customers can book.
      </p>
    </div>
   <button
  onClick={() => setShowAddService(true)}
  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
>
  + Add Service
</button>
  </div>
{showAddService && (
  <div className="mt-6 rounded-xl border border-zinc-800 bg-black p-4">
    <div className="grid gap-4">
      <input
        value={newServiceName}
        onChange={(e) => setNewServiceName(e.target.value)}
        placeholder="Service name"
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
      />

      <input
        value={newServicePrice}
        onChange={(e) => setNewServicePrice(e.target.value)}
        placeholder="Price"
        type="number"
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
      />

      <input
        value={newServiceDescription}
        onChange={(e) => setNewServiceDescription(e.target.value)}
        placeholder="Description"
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
      />

     <button
  onClick={addService}
  disabled={savingService}
  className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
>
  {savingService ? "Saving..." : "Save Service"}
</button>


<button
  onClick={() => setShowAddService(false)}
  className="rounded-xl border border-zinc-700 px-4 py-3 font-semibold"
>
  Cancel
</button>
    </div>
  </div>
)}
  <div className="mt-6 space-y-3">
    {services.length === 0 ? (
      <p className="text-zinc-500">No services added yet.</p>
    ) : (
      services.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black p-4"
        >
          <div>
            <p className="font-semibold">{service.service_name}</p>

            {service.description && (
              <p className="mt-1 text-sm text-zinc-400">
                {service.description}
              </p>
            )}
          </div>

    <div className="flex items-center gap-3">
  <p className="font-bold">${service.price}</p>

  <button
    onClick={() => {
      setEditingServiceId(service.id);
      setEditServiceName(service.service_name);
      setEditServicePrice(String(service.price));
      setEditServiceDescription(service.description || "");
    }}
    className="rounded-lg border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-400"
  >
    Edit
  </button>
</div>
{editingServiceId === service.id && (
  <div className="mt-4 grid gap-3 border-t border-zinc-800 pt-4">
    <input
      value={editServiceName}
      onChange={(e) => setEditServiceName(e.target.value)}
      placeholder="Service name"
      className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
    />

    <input
      value={editServicePrice}
      onChange={(e) => setEditServicePrice(e.target.value)}
      placeholder="Price"
      type="number"
      className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
    />

    <input
      value={editServiceDescription}
      onChange={(e) => setEditServiceDescription(e.target.value)}
      placeholder="Description"
      className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
    />

<button
  onClick={saveServiceEdit}
  className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white"
>
  Save Changes
</button>

    <button
      onClick={() => setEditingServiceId(null)}
      className="rounded-xl border border-zinc-700 px-4 py-3 font-semibold"
    >
      Cancel
    </button>

    <button
  onClick={() => deleteService(service.id)}
  className="rounded-xl border border-red-500/60 px-4 py-3 font-semibold text-red-400"
>
  Delete Service
</button>
  </div>
)}
        </div>
      ))
    )}
  </div>
</section>

<section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-bold">Manage Availability</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Add or remove the times customers can book.
      </p>
    </div>
  </div>
<div className="mt-6 grid gap-3 md:grid-cols-3">
  <input
    value={newAvailabilityDay}
    onChange={(e) => setNewAvailabilityDay(e.target.value)}
    placeholder="Day, e.g. Monday"
    className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
  />

  <input
    value={newAvailabilityTime}
    onChange={(e) => setNewAvailabilityTime(e.target.value)}
    placeholder="Time, e.g. 2:00 PM"
    className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
  />

  <button
    onClick={addAvailability}
    disabled={savingAvailability}
    className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
  >
    {savingAvailability ? "Adding..." : "+ Add Availability"}
  </button>
</div>
  <div className="mt-6 space-y-3">
    {availability.length === 0 ? (
      <p className="text-zinc-500">No availability added yet.</p>
    ) : (
     availability.map((slot) => (
  <div
    key={slot.id}
    className="rounded-xl border border-zinc-800 bg-black p-4"
  >
    {editingAvailabilityId === slot.id ? (
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={editAvailabilityDay}
          onChange={(e) => setEditAvailabilityDay(e.target.value)}
          placeholder="Day, e.g. Monday"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          value={editAvailabilityTime}
          onChange={(e) => setEditAvailabilityTime(e.target.value)}
          placeholder="Time, e.g. 2:00 PM"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
        />

        <button
          type="button"
          onClick={saveAvailabilityEdit}
          className="rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white"
        >
          Save
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingAvailabilityId(null);
            setEditAvailabilityDay("");
            setEditAvailabilityTime("");
          }}
          className="rounded-lg border border-zinc-700 px-4 py-3 text-sm font-semibold text-white"
        >
          Cancel
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{slot.day}</p>
          <p className="text-sm text-zinc-400">{slot.time}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-green-400">
            {slot.is_available ? "Available" : "Unavailable"}
          </span>

          <button
            type="button"
            onClick={() => {
              setEditingAvailabilityId(slot.id);
              setEditAvailabilityDay(slot.day);
              setEditAvailabilityTime(slot.time);
            }}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-white"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => deleteAvailability(slot.id)}
            className="rounded-lg border border-red-500/60 px-3 py-2 text-sm font-semibold text-red-400"
          >
            Remove
          </button>
        </div>
      </div>
    )}
  </div>
))
    )}
  </div>
</section>

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