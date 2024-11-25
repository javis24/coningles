import bcrypt from "bcrypt";
import { User, Role, Branch } from "../../../models";

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const user = await User.findByPk(id, {
          include: [
            { model: Role, attributes: ["name"] },
            { model: Branch, attributes: ["name"] },
          ],
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
      }
      break;

    case "PUT":
      try {
        const { name, email, password, roleId, branchId } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const role = await Role.findByPk(roleId);
        const branch = await Branch.findByPk(branchId);

        if (!role) return res.status(404).json({ error: "Role not found" });
        if (!branch && role.name !== "admin") {
          return res.status(404).json({ error: "Branch not found" });
        }

        const hashedPassword = password
          ? await bcrypt.hash(password, 10)
          : user.password;

        await user.update({
          name,
          email,
          password: hashedPassword,
          roleId,
          branchId: role.name === "admin" ? null : branchId,
        });

        res.status(200).json({ message: "User updated", user });
      } catch (error) {
        res.status(500).json({ error: "Error updating user" });
      }
      break;

    case "DELETE":
      try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        await user.destroy();
        res.status(200).json({ message: "User deleted" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
