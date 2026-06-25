"use client";

import { useEffect, useState } from "react";

export default function AdminTagihan() {
  const [list, setList] = useState([]);
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [nominal, setNominal] = useState("");

  const [profile, setProfile] = useState(null);

  async function loadProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/petugas/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProfile(data.profile);
  }

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tagihan/list", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    fetchData();
    loadProfile();
  }, []);


  const submit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tagihan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bulan, tahun, nominal }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Tagihan berhasil ditambahkan untuk semua siswa");
      fetchData();
    } else {
      alert(data.error || "Gagal");
    }
  };

    useEffect(() => {
    fetchData();
    loadProfile();

    // polling otomatis setiap 5 detik,tapi akan berubah kalo sudah lewat 5 detik
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval); // bersihkan saat unmount
  }, []);
  

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Kelola Tagihan SPP</h2>
<div className="absolute top-3 right-3">
    <a href="/petugas/profile">
      <img
            src={profile?.photo || "/default-avatar.png"}
            className="w-10 h-10 rounded-full border shadow cursor-pointer hover:opacity-80"
            alt="Profile"
          />
    </a>
  </div>
  </div>

      {/* FORM */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4">Tambah Tagihan Bulanan</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Bulan</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              placeholder="Contoh: Januari"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tahun</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              placeholder="2025"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Nominal</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="600000"
            />
          </div>
        </div>

        <button
          onClick={submit}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
        >
          Tambah
        </button>
      </div>

      <div className="flex gap-3">
  <a
    href="/hasil/pembayaran"
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
  > Cek Pembayaran Siswa
  </a>
</div>


      {/* TABLE */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Daftar Tagihan</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Siswa</th>
                <th className="p-3 border">Bulan</th>
                <th className="p-3 border">Tahun</th>
                <th className="p-3 border">Nominal</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Dibayar Pada</th>
              </tr>
            </thead>
            <tbody>
              {list.map((tg) => (
                <tr key={tg.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{tg.nama}</td>
                  <td className="p-3 border">{tg.bulan}</td>
                  <td className="p-3 border">{tg.tahun}</td>
                  <td className="p-3 border">Rp {tg.nominal}</td>
                 <td
                    className={`p-3 border font-semibold ${
                      tg.status === "belum"
                        ? "text-red-600"
                        : tg.status === "menunggu"
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {tg.status}
                  </td>

                  <td className="p-3 border">{tg.paid_at || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
