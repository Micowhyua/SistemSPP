import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query(`
    SELECT 
        payments.id,
        payments.bill_id, 
        users.nama,
        bills.bulan,
        bills.tahun,
        bills.nominal,
        bills.status,         -- tambahkan status
        bills.paid_at,        -- tambahkan paid_at
        payments.bukti_path,
        payments.transaction_time
    FROM payments
    JOIN bills ON bills.id = payments.bill_id
    JOIN users ON users.id = bills.student_id
    ORDER BY payments.id DESC
  `);

  return NextResponse.json(rows);
}
