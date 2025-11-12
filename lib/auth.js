import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "harrygas_secret_key";

export function generateToken(user) {
  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      id_rol: user.id_rol,
    },
    SECRET,
    { expiresIn: "8h" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
