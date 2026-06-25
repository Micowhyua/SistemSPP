import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = auth.replace("Bearer ", "");
  const user = verifyToken(token);

  if (!user || user.role !== "petugas") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
const { bulan, tahun, nominal } = body; // gunakan nominal, bukan amount

  const [students] = await db.query(
    "SELECT id FROM users WHERE role = 'siswa'"
  );

for (const s of students) {
  await db.query(
    `INSERT INTO bills (student_id, bulan, tahun, nominal, status)
     VALUES (?, ?, ?, ?, 'belum')`,
    [s.id, bulan, tahun, nominal] // gunakan nominal
  );
}


  return NextResponse.json({ success: true });
}
