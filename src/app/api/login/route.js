import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { username, password } = await req.json();

  // ============================================
  // 1. Cek ADMIN dulu
  // ============================================
  const [adminRows] = await db.query(
    "SELECT * FROM admin WHERE username = ? LIMIT 1",
    [username]
  );

  if (adminRows.length > 0) {
    const admin = adminRows[0];
    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return NextResponse.json({ error: "Password salah" });
    }

    const token = createToken({
      id: admin.id,
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      role: "admin",
      token,
    });
  }

  // ============================================
  // 2. Cek PETUGAS SPP
  // ============================================
  const [petugasRows] = await db.query(
    "SELECT * FROM petugas WHERE username = ? LIMIT 1",
    [username]
  );

  if (petugasRows.length > 0) {
    const petugas = petugasRows[0];
    const valid = await bcrypt.compare(password, petugas.password);

    if (!valid) {
      return NextResponse.json({ error: "Password salah" });
    }

    const token = createToken({
      id: petugas.id,
      role: "petugas",
    });

    return NextResponse.json({
      success: true,
      role: "petugas",
      token,
    });
  }

  // ============================================
  // 3. Jika bukan admin & petugas → cek SISWA
  // ============================================
  const [siswaRows] = await db.query(
    "SELECT * FROM users WHERE nis = ? LIMIT 1",
    [username]
  );

  if (siswaRows.length === 0) {
    return NextResponse.json({ error: "Akun tidak ditemukan" });
  }

  const siswa = siswaRows[0];
  const valid = await bcrypt.compare(password, siswa.password_hash);

  if (!valid) {
    return NextResponse.json({ error: "Password salah" });
  }

  const token = createToken({
    id: siswa.id,
    role: "siswa",
  });

  return NextResponse.json({
    success: true,
    role: "siswa",
    token,
  });
}
