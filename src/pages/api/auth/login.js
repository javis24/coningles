import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../../models";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Verificar si el usuario existe
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "User not found" });

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ error: "Invalid credentials" });

      // Generar el token JWT
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name, 
          branchId: user.branchId, // Incluir branchId en el token
          roleId: user.roleId,     // Incluir roleId en el token
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Error logging in" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
