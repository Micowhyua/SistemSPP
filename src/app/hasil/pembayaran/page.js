"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PembayaranList() {
   const router = useRouter();
  const [data, setData] = useState([]);

  async function load() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tagihan/pembayaran", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    load();
  }, []);


  async function konfirmasi(id) {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/tagihan/pembayaran/konfirmasi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bill_id: id }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Pembayaran dikonfirmasi!");
    load(); // refresh data
  } else {
    alert(data.error);
  }
}


  return (
    <div className="p-6 max-w-5xl mx-auto">

  <button
          onClick={() => router.push("/petugas/tagihan")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={24} />
        </button>


      <h2 className="text-2xl font-bold mb-6 text-center">Daftar Pembayaran Masuk</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Siswa</th>
            <th className="p-3 border">Bulan</th>
            <th className="p-3 border">Tahun</th>
            <th className="p-3 border">Nominal</th>
            <th className="p-3 border">Dibayar</th>
            <th className="p-3 border">Bukti</th>
            <th className="p-3 border">pengajuan</th>
          </tr>
        </thead>

        <tbody>
  {data.map((p) => (
    <tr key={p.id}>
      <td className="p-3 border">{p.nama}</td>
      <td className="p-3 border">{p.bulan}</td>
      <td className="p-3 border">{p.tahun}</td>
      <td className="p-3 border">Rp {p.nominal}</td>
      <td className="p-3 border">{p.transaction_time || "-"}</td>

      <td className="p-3 border">
        {p.bukti_path ? (
          <a
            href={p.bukti_path}
            target="_blank"
            className="text-blue-600 underline"
          >
            Lihat Bukti
          </a>
        ) : (
          "-"
        )}
      </td>

      <td className="p-3 border">
       <button
  onClick={() => konfirmasi(p.bill_id)}
  className="bg-green-600 px-3 py-1 text-white rounded"
>
  Terima
</button>


      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
