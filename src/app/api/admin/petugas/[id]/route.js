import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";



export async function GET(req, { params }) {
  const { id } = await params;
  const [rows] = await db.query(
    "SELECT id, nama, username FROM petugas WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Petugas tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ petugas: rows[0] });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const form = await req.formData();

  const nama = form.get("nama");
  const username = form.get("username");
  const password = form.get("password");

  // ⬇⬇⬇ TAMBAHKAN INI
  console.log("INPUT UPDATE:", { id, nama, username, password });
  // ⬆⬆⬆ WAJIB

  let query = "UPDATE petugas SET nama=?, username=?";
  const values = [nama, username];

  if (password && password.trim() !== "") {
    const hash = await bcrypt.hash(password, 10);
    query += ", password=?";
    values.push(hash);
  }

  query += " WHERE id=?";
  values.push(id);

  console.log("QUERY:", query);
  console.log("VALUES:", values); // Tambahin ini juga

  await db.query(query, values);

  return NextResponse.json({ message: "Petugas berhasil diupdate" });
}


export async function DELETE(req, { params }) {
  const { id } = await params;
  await db.query("DELETE FROM petugas WHERE id=?", [id]);
  return NextResponse.json({ message: "Petugas berhasil dihapus" });
}
