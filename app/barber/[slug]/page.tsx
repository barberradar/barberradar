"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";


export default function BarberProfilePage() {
  const [showBooking, setShowBooking] = useState(false);
    const [selectedService, setSelectedService] = useState("Haircut");
  const [selectedTime, setSelectedTime] = useState("2:00 PM");
    const [selectedDate, setSelectedDate] = useState("Wed 12");
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
   const [dbProfile, setDbProfile] = useState<{
  name: string;
  location: string | null;
  specialty: string | null;
} | null>(null);
const [profileLoading, setProfileLoading] = useState(true);
const [dbServices, setDbServices] = useState<
  {
    id: number;
    service_name: string;
    price: number;
    description: string | null;
  }[]
>([]);
const [dbAvailability, setDbAvailability] = useState<any[]>([]);
const [dbPortfolio, setDbPortfolio] = useState<any[]>([]);
const [selectedPortfolioCut, setSelectedPortfolioCut] = useState<any | null>(null);
    const searchParams = useSearchParams();
    const params = useParams();
const slug = String(params.slug);
useEffect(() => {
  const loadBarberProfile = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("barbers")
    .select("name, location, specialty")
      .eq("slug", slug)
      .maybeSingle();
      console.log("BARBER PROFILE DEBUG:", { slug, data, error });

    if (!error && data) {
      setDbProfile(data);
    }
    const { data: servicesData, error: servicesError } = await supabase
  .from("barber_services")
  .select("id, service_name, price, description")
  .eq("barber_slug", slug)
  .order("id", { ascending: true });

if (!servicesError && servicesData) {
  setDbServices(servicesData);
}

const { data: availabilityData, error: availabilityError } = await supabase
  .from("barber_availability")
  .select("*")
  .eq("barber_slug", slug)
  .eq("is_available", true)
  .order("id", { ascending: true });

if (availabilityError) {
  console.error("Barber availability error:", availabilityError);
} else {
  setDbAvailability(availabilityData || []);
}
const { data: portfolioData, error: portfolioError } = await supabase
  .from("barber_portfolio")
  .select("*")
  .eq("barber_slug", slug)
  .order("created_at", { ascending: false });

if (portfolioError) {
  console.error("Barber portfolio error:", portfolioError);
} else {
  setDbPortfolio(portfolioData || []);
}
setProfileLoading(false);
  };

  loadBarberProfile();
}, [slug]);
useEffect(() => {
  const resumeBooking = searchParams.get("resumeBooking");

  if (resumeBooking !== "true") return;

  const service = searchParams.get("service");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (service) setSelectedService(service);
  if (date) setSelectedDate(date);
  if (time) setSelectedTime(time);

  setShowBooking(true);
  setShowConfirmation(true);
}, [searchParams]);

useEffect(() => {
  const loadBookedTimes = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.rpc("get_booked_times", {
      p_barber: slug,
      p_date: selectedDate,
    });

    if (error) {
      console.error("Error loading booked times:", {
  message: error.message,
  details: error.details,
  hint: error.hint,
  code: error.code,
});
      setBookedTimes([]);
      return;
    }

    setBookedTimes(
      (data || []).map(
        (row: { booked_time: string }) => row.booked_time
      )
    );
  };

  loadBookedTimes();
}, [slug, selectedDate]);
const saveBooking = async () => {
 const supabase = createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  const returnTo =
    `/barber/${slug}` +
    `?service=${encodeURIComponent(selectedService)}` +
    `&date=${encodeURIComponent(selectedDate)}` +
    `&time=${encodeURIComponent(selectedTime)}` +
    `&resumeBooking=true`;

  window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  return;
}
const selectedServiceData = profile.services.find(
  (service) => service.name === selectedService
);

const selectedPrice = Number(
  selectedServiceData?.price.replace("$", "") || 0
);

const booking = {
  barber: slug,
  service: selectedService,
  date: selectedDate,
  time: selectedTime,
  price: selectedPrice,
  user_id: user.id,
};

const { error } = await supabase
  .from("bookings")
  .insert([booking]);

if (error) {
  console.error("Supabase booking error:", error);

  if (error.code === "23505") {
    alert("That time was just booked by someone else. Please choose another time.");

    setBookedTimes((current) => [
      ...new Set([...current, selectedTime]),
    ]);

    setShowConfirmation(false);
    return;
  }

  alert("Something went wrong while booking. Please try again.");
  return;
}

  setBookedTimes((current) => [
  ...new Set([...current, selectedTime]),
]);


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
  barberProfiles[slug as keyof typeof barberProfiles];

const profileName = dbProfile?.name || profile?.name || "Barber";
const profileLocation = dbProfile?.location || profile?.city || "";

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
const availabilityByDay = dbAvailability.reduce((groups, slot) => {
  const day = slot.day;

  if (!groups[day]) {
    groups[day] = [];
  }

  groups[day].push(slot);

  return groups;
}, {} as Record<string, any[]>);  

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

if (profileLoading) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-400">Loading barber...</p>
      </div>
    </main>
  );
}

return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 pt-6">
  <a
    href="/"
    className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
  >
    ← Home
  </a>
</div>
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
⭐ {profile?.rating || "New"} · {profileLocation} · ✅ Verified
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
{dbProfile?.specialty || profile?.specialty || "Barber services"}
</p>
        </section>

        {/* Services */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <h2 className="text-2xl font-bold">Services</h2>

          <div className="mt-6 divide-y divide-white/10">
 {(dbServices.length > 0 ? dbServices : profile.services).map((service) => (
    <div
      key={"service_name" in service ? service.service_name : service.name}
      className="flex items-center justify-between py-4"
    >
      <div>
        <p className="font-semibold">
  {"service_name" in service ? service.service_name : service.name}
</p>
        <p className="text-sm text-zinc-500">
          {service.description}
        </p>
      </div>

     <span className="font-bold">
  {"service_name" in service ? `$${service.price}` : service.price}
</span>
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
   <h2 className="mt-2 text-2xl font-bold">
  {dbAvailability.length > 0
  ? "Available This Week"
  : "No Availability"}
</h2>
    </div>

    <span className="text-sm font-semibold text-green-400">
      🟢 Open
    </span>
  </div>



 <div className="mt-6 space-y-6">
{Object.entries(availabilityByDay).map(([day, slots]) => {
  const daySlots = slots as any[];

  return (
    <div key={day}>
      <h3 className="mb-3 text-lg font-semibold">{day}</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {daySlots.map((slot) => {
          const time = slot.time;
          const isBooked = bookedTimes.includes(time);

          return (
            <button
              key={slot.id}
              type="button"
              disabled={isBooked}
              onClick={() => {
                if (isBooked) return;

                setSelectedDate(day);
                setSelectedTime(time);
                setShowBooking(true);
              }}
              className={`rounded-xl border px-4 py-3 font-semibold transition ${
                isBooked
                  ? "cursor-not-allowed border-white/5 bg-white/5 text-zinc-600"
                  : "border-white/10 bg-black hover:border-white/20"
              }`}
            >
              {isBooked ? "Booked" : time}
            </button>
          );
        })}
      </div>
    </div>
    );
})}
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
      {dbPortfolio.length} {dbPortfolio.length === 1 ? "photo" : "photos"}
    </span>
  </div>

  {dbPortfolio.length === 0 ? (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black p-8 text-center">
      <p className="text-sm text-zinc-500">
        No recent cuts uploaded yet.
      </p>
    </div>
  ) : (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
      {dbPortfolio.map((cut) => (
       <button
  key={cut.id}
  type="button"
  onClick={() => setSelectedPortfolioCut(cut)}
  className="group overflow-hidden rounded-2xl border border-white/10 bg-black text-left"
>
          <img
            src={cut.image_url}
            alt={cut.title || "Recent cut"}
            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
          />

          <div className="p-4">
            <p className="text-sm font-semibold text-zinc-200">
              {cut.title || "Recent Cut"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
  {getTimeAgo(cut.created_at)}
</p>
      </div>
    </button>
      ))}
    </div>
  )}
</section>
        {/* Book Button */}
 <button
  disabled={dbAvailability.length === 0}
  onClick={() => {
    if (dbAvailability.length === 0) return;
    setSelectedDate(dbAvailability[0]?.day || "");
    setSelectedTime(dbAvailability[0]?.time || "");
    setShowBooking(true);
  }}
  className={`fixed bottom-8 right-8 rounded-2xl px-8 py-5 text-lg font-bold ${
    dbAvailability.length === 0
      ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
      : "bg-red-600 text-white hover:bg-red-500"
  }`}
>
  {dbAvailability.length === 0 ? "No Availability" : "Book Now"}
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
   {Object.keys(availabilityByDay).map((day) => (
  <button
    key={day}
    type="button"
    onClick={() => {
      setSelectedDate(day);

      const firstSlot = availabilityByDay[day]?.[0];

      if (firstSlot) {
        setSelectedTime(firstSlot.time);
      }
    }}
    className={`min-w-[84px] rounded-xl border px-4 py-3 font-semibold transition ${
      selectedDate === day
        ? "border-red-500 bg-red-500/10"
        : "border-white/10 bg-black hover:border-white/20"
    }`}
  >
    {day}
  </button>
))}
  </div>
</div>
{/* Choose a Time */}
<div className="mt-6">
  <p className="mb-3 font-semibold">Choose a Time</p>

  <div className="grid grid-cols-3 gap-3">
{(availabilityByDay[selectedDate] ?? []).map((slot: any) => {
  const time = slot.time;
  const isBooked = bookedTimes.includes(time);

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

{selectedPortfolioCut && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    onClick={() => setSelectedPortfolioCut(null)}
  >
    <div
      className="relative w-full max-w-3xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setSelectedPortfolioCut(null)}
        className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-4 py-2 text-xl text-white"
      >
        ×
      </button>

      <img
        src={selectedPortfolioCut.image_url}
        alt={selectedPortfolioCut.title || "Recent cut"}
        className="max-h-[85vh] w-full rounded-2xl object-contain"
      />

      <div className="mt-3 text-center">
        <p className="font-semibold text-white">
          {selectedPortfolioCut.title || "Recent Cut"}
        </p>

        <p className="mt-1 text-sm text-zinc-400">
          {getTimeAgo(selectedPortfolioCut.created_at)}
        </p>
        <button
  type="button"
  onClick={() => {
  if (selectedPortfolioCut.service_name) {
    setSelectedService(selectedPortfolioCut.service_name);
  }

  setSelectedPortfolioCut(null);
  setShowBooking(true);
}}

  className="mt-4 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-400"
>
  Book this look
</button>
      </div>
    </div>
  </div>
)}

    </main>
  );
}