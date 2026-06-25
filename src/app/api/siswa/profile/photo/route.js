  import { db } from "@/lib/db";
  import { NextResponse } from "next/server";
  import { verifyToken } from "@/lib/auth";
  import { writeFile } from "fs/promises";
  import path from "path";

  export async function POST(req) {
    try {
      const auth = req.headers.get("authorization");
      if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = verifyToken(auth.replace("Bearer ", ""));
      if (!user || user.role !== "siswa") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const form = await req.formData();
      const file = form.get("photo");

      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `photo_${user.id}.jpg`;

      // FIX: gunakan absolute path
      const filepath = path.join(process.cwd(), "public", "photos", filename);

      // simpan file
      await writeFile(filepath, buffer);

      // update database
      await db.query("UPDATE users SET photo = ? WHERE id = ?", [
        "/photos/" + filename,
        user.id,
      ]);

      return NextResponse.json({
        success: true,
        photo: "/photos/" + filename,
      });
    } catch (e) {
      console.error("UPLOAD ERROR:", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
