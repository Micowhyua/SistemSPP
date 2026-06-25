import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// ===============================
// GET DATA SISWA
// ===============================
export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.replace("Bearer ", "");
    const user = verifyToken(token);

    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // ===== ADMIN: ambil semua siswa =====
    if (user.role === "admin") {
      const [rows] = await db.query(
        "SELECT id, nis, nama, kelas, photo FROM users WHERE role = 'siswa'"
      );
      return NextResponse.json({ siswa: rows });
    }

    // ===== SISWA: ambil data sendiri + tagihan =====
    if (user.role === "siswa") {
      const [studentRows] = await db.query(
        "SELECT id, nis, nama, kelas, photo FROM users WHERE id = ?",
        [user.id]
      );
      const student = studentRows[0];

      const [bills] = await db.query(
        "SELECT * FROM bills WHERE student_id = ?",
        [user.id]
      );

      return NextResponse.json({ student, bills });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// ===============================
// TAMBAH SISWA (Hanya Admin)
// ===============================
export async function POST(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.replace("Bearer ", "");
    const user = verifyToken(token);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { nis, nama, kelas, password } = await req.json();

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Tambah siswa baru
    await db.query(
      "INSERT INTO users (nis, nama, kelas, password_hash) VALUES (?, ?, ?, ?)",
      [nis, nama, kelas, hash]
    );

    // Ambil data siswa baru
    const [newStudentRows] = await db.query(
      "SELECT id, nis, nama, kelas FROM users WHERE nis = ?",
      [nis]
    );

    return NextResponse.json({ success: true, student: newStudentRows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
