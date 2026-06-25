"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
    // Ambil data admin dari API
    const res = await fetch(`/api/admin/profileadmin?t=${Date.now()}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const data = await res.json();
    setAdmin(data.admin);
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header dengan foto profile */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Admin</h2>
          <p className="text-gray-600">Selamat datang di halaman admin.</p>
        </div>

        {/* Foto kecil admin clickable */}
       <img
  src={admin.photo ? `${admin.photo}?t=${Date.now()}` : "/default.jpg"}
  alt="Foto Admin"
  className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer"
  onClick={() => router.push("/admin/profile")}
/>

      </div>

      {/* Tombol navigasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => router.push("/admin/siswa")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Kelola Data Siswa
        </button>

        <button
          onClick={() => router.push("/admin/petugas")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Kelola Petugas SPP
        </button>
      </div>
    </div>
  );
}
