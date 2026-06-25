"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditSiswa() {
  const { id } = useParams();
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!id) return;

    async function getSiswa() {
      const res = await fetch(`/api/admin/siswa/${id}`);
      const data = await res.json();

      if (data.siswa) {
        setNama(data.siswa.nama ?? "");
        setNis(data.siswa.nis ?? "");
        setKelas(data.siswa.kelas ?? "");
      }
    }

    getSiswa();
  }, [id]);

  const submitEdit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/admin/siswa/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ nama, nis, kelas, password }),
    });

    const data = await res.json();

    alert(data.message);
    router.push("/admin/siswa");
    router.refresh();
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/siswa">
          <button className="p-2 rounded-full hover:bg-gray-200 transition shadow">
            <ArrowLeft />
          </button>
        </Link>

        <h2 className="text-2xl font-bold text-gray-800">Edit Siswa</h2>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={submitEdit}
        className="bg-white p-6 shadow-xl rounded-2xl border space-y-5"
      >
        {/* Nama */}
        <div>
          <label className="font-medium text-gray-700">Nama</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* NIS */}
        <div>
          <label className="font-medium text-gray-700">NIS</label>
          <input
            value={nis}
            onChange={(e) => setNis(e.target.value)}
            className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Kelas */}
        <div>
          <label className="font-medium text-gray-700">Kelas</label>
          <input
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="font-medium text-gray-700">Password  </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Kosongkan jika tidak diganti"
          />
        </div>

        {/* TOMBOL SUBMIT */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition shadow"
        >
          <Save size={20} />
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
