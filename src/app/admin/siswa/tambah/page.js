"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function TambahSiswa() {
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan, silakan login ulang");
      return;
    }

    const res = await fetch("/api/admin/siswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nis, nama, kelas, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Siswa berhasil ditambahkan");
      window.location.href = "/admin/siswa";
    } else {
      alert(data.message || data.error || "Gagal menambah siswa");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/siswa">
          <button className="p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft />
          </button>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Tambah Siswa</h2>
      </div>

      {/* CARD FORM */}
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 space-y-5">
        {/* NIS */}
        <div>
          <label className="font-medium text-gray-700">NIS</label>
          <input
            type="text"
            value={nis}
            onChange={(e) => setNis(e.target.value)}
            className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan NIS"
          />
        </div>

        {/* Nama */}
        <div>
          <label className="font-medium text-gray-700">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan nama siswa"
          />
        </div>

        {/* Kelas */}
        <div>
          <label className="font-medium text-gray-700">Kelas</label>
          <input
            type="text"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="cth: XII-RPL 2"
          />
        </div>

        {/* Password */}
        <div>
          <label className="font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan password"
          />
        </div>

        {/* Submit */}
        <button
          onClick={submitForm}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition shadow"
        >
          <Save size={20} />
          Simpan
        </button>
      </div>
    </div>
  );
}
