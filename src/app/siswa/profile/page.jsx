"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState({});
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const res = await fetch("/api/siswa/profile", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      cache: "no-store",
    });
    const data = await res.json();
    setProfile(data.profile);
  }

  async function uploadPhoto() {
    const form = new FormData();
    form.append("photo", photo);
      alert("Foto Berhasil diperbarui!");

    await fetch("/api/siswa/profile/photo", {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: form,
      cache: "no-store",
      
    });

    await loadProfile();
  }

  async function changePassword() {
    await fetch("/api/siswa/profile", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    alert("Password diperbarui!");
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6 border border-gray-200 relative">

      {/* HEADER + Back + Logout */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/siswa")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-2xl font-bold text-black text-center flex-1">
          Profil Siswa
        </h2>

        <button
          onClick={logout}
          className="text-red-600 hover:text-red-800"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* FOTO */}
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
          <div className="cursor-pointer  w-auto text-center bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700">
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

      {/* INFO SISWA */}
      <div className="space-y-2 text-lg">
        <p className="text-gray-600">
          Nama: <b className="text-black">{profile?.nama}</b>
        </p>
        <p className="text-gray-600">
          Kelas: <b className="text-black">{profile?.kelas}</b>
        </p>
        <p className="text-gray-600">
          NIS: <b className="text-black">{profile?.nis}</b>
        </p>
      </div>

      <hr className="my-5" />

      {/* Ganti Password */}
      <h3 className="text-xl font-semibold text-black mb-2">
        Ganti Password
      </h3>

      <input
        type="password"
        placeholder="Password Baru"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-3"
      />

      <button
        onClick={changePassword}
        className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700"
      >
        Update Password
      </button>
    </div>
  );
}
