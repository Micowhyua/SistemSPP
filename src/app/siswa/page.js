"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SiswaDashboard() {
  const [profile, setProfile] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [nis, setNis] = useState("");
  const [password, setPassword] = useState("");
  const [proof, setProof] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/siswa/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setProfile(data.profile);
      setBills(data.bills);
      if (data.profile) setNis(data.profile.nis);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPayModal = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const sendPayment = async () => {
    setSending(true);

    const token = localStorage.getItem("token");
    const form = new FormData();

    form.append("bill_id", selectedBill.id);
    form.append("password", password);
    form.append("bukti", proof);

    const res = await fetch("/api/tagihan/bayar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const data = await res.json();
    setSending(false);

    if (res.ok && data.success) {
      alert("Pembayaran berhasil!");
      setShowModal(false);
      setPassword("");
      setProof(null);
      fetchData();
    } else {
      alert(data.error || "Gagal mengirim pembayaran");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-5 max-w-3xl mx-auto relative">

      <div className="absolute top-4 right-4">
        <Link href="/siswa/profile">
          <img
            src={(profile?.photo || "/default-avatar.png") + `?t=${Date.now()}`}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-105 transition"
            alt="Profile"
          />
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6 mt-14 border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Selamat datang, {profile?.nama || "Siswa"} 👋
        </h2>
        <p className="text-gray-600">Nama: <b>{profile?.nama}</b></p>
        <p className="text-gray-600">Jurusan: <b>{profile?.kelas}</b></p>
        <p className="text-gray-600">NIS: <b>{profile?.nis}</b></p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Tagihan</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-2">Bulan</th>
              <th className="border p-2">Tahun</th>
              <th className="border p-2">Nominal</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{bill.bulan}</td>
                <td className="border p-2">{bill.tahun}</td>
                <td className="border p-2 text-green-700 font-semibold">
                  Rp {bill.nominal}
                </td>
                <td className="border p-2">
  {bill.status === "belum" && (
    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
      Belum
    </span>
  )}

  {bill.status === "menunggu" && (
    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
      Menunggu Konfirmasi
    </span>
  )}

  {bill.status === "lunas" && (
    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
      Lunas
    </span>
  )}
</td>


                <td className="border p-2">
  {bill.status === "belum" ? (
    <button
      onClick={() => openPayModal(bill)}
      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
    >
      Bayar
    </button>
  ) : bill.status === "menunggu" ? (
    <span className="text-yellow-600 text-xs">Diproses</span>
  ) : (
    "-"
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 border">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Pembayaran</h3>

            <p><b>Bulan:</b> {selectedBill.bulan}</p>
            <p><b>Nominal:</b> Rp {selectedBill.nominal}</p>

            <div className="mt-4">
              <label className="text-sm">NIS:</label>
              <input
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full border p-2 rounded text-sm mt-1"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded text-sm mt-1"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm">Upload Bukti:</label>
              <input
                type="file"
                onChange={(e) => setProof(e.target.files[0])}
                className="w-full text-sm mt-1"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={sendPayment}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                disabled={sending}
              >
                {sending ? "Mengirim..." : "Kirim"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500 transition"
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}