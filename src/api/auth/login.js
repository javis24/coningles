import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(404).json({ error: "User not found" });

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role, branch: user.branch },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Error logging in" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
