"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function EditBarberProfilePage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login?role=barber";
        return;
      }

      const { data: barber, error } = await supabase
        .from("barbers")
.select("name, location, specialty")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (error || !barber) {
        window.location.href = "/barber-setup";
        return;
      }

      setName(barber.name);
      setLocation(barber.location || "");
      setSpecialty(barber.specialty || "");
      setLoading(false);
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!name.trim()) {
      setMessage("Barber or shop name cannot be empty.");
      return;
    }

    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login?role=barber";
      return;
    }

    const { error } = await supabase
      .from("barbers")
    .update({
  name: name.trim(),
  location: location.trim() || null,
  specialty: specialty.trim() || null,
})
      .eq("owner_id", user.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile saved!");
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
          BARBERRADAR
        </p>

        <a
          href="/barber-dashboard"
          className="mt-4 inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold"
        >
          ← Dashboard
        </a>

        <h1 className="mt-6 text-4xl font-bold">
          Edit Profile
        </h1>

        <p className="mt-2 text-zinc-400">
          Update the information customers see on BarberRadar.
        </p>

        <div className="mt-8">
          <label className="text-sm font-semibold">
            Barber or Shop Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-red-500"
          />
        </div>

<div className="mt-6">
  <label className="text-sm font-semibold">
    Location
  </label>

  <input
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="City, State"
    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-red-500"
  />
</div>

<div className="mt-6">
  <label className="text-sm font-semibold">
    Specialty / About
  </label>

  <input
    value={specialty}
    onChange={(e) => setSpecialty(e.target.value)}
    placeholder="What are you known for?"
    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-red-500"
  />
</div>
        <button
          onClick={saveProfile}
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-red-500 px-4 py-4 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-zinc-300">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}