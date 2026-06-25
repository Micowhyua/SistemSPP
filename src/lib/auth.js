import jwt from "jsonwebtoken";

const SECRET = "RAHASIA_SUPER_AMAN";

export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
