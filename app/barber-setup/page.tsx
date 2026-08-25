"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function BarberSetupPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  const checkExistingProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login?role=barber";
      return;
    }

    const { data: existingBarber } = await supabase
      .from("barbers")
      .select("slug")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (existingBarber) {
      window.location.href = "/barber-dashboard";
    }
  };

  checkExistingProfile();
}, []);

  const createBarberProfile = async () => {
    setLoading(true);
    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your barber or shop name.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login?role=barber";
      return;
    }
    const { data: existingBarber } = await supabase
  .from("barbers")
  .select("slug")
  .eq("owner_id", user.id)
  .maybeSingle();

if (existingBarber) {
  window.location.href = "/barber-dashboard";
  return;
}

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error } = await supabase.from("barbers").insert({
      name: name.trim(),
      slug,
      owner_id: user.id,
    });

    if (error) {
      console.error("Barber setup error:", error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/barber-dashboard";
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          BarberRadar
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Set up your barber profile
        </h1>

        <p className="mt-2 text-gray-400">
          Tell us the name customers should see on BarberRadar.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Barber or Shop Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-zinc-950 px-4 py-4 text-white outline-none"
          />

          <button
            onClick={createBarberProfile}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-4 font-bold hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Creating profile..." : "Continue"}
          </button>

          {message && (
            <p className="pt-2 text-center text-sm text-gray-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}