"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";


export default function BarberProfilePage() {
  const [showBooking, setShowBooking] = useState(false);
    const [selectedService, setSelectedService] = useState("Haircut");
  const [selectedTime, setSelectedTime] = useState("2:00 PM");
    const [selectedDate, setSelectedDate] = useState("Wed 12");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const searchParams = useSearchParams();
    const params = useParams();
const slug = String(params.slug);
const saveBooking = async () => {
  const booking = {
    barber: slug,
    service: selectedService,
    date: selectedDate,
    time: selectedTime,
  };
  const supabase = createClient();

const { error } = await supabase
  .from("bookings")
  .insert([booking]);

if (error) {
  console.error("Supabase booking error:", error);
  return;
}

  const existingBookings = JSON.parse(
    localStorage.getItem("barberRadarBookings") || "[]"
  );

  const updatedBookings = [...existingBookings, booking];

  localStorage.setItem(
    "barberRadarBookings",
    JSON.stringify(updatedBookings)
  );

  setBookingConfirmed(true);
};

const barberProfiles = {
  "fade-district": {
    name: "Fade District",
    city: "Los Angeles, CA",
    rating: "4.9",
    specialty: "Fades and beard sculpting",
    price: "$35",
    services: [
      { name: "Haircut", description: "Clean cut, lineup and styling", price: "$35" },
      { name: "Haircut + Beard", description: "Haircut, beard shaping and lineup", price: "$50" },
      { name: "Kids Cut", description: "Ages 12 and under", price: "$25" },
    ],
  availability: {
    dates: ["Fri 14", "Sat 15", "Sun 16"],
    times: ["2:00 PM", "2:30 PM", "3:00 PM"],
  },
  },

  "the-cut-society": {
    name: "The Cut Society",
    city: "Inglewood, CA",
    rating: "4.8",
    specialty: "Lineups and hair designs",
    price: "$30",
    services: [
      { name: "Haircut", description: "Lineup, styling and finishing", price: "$30" },
      { name: "Hair Design", description: "Custom linework and designs", price: "$45" },
      { name: "Kids Cut", description: "Ages 12 and under", price: "$25" },
    ],
    availability: {
  dates: ["Fri 14", "Sat 15", "Mon 17"],
  times: ["1:00 PM", "3:30 PM", "5:00 PM"],
},
  },

  "crown-and-clippers": {
    name: "Crown and Clippers",
    city: "Long Beach, CA",
    rating: "4.9",
    specialty: "Locs, braids and tapers",
    price: "$40",
    services: [
      { name: "Haircut", description: "Taper, cleanup and styling", price: "$40" },
      { name: "Loc Maintenance", description: "Loc cleanup and maintenance", price: "$65" },
      { name: "Braids", description: "Protective styling and braids", price: "$70" },
    ],
    availability: {
  dates: ["Sat 15", "Sun 16", "Tue 18"],
  times: ["10:00 AM", "12:30 PM", "4:00 PM"],
},
  },
};

const profile =
  barberProfiles[slug as keyof typeof barberProfiles] ||
  barberProfiles["fade-district"];

const profileName = profile.name;

const bookedStyle = searchParams.get("style");
const bookedBarber = searchParams.get("barber");
 useEffect(() => {
  const style = bookedStyle?.toLowerCase() ?? "";

  if (style.includes("beard")) {
    setSelectedService("Haircut + Beard");
  } else if (style.includes("kid")) {
    setSelectedService("Kids Cut");
  } else {
    setSelectedService("Haircut");
  }
}, [bookedStyle]);   
return (
    <main className="min-h-screen bg-black text-white">
      {/* Cover */}
      <div className="h-72 w-full bg-zinc-900"></div>

      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="-mt-16 flex items-end gap-6">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-black bg-zinc-800 text-5xl">
            💈
          </div>

          <div className="pb-4">
            <h1 className="text-5xl font-black">
  {bookedBarber || profileName}
</h1>

            <p className="mt-2 text-zinc-400">
             ⭐ {profile.rating} • {profile.city} • ✅ Verified
            </p>
          </div>
        </div>
{bookedStyle && (
  <section className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
    <p className="text-sm font-bold uppercase tracking-widest text-red-400">
      💈 You&apos;re Booking This Look
    </p>

    <h2 className="mt-2 text-3xl font-black">
      {bookedStyle}
    </h2>

    {bookedBarber && (
      <p className="mt-2 text-zinc-300">
        by <span className="font-semibold text-white">{bookedBarber}</span>
      </p>
    )}
  </section>
)}
        {/* About */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <h2 className="text-2xl font-bold">About</h2>

          <p className="mt-4 leading-8 text-zinc-400">
            {profile.specialty}
          </p>
        </section>

        {/* Services */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <h2 className="text-2xl font-bold">Services</h2>

          <div className="mt-6 divide-y divide-white/10">
  {profile.services.map((service) => (
    <div
      key={service.name}
      className="flex items-center justify-between py-4"
    >
      <div>
        <p className="font-semibold">{service.name}</p>
        <p className="text-sm text-zinc-500">
          {service.description}
        </p>
      </div>

      <span className="font-bold">{service.price}</span>
    </div>
  ))}
</div>
        </section>
{/* Availability */}
<section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-8">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-red-500">
        Availability
      </p>
      <h2 className="mt-2 text-2xl font-bold">Available Today</h2>
    </div>

    <span className="text-sm font-semibold text-green-400">
      🟢 Open
    </span>
  </div>

  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
    {["2:00 PM", "2:30 PM", "3:00 PM", "4:30 PM"].map((time) => (
      <button
        key={time}
        className="rounded-xl border border-white/10 bg-black px-4 py-3 font-semibold transition hover:border-red-500 hover:bg-red-500/10"
      >
        {time}
      </button>
    ))}
  </div>
  </section>
{/* Portfolio */}
<section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-8">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-red-500">
        Portfolio
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Recent Cuts
      </h2>
    </div>

    <span className="text-sm text-zinc-500">
      6 photos
    </span>
  </div>

  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
    {[
      "Low Fade",
      "Taper",
      "Beard Sculpt",
      "Burst Fade",
      "Kids Cut",
      "Lineup",
    ].map((style) => (
      <div
        key={style}
        className="group flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"
      >
        <div className="text-center transition duration-300 group-hover:scale-105">
          <div className="text-5xl">✂️</div>

          <p className="mt-3 text-sm font-semibold text-zinc-300">
            {style}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Photo coming soon
          </p>
        </div>
      </div>
    ))}
  </div>
</section>
        {/* Book Button */}
        <button
  onClick={() => setShowBooking(true)}
  className="fixed bottom-8 right-8 rounded-2xl bg-red-600 px-8 py-5 text-lg font-bold"
>
  Book Now
</button>
      </div>
    {showBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-900 p-8">

     <div className="mb-6">
  <p className="text-sm font-bold uppercase tracking-widest text-red-400">
    💈 Book This Look
  </p>

  <h2 className="mt-2 text-3xl font-bold">
    {bookedStyle || "Book Appointment"}
  </h2>

  <p className="mt-2 text-zinc-400">
    You're booking with{" "}
    <span className="font-bold text-white">
      {bookedBarber || profileName}
    </span>
  </p>
</div>

      <div className="mt-6 space-y-3">
        <input
          className="w-full rounded-xl bg-black border border-white/10 p-3"
          placeholder="Your Name"
        />

        <input
          className="w-full rounded-xl bg-black border border-white/10 p-3"
          placeholder="Phone Number"
        />
      </div>
<div className="mt-6">
  <p className="mb-3 font-semibold">Choose a Service</p>

  <div className="space-y-3">
    {profile.services.map((service) => (
      <button
        key={service.name}
        type="button"
        onClick={() => setSelectedService(service.name)}
        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
          selectedService === service.name
            ? "border-red-500 bg-red-500/10"
            : "border-white/10 bg-black hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
              selectedService === service.name
                ? "border-red-500"
                : "border-zinc-600"
            }`}
          >
            {selectedService === service.name && (
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </span>

          <span className="font-semibold">{service.name}</span>
        </div>

        <span className="font-bold">{service.price}</span>
      </button>
    ))}
  </div>
</div>
     {/* Choose a Date */}
<div className="mt-6">
  <p className="mb-3 font-semibold">Choose a Date</p>

  <div className="flex gap-3 overflow-x-auto pb-2">
    {profile.availability.dates.map((date) => (
      <button
        key={date}
        type="button"
        onClick={() => setSelectedDate(date)}
        className={`min-w-[84px] rounded-xl border px-4 py-3 font-semibold transition ${
          selectedDate === date
            ? "border-red-500 bg-red-500/10"
            : "border-white/10 bg-black hover:border-white/20"
        }`}
      >
        {date}
      </button>
    ))}
  </div>
</div>
{/* Choose a Time */}
<div className="mt-6">
  <p className="mb-3 font-semibold">Choose a Time</p>

  <div className="grid grid-cols-3 gap-3">
   {profile.availability.times.map((time) => {
  const savedBookings = JSON.parse(
    localStorage.getItem("barberRadarBookings") || "[]"
  );

  const isBooked = savedBookings.some(
    (booking: any) =>
      booking.barber === slug &&
      booking.date === selectedDate &&
      booking.time === time
  );

  return (
    <button
      key={time}
      type="button"
      disabled={isBooked}
      onClick={() => !isBooked && setSelectedTime(time)}
      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
        isBooked
          ? "cursor-not-allowed border-white/5 bg-white/5 text-zinc-600"
          : selectedTime === time
          ? "border-red-500 bg-red-500/10"
          : "border-white/10 bg-black hover:border-white/20"
      }`}
    >
      {isBooked ? "Booked" : time}
    </button>
  );
})}
  </div>
</div>

{/* Cancel / Continue */}
<div className="mt-8 flex gap-3">
  <button
    onClick={() => setShowBooking(false)}
    className="flex-1 rounded-xl border border-white/10 py-3"
  >
    Cancel
  </button>

  <button
  onClick={() => setShowConfirmation(true)}
  className="flex-1 rounded-xl bg-red-600 py-3 font-bold"
>
  Continue
</button>
</div>
          
     

    </div>
  </div>
)}
   {showConfirmation && !bookingConfirmed && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-red-400">
        Appointment Summary
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {bookedStyle || "Your Appointment"}
      </h2>

      <p className="mt-2 text-zinc-400">
        with{" "}
        <span className="font-bold text-white">
          {bookedBarber || profileName}
        </span>
      </p>

      <div className="mt-6 space-y-4 rounded-2xl bg-black p-5">
        <div className="flex justify-between">
          <span className="text-zinc-400">Service</span>
          <span className="font-semibold">{selectedService}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">Date</span>
          <span className="font-semibold">{selectedDate}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">Time</span>
          <span className="font-semibold">{selectedTime}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowConfirmation(false)}
          className="flex-1 rounded-xl border border-white/10 py-3"
        >
          Back
        </button>

        <button
        onClick={saveBooking}
          className="flex-1 rounded-xl bg-red-600 py-3 font-bold hover:bg-red-500"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
)}
{bookingConfirmed && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-6 text-center">

      <div className="text-5xl">✅</div>

      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-red-400">
        Booking Confirmed
      </p>

      <h2 className="mt-2 text-3xl font-black">
        You're all set!
      </h2>

      <p className="mt-4 text-zinc-400">
        Your appointment with{" "}
        <span className="font-bold text-white">
          {bookedBarber || profileName}
        </span>{" "}
        is booked for{" "}
        <span className="font-bold text-white">{selectedDate}</span>{" "}
        at{" "}
        <span className="font-bold text-white">{selectedTime}</span>.
      </p>

      <p className="mt-3 font-semibold">
        {selectedService}
      </p>

      <button
        onClick={() => {
          setBookingConfirmed(false);
          setShowConfirmation(false);
          setShowBooking(false);
        }}
        className="mt-6 w-full rounded-xl bg-red-600 py-3 font-bold hover:bg-red-500"
      >
        Done
      </button>

    </div>
  </div>
)}
    </main>
  );
}