import { User } from "../../../models";
import authMiddleware from "../../../middleware/auth";

async function handler(req, res) {
  if (req.method === "GET") {
    const { role, branch } = req.user;

    try {
      if (role === "admin") {
        const users = await User.findAll();
        return res.status(200).json(users);
      }

      if (role === "secretary") {
        const users = await User.findAll({ where: { branch } });
        return res.status(200).json(users);
      }

      return res.status(403).json({ error: "Forbidden" });
    } catch (error) {
      res.status(500).json({ error: "Error fetching users" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default authMiddleware(handler, ["admin", "secretary"]);
