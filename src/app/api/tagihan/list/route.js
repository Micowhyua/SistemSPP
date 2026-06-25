import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = auth.replace("Bearer ", "");
  const user = verifyToken(token);

  if (!user || user.role !== "petugas") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [rows] = await db.query(`
    SELECT bills.*, users.nama, users.nis
    FROM bills
    JOIN users ON users.id = bills.student_id
    ORDER BY bills.id DESC
  `);

  return NextResponse.json(rows);
}
