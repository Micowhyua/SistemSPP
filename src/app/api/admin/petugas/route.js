import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// ===============================
// GET - Ambil semua petugas
// ===============================
export async function GET() {
  try {
    const [rows] = await db.query("SELECT id, nama, username FROM petugas");
    return NextResponse.json({ petugas: rows });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil data petugas" },
      { status: 500 }
    );
  }
}

// ===============================
// POST - Tambah petugas baru
// ===============================
export async function POST(req) {
  try {
    const { nama, username, password } = await req.json();

    if (!nama || !username || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // cek username duplikat
    const [exist] = await db.query(
      "SELECT id FROM petugas WHERE username = ? LIMIT 1",
      [username]
    );

    if (exist.length > 0) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO petugas (nama, username, password) VALUES (?,?,?)",
      [nama, username, hash]
    );

    return NextResponse.json({ message: "Petugas berhasil ditambahkan" });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal menambah petugas" },
      { status: 500 }
    );
  }
}
