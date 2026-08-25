"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
const returnTo = searchParams.get("returnTo") || "/bookings";
const role = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [barberName, setBarberName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    setMessage("");

    if (role === "barber" && !barberName.trim()) {
  setMessage("Please enter your barber or shop name.");
  setLoading(false);
  return;
}

   const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      role: role === "barber" ? "barber" : "customer",
      barber_name: role === "barber" ? barberName : null,
    },
  },
});

    if (error) {
      setMessage(error.message);
    } else {
    if (role === "barber") {
  setMessage(
    "Account created! Check your email to confirm your account, then sign in to finish your barber profile."
  );
} else {
  setMessage("Account created! Check your email to confirm your account.");
}
    }

    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
   } else {
  setMessage("You're signed in!");

 if (role === "barber") {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setMessage("Could not verify your account.");
    setLoading(false);
    return;
  }

  const { data: barber } = await supabase
    .from("barbers")
    .select("slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (barber) {
    window.location.href = "/barber-dashboard";
  } else {
    window.location.href = "/barber-setup";
  }
} else {
  window.location.href = returnTo;
}
}

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-md px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          BarberRadar
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome back
        </h1>

        <p className="mt-2 text-gray-400">
          Sign in or create your BarberRadar account.
        </p>

        <div className="mt-8 space-y-4">
         {role === "barber" && (
  <input
    type="text"
    placeholder="Barber or Shop Name"
    value={barberName}
    onChange={(e) => setBarberName(e.target.value)}
    className="w-full rounded-xl border border-gray-800 bg-zinc-950 px-4 py-4 text-white outline-none"
  />
)}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-red-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-red-500"
          />

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-4 font-bold hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Sign In"}
          </button>

          <button
            onClick={signUp}
            disabled={loading}
            className="w-full rounded-xl border border-red-600 px-4 py-4 font-bold text-red-500 hover:bg-red-600 hover:text-white disabled:opacity-50"
          >
            Create Account
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