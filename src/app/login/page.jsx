"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.error) return setError(data.error);

    localStorage.setItem("token", data.token);

    if (data.role === "admin") router.push("/admin");
    else if (data.role === "petugas") router.push("/petugas/tagihan");
    else if (data.role === "siswa") router.push("/siswa");
  }

  return (
    <div className="flex min-h-screen">
      {/* ================= IMAGE SECTION ================= */}
      <div className="w-1/2 h-screen">
        <img
          src="https://assets.kompasiana.com/items/album/2025/07/07/1000413742-686be742ed6415774c38d8c4.jpg?t=o&v=770" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* ================= FORM SECTION ================= */}
      <div className="w-1/2 flex items-center justify-center bg-white relative">
        
        {/* Tombol panah kembali */}
        <button
          className="absolute top-6 left-6 p-2 border rounded-full hover:bg-gray-100"
          onClick={() => router.push("/")} // arahkan ke halaman utama kamu
        >
          <ArrowLeft size={22} />
        </button>

        <div className="w-full max-w-md px-10">
          <h1 className="text-3xl font-bold text-center mb-10 text-[#0a2a55]">
            Masuk Akun
          </h1>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">NIS / Username</p>
              <input
                placeholder="NIS / Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Password</p>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Masuk
            </button>
          </form>

          {error && (
            <p className="mt-4 text-red-500 text-center font-semibold">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
