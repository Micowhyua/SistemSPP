import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // ================ CEK TOKEN ================
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.replace("Bearer ", "");
    const user = verifyToken(token);

    if (!user || user.role !== "siswa") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ================ TERIMA FORM DATA ================
    const form = await req.formData();
    const bill_id = form.get("bill_id");
    const password = form.get("password");
    const bukti = form.get("bukti");

    if (!bill_id || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // ================ VALIDASI PASSWORD SISWA ================
    const [rows] = await db.query("SELECT password_hash FROM users WHERE id = ?", [
      user.id,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Password salah" }, { status: 400 });
    }

    // ================ CEK BILL ================
    const [bill] = await db.query(
      "SELECT * FROM bills WHERE id = ? AND student_id = ?",
      [bill_id, user.id]
    );

    if (bill.length === 0) {
      return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 400 });
    }

    // ================ VALIDASI FILE BUKTI ================
    if (!bukti || typeof bukti.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "File bukti tidak valid atau tidak ada." },
        { status: 400 }
      );
    }

    // ================ SIMPAN FILE BUKTI ================
    const arrayBuffer = await bukti.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `bukti_${Date.now()}_${bukti.name}`;
    const filePath = `/uploads/${filename}`;

    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    // ================ INSERT PAYMENT ================
   await db.query(
  `INSERT INTO payments (bill_id, bukti_path, transaction_time)
   VALUES (?, ?, NOW())`,
  [bill_id, filePath]
);


    // ================ UPDATE BILL ================
   
await db.query(
  "UPDATE bills SET status = 'menunggu', paid_at = NULL WHERE id = ?",
  [bill_id]
);

    return NextResponse.json({ success: true, message: "Pembayaran berhasil!" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
