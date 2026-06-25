import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// ===============================
// GET PROFILE
// ===============================
export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(auth.replace("Bearer ", ""));
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Ambil profil siswa
   const [rows] = await db.query(
  "SELECT id, nis, nama, kelas, photo FROM users WHERE id = ?",
  [user.id]
);


    if (rows.length === 0)
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });

    // Ambil tagihan siswa
    const [bills] = await db.query(
      `SELECT id, bulan, tahun, nominal, status, paid_at
       FROM bills
       WHERE student_id = ?
       ORDER BY tahun DESC, bulan DESC`,
      [user.id]
    );

    return NextResponse.json({
      profile: rows[0],     // 🔥 ini yang frontend butuhkan
      bills
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



// ===============================
// UPDATE PASSWORD SAJA
// ===============================
export async function PUT(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(auth.replace("Bearer ", ""));
    if (!user || user.role !== "siswa")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { password } = await req.json();

    if (!password)
      return NextResponse.json({ error: "Password tidak boleh kosong" }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);

    await db.query(
  "UPDATE users SET password_hash = ? WHERE id = ?",
  [hash, user.id]
);


    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
