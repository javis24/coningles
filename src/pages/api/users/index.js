import bcrypt from "bcrypt";
import { User, Role, Branch } from "../../../models";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const users = await User.findAll({
          include: [
            { model: Role, attributes: ["name"] },
            { model: Branch, attributes: ["name"] },
          ],
        });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
      }
      break;

    case "POST":
      try {
        const { name, email, password, roleId, branchId } = req.body;

        const role = await Role.findByPk(roleId);
        const branch = await Branch.findByPk(branchId);

        if (!role) return res.status(404).json({ error: "Role not found" });
        if (!branch && role.name !== "admin") {
          return res.status(404).json({ error: "Branch not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          roleId,
          branchId: role.name === "admin" ? null : branchId,
        });

        res.status(201).json({ message: "User created", user: newUser });
      } catch (error) {
        res.status(500).json({ error: "Error creating user" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
