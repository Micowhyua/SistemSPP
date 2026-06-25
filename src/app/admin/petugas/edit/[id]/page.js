"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function EditPetugas() {
  const { id } = useParams();
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!id) return;

    async function getPetugas() {
      const res = await fetch(`/api/admin/petugas/${id}`);
      const data = await res.json();

      if (data.petugas) {
        setNama(data.petugas.nama);
        setUsername(data.petugas.username);
      }
    }

    getPetugas();
  }, [id]);

  const submitEdit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("nama", nama);
    form.append("username", username);
    form.append("password", password);

    const res = await fetch(`/api/admin/petugas/${id}`, {
      method: "PUT",
      body: form,
    });

    const data = await res.json();
    alert(data.message);
    router.push("/admin/petugas");
  };

  return (
    <div className="max-w-xl mx-auto p-6">

        <Link href="/admin/petugas">
        <button className="p-2 rounded-full hover:bg-gray-200 transition shadow">
            <ArrowLeft />
          </button>
        </Link>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Petugas</h2>

      <form
        onSubmit={submitEdit}
        className="bg-white p-6 rounded-xl shadow border space-y-4"
      >
        <div>
          <label className="font-semibold block mb-1">Nama</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">
            Password Baru (Opsional)
          </label>
          <input
            type="password"
            placeholder="Kosongkan jika tidak diganti"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
