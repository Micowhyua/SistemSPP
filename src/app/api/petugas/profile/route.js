import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ==========================
// GET PROFILE PETUGAS
// ==========================
export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(auth.replace("Bearer ", ""));
    if (!user || user.role !== "petugas") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Ambil profil siswa
   const [rows] = await db.query(
  "SELECT id, username, nama, photo FROM petugas WHERE id = ?",
  [user.id]
);


    return NextResponse.json({ profile: rows[0] });
  } catch (err) {
    console.error("GET petugas error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ==========================
// UPDATE PASSWORD PETUGAS
// ==========================
export async function PUT(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.replace("Bearer ", "");
    const petugas = verifyToken(token);

    const body = await req.json();
    const hashed = await bcrypt.hash(body.password, 10);

    await db.execute(
      "UPDATE petugas SET password = ? WHERE id = ?",
      [hashed, petugas.id]
    );

    return NextResponse.json({ message: "Password diperbarui" });
  } catch (err) {
    console.error("PUT petugas error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
