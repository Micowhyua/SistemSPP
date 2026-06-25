// 📌 Lokasi file: /lib/action.js

import { db } from "./db";                // ← dari /lib/db.js
import bcrypt from "bcryptjs";
import { 
  LoginSchema, 
  BuatSiswaSchema, 
  BayarSchema 
} from "./validation";                    // ← dari /lib/validation.js
import { createToken } from "./auth";     // ← dari /lib/auth.js

// =======================
// LOGIN
// =======================
export async function loginAction(formData) {
  const { nis, password } = formData;

  // === 1. ADMIN ===
  const [adminRows] = await db.query(
    "SELECT * FROM admin WHERE username = ? LIMIT 1",
    [nis]
  );

  if (adminRows.length > 0) {
    const admin = adminRows[0];
    const cek = await bcrypt.compare(password, admin.password);
    if (!cek) return { error: "Password salah" };

    const token = createToken({ id: admin.id, role: "admin" });
    return { token, role: "admin" };
  }

  // === 2. PETUGAS ===
  const [petugasRows] = await db.query(
    "SELECT * FROM petugas WHERE username = ? LIMIT 1",
    [nis]
  );

  if (petugasRows.length > 0) {
    const petugas = petugasRows[0];
    const cek = await bcrypt.compare(password, petugas.password);
    if (!cek) return { error: "Password salah" };

    const token = createToken({ id: petugas.id, role: "petugas" });
    return { token, role: "petugas" };
  }

  // === 3. SISWA ===
  const [userRows] = await db.query(
    "SELECT * FROM users WHERE nis = ? LIMIT 1",
    [nis]
  );

  if (userRows.length === 0)
    return { error: "Akun tidak ditemukan" };

  const user = userRows[0];
  const cek = await bcrypt.compare(password, user.password_hash);

  if (!cek) return { error: "Password salah" };

  const token = createToken({ id: user.id, role: "siswa" });
  return { token, role: "siswa" };
}





// =======================
// ADMIN - TAMBAH SISWA
// =======================
export async function tambahSiswaAction(formData) {
  const data = BuatSiswaSchema.parse(formData);

  const hash = await bcrypt.hash(data.password, 10);

  await db.query(
    "INSERT INTO users (nis, nama, kelas, password_hash) VALUES (?,?,?,?)",
    [data.nis, data.nama, data.kelas, hash]
  );

  return { success: true };
}



// =======================
// SISWA BAYAR TAGIHAN
// =======================
export async function bayarAction(formData) {
  const { bill_id, nis, password } = BayarSchema.parse(formData);

  const [userRows] = await db.query(
    "SELECT * FROM users WHERE nis = ? LIMIT 1",
    [nis]
  );

  if (userRows.length === 0) return { error: "NIS tidak ditemukan" };

  const user = userRows[0];

  const cek = await bcrypt.compare(password, user.password_hash);
  if (!cek) return { error: "Password salah" };

  // Pastikan bill memang milik siswa ini
  const [billRows] = await db.query(
    "SELECT * FROM bills WHERE id = ? AND student_id = ? LIMIT 1",
    [bill_id, user.id]
  );

  if (billRows.length === 0) return { error: "Tagihan tidak ditemukan" };

  await db.query(
    "UPDATE bills SET status='lunas', paid_at=NOW() WHERE id = ?",
    [bill_id]
  );

  return { success: true };
}
