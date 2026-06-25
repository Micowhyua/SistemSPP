"use client";

import { ArrowLeft,Plus,Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function PagePetugas() {
  const [petugas, setPetugas] = useState([]);

  async function getPetugas() {
    const res = await fetch("/api/admin/petugas", {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    setPetugas(data.petugas || []);
  }

  useEffect(() => {
    getPetugas();
  }, []);

  const deletePetugas = async (id) => {
    if (!confirm("Yakin ingin menghapus petugas ini?")) return;

    const res = await fetch(`/api/admin/petugas/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    await res.json();
    getPetugas();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

<Link href="/admin"> 
<button className="p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft />
          </button>
</Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 ">Kelola Petugas</h2>

        <Link href="/admin/petugas/tambah">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition font-medium">
            <Plus size={18} />
            Tambah Petugas
          </button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-hidden rounded-xl shadow border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-3">Nama</th>
              <th className="border p-3">Username</th>
              <th className="border p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {petugas.map((p) => (
              <tr key={p.id} className="text-center hover:bg-gray-50 transition">
                <td className="border p-3">{p.nama ?? ""}</td>
                <td className="border p-3">{p.username ?? ""}</td>

                <td className="border p-3 flex justify-center gap-3">
                  <Link href={`/admin/petugas/edit/${p.id}`}>
                      <button className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition text-xs shadow">
                        <Pencil size={14} /> Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => deletePetugas(p.id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition text-xs shadow"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                </td>
              </tr>
            ))}

            {petugas.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-4 text-gray-500 italic border"
                >
                  Tidak ada data petugas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
