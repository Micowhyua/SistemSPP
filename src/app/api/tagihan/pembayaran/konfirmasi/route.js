import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(auth.replace("Bearer ", ""));
  if (!user || user.role !== "petugas")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { bill_id } = await req.json();

  if (!bill_id)
    return NextResponse.json({ error: "bill_id tidak ada" }, { status: 400 });

  // ===== CEK PAYMENT =====
  const [pay] = await db.query(
    `SELECT * FROM payments WHERE bill_id = ? LIMIT 1`,
    [bill_id]
  );

  if (pay.length === 0) {
    return NextResponse.json({ error: "Pembayaran tidak ditemukan" }, { status: 404 });
  }

  // ===== KONFIRMASI: UPDATE STATUS BILL =====
  await db.query(
    `UPDATE bills 
     SET status = 'lunas', paid_at = NOW()
     WHERE id = ?`,
    [bill_id]
  );

  // ===== UPDATE PAYMENT LOG WAKTU KONFIRMASI =====
  await db.query(
  `UPDATE payments 
   SET transaction_time = NOW()
   WHERE bill_id = ?`,
  [bill_id]
);


  return NextResponse.json({ success: true });
}
