"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminSiswa() {
  const [siswa, setSiswa] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token tidak ditemukan, silakan login sebagai admin");
      return;
    }

    const res = await fetch("/api/admin/siswa", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      alert("Gagal mengambil data: " + res.status);
      return;
    }

    const data = await res.json();
    setSiswa(data.siswa || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const deleteSiswa = async (id) => {
    const yakin = confirm("Yakin ingin menghapus siswa ini?");
    if (!yakin) return;

    const res = await fetch(`/api/admin/siswa/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    const data = await res.json();
    alert(data.message);

    fetchData();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

         <Link href="/admin">
          <button className="p-2 rounded-full hover:bg-gray-200 transition shadow">
            <ArrowLeft />
          </button>
        </Link>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 ">Kelola Siswa</h2>

        <Link href="/admin/siswa/tambah">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition font-medium">
            <Plus size={18} />
            Tambah Siswa
          </button>
        </Link>
      </div>

      {/* CARD TABLE */}
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-3 font-semibold border">NIS</th>
              <th className="p-3 font-semibold border">Nama</th>
              <th className="p-3 font-semibold border">Kelas</th>
              <th className="p-3 font-semibold border w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {siswa.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-500 italic border"
                >
                  Belum ada data siswa.
                </td>
              </tr>
            )}

            {siswa.map((s) => (
              <tr
                key={s.id}
                className="text-center hover:bg-gray-50 transition"
              >
                <td className="border p-3">{s.nis ?? "-"}</td>
                <td className="border p-3 font-medium text-gray-800">
                  {s.nama ?? "-"}
                </td>
                <td className="border p-3">{s.kelas ?? "-"}</td>

                <td className="border p-3">
                  <div className="flex justify-center gap-3">
                    <Link href={`/admin/siswa/edit/${s.id}`}>
                      <button className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition text-xs shadow">
                        <Pencil size={14} /> Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => deleteSiswa(s.id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition text-xs shadow"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
