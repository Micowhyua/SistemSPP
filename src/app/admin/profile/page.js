"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft,LogOut } from "lucide-react";


export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState({});
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    // Ganti endpoint sesuai API kamu
    const res = await fetch(`/api/admin/profileadmin?t=${Date.now()}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const data = await res.json();
    setAdmin(data.admin);
  }

  async function uploadPhoto() {
    
    if (!photo) return alert("Pilih foto dulu!");

    const form = new FormData();
    form.append("photo", photo);
    alert("Foto Berhasil diperbarui!");

   const res = await fetch(`/api/admin/profileadmin?t=${Date.now()}`, {
  method: "POST",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  body: form,

  
});
const data = await res.json();
setAdmin((prev) => ({
  ...prev,
  photo: data.photo, // ambil foto baru dari server
}));
setPreview(null);

  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6 border border-gray-200">
      
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-2xl font-bold text-black text-center flex-1">
          Profil Admin
        </h2>

        <button
          onClick={() => router.push("/login")}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          <LogOut size={24} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <img
          src={
            preview
              ? preview
              : admin.photo
              ? `${admin.photo}?t=${Date.now()}`
              : "/default.jpg"
          }
          className="w-32 h-32 rounded-full border-2 border-gray-300 shadow cursor-pointer"
          onClick={() => router.push("/admin/profile")}
        />

        <label className="w-full">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              setPhoto(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <div className="cursor-pointer w-auto text-center bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700">
            Pilih Foto
          </div>
        </label>

        {photo && (
          <button
            onClick={uploadPhoto}
            className="mt-2 bg-blue-600 px-4 py-2 rounded text-white"
          >
            Upload Foto
          </button>
        )}
      </div>

      <hr className="my-5" />

      <p><b>Nama:</b> {admin.nama}</p>
      <p><b>Username:</b> {admin.username}</p>
    </div>
  );
}
