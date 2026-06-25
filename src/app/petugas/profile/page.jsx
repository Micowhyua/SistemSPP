"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PetugasProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null); // preview foto langsung

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const res = await fetch(`/api/petugas/profile?t=${Date.now()}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const data = await res.json();
    setProfile(data.profile);
  }

  async function uploadPhoto() {
    if (!photo) return alert("Pilih foto dulu!");

    const form = new FormData();
    form.append("photo", photo);

    await fetch(`/api/petugas/profile/photo?t=${Date.now()}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: form,
    });

      alert("Foto Berhasil diperbarui!");

    // Update foto langsung tanpa refresh
    setProfile((prev) => ({
      ...prev,
      photo: prev.photo + "?t=" + Date.now(),
    }));

    loadProfile();
  }

  async function changePassword() {
    const res = await fetch("/api/petugas/profile", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok) alert("Password diperbarui!");
    else alert(data.error);
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6 border border-gray-200">
      
      {/* Header: back - title - logout */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/petugas/tagihan")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-2xl font-bold text-black text-center flex-1">
          Profil Petugas
        </h2>

        <button
          onClick={() => router.push("/login")}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Foto dan upload */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={
            preview
              ? preview
              : profile.photo
              ? `${profile.photo}?t=${Date.now()}`
              : "/default.jpg"
          }
          className="w-32 h-32 rounded-full border-2 border-blue-400 shadow"
        />

        <label className="w-full">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              setPhoto(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <div className="cursor-pointer w-auto text-center bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700">
            Pilih Foto
          </div>
        </label>

        {photo && (
          <button
            onClick={uploadPhoto}
            className="mt-2 bg-blue-600 px-4 py-2 rounded text-white"
          >
            Upload Foto
          </button>
        )}
      </div>

      <hr className="my-5" />

      <p><b>Nama:</b> {profile.nama}</p>
      <p><b>Username:</b> {profile.username}</p>

      <hr className="my-5" />

      <h3 className="text-xl font-semibold">Ganti Password</h3>

      <input
        type="password"
        className="border px-3 py-2 w-full rounded mt-2"
        placeholder="Password Baru"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={changePassword}
        className="mt-3 bg-green-600 px-4 py-2 rounded text-white"
      >
        Update Password
      </button>
    </div>
  );
}
