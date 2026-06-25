import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

// ======================
// POST: UPLOAD FOTO ADMIN
// ======================
export async function POST(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(auth.replace("Bearer ", ""));
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get("photo"); // sudah BENAR

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `photoadmin_${user.id}.jpg`;
    const filepath = path.join(process.cwd(), "public", "photoadmin", filename);

    await writeFile(filepath, buffer);

    await db.query("UPDATE admin SET photo = ? WHERE id = ?", [
      `/photoadmin/${filename}`,
      user.id,
    ]);

    return NextResponse.json({
      success: true,
      photo: `/photoadmin/${filename}`,
    });
  } catch (e) {
    console.error("UPLOAD ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ======================
// GET: AMBIL DATA ADMIN
// ======================
export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(auth.replace("Bearer ", ""));
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [rows] = await db.query(
      "SELECT id, nama, username, photo FROM admin WHERE id = ?",
      [user.id]
    );

    return NextResponse.json({
      admin: rows[0],
    });
  } catch (e) {
    console.error("GET ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
