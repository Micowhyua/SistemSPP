"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TambahPetugas() {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async () => {
    const res = await fetch("/api/admin/petugas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nama, username, password }),
    });

    if (res.ok) {
      alert("Petugas berhasil ditambahkan");
      window.location.href = "/admin/petugas";
    } else {
      alert("Gagal menambahkan petugas");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">

 <Link href="/admin/petugas">
        <button className="p-2 rounded-full hover:bg-gray-200 transition shadow">
            <ArrowLeft />
          </button>
        </Link>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Petugas</h2>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <div>
          <label className="block font-semibold mb-1">Nama</label>
          <input
            placeholder="Nama lengkap"
            onChange={(e) => setNama(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Username</label>
          <input
            placeholder="Username login"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            placeholder="Password login"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          onClick={submitForm}
          className="bg-blue-600 w-full text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
