"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function EditBarberProfilePage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [slug, setSlug] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
const [headerImageUrl, setHeaderImageUrl] = useState("");
const [profileFile, setProfileFile] = useState<File | null>(null);
const [headerFile, setHeaderFile] = useState<File | null>(null);
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
.select("slug, name, location, specialty, profile_image_url, header_image_url")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (error || !barber) {
        window.location.href = "/barber-setup";
        return;
      }

      setName(barber.name);
      setLocation(barber.location || "");
      setSpecialty(barber.specialty || "");
      setSlug(barber.slug);
      setProfileImageUrl(barber.profile_image_url || "");
setHeaderImageUrl(barber.header_image_url || "");
      setLoading(false);
    };

    loadProfile();
  }, []);
const uploadImage = async (
  file: File,
  imageType: "profile" | "header"
) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${slug}/${imageType}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("barber-portfolio")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("barber-portfolio")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

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
let nextProfileImageUrl = profileImageUrl;
let nextHeaderImageUrl = headerImageUrl;

try {
  if (profileFile) {
    nextProfileImageUrl = await uploadImage(profileFile, "profile");
  }

  if (headerFile) {
    nextHeaderImageUrl = await uploadImage(headerFile, "header");
  }
} catch (uploadError) {
  setMessage(
    uploadError instanceof Error
      ? uploadError.message
      : "Image upload failed."
  );
  setSaving(false);
  return;
}

    const { error } = await supabase
      .from("barbers")
    .update({
  name: name.trim(),
  location: location.trim() || null,
  specialty: specialty.trim() || null,
  profile_image_url: nextProfileImageUrl || null,
header_image_url: nextHeaderImageUrl || null,
})
      .eq("owner_id", user.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
}
 setProfileImageUrl(nextProfileImageUrl);
setHeaderImageUrl(nextHeaderImageUrl);
setProfileFile(null);
setHeaderFile(null);
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
<div className="mt-6">
  <label className="text-sm font-semibold">Profile Photo</label>

  {profileImageUrl && (
    <img
      src={profileImageUrl}
      alt="Current profile"
      className="mt-3 h-24 w-24 rounded-full object-cover"
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
    className="mt-2 block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white"
  />
</div>

<div className="mt-6">
  <label className="text-sm font-semibold">Header Image</label>

  {headerImageUrl && (
    <img
      src={headerImageUrl}
      alt="Current header"
      className="mt-3 h-32 w-full rounded-xl object-cover"
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setHeaderFile(e.target.files?.[0] || null)}
    className="mt-2 block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white"
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