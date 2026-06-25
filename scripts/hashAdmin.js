import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function run() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "spp_on",   // PASTIKAN INI BENAR
  });

  const password = "admin123456";
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO admin (username, nama, password) VALUES (?, ?, ?)",
    ["admin", "Administrator", hash]
  );

  console.log("Password admin sudah diperbarui ke: admin123456");
  process.exit();
}

run();
