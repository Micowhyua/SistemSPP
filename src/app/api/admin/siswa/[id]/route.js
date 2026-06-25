import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// ====================
// GET DETAIL SISWA
// ====================
export async function GET(req, { params }) {
  try {
   const { id } = await params; 

    const [rows] = await db.query(
      "SELECT id, nama, nis, kelas FROM users WHERE id = ?",
      [id]
    );

    return NextResponse.json({ siswa: rows[0] || null });

  } catch (err) {
    console.error("GET DETAIL ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ====================
// UPDATE SISWA
// ====================
export async function PUT(req, { params }) {
  try {
    const { id } = await params; 
    const { nama, nis, kelas, password } = await req.json();

    if (!password) {
      await db.query(
        "UPDATE users SET nama=?, nis=?, kelas=? WHERE id=?",
        [nama, nis, kelas, id]
      );
    } else {
      const hash = await bcrypt.hash(password, 10);
      await db.query(
        "UPDATE users SET nama=?, nis=?, kelas=?, password_hash=? WHERE id=?",
        [nama, nis, kelas, hash, id]
      );
    }

    return NextResponse.json({ message: "Siswa berhasil diupdate" });

  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: "Server PUT error" }, { status: 500 });
  }
}

// ====================
// DELETE SISWA
// ====================
export async function DELETE(req, { params }) {
  try {
const { id } = await params; 
    await db.query("DELETE FROM users WHERE id=?", [id]);

    return NextResponse.json({ message: "User berhasil dihapus" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Server DELETE error" }, { status: 500 });
  }
}
