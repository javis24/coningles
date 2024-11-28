import { User, Appointment, Branch } from "../../../models";

export default async function handler(req, res) {
  const { branchId } = req.query; // Obtenemos el branchId desde el query string.

  if (req.method === "GET") {
    try {
      // Verificamos que el branchId sea proporcionado
      if (!branchId) {
        return res.status(400).json({ error: "Se requiere branchId" });
      }

      // Obtenemos los usuarios (alumnos) y sus citas relacionadas
      const students = await User.findAll({
        where: { branchId }, // Filtramos por sucursal
        include: [
          {
            model: Appointment,
            attributes: ["day", "time"],
          },
          {
            model: Branch,
            attributes: ["name"],
          },
        ],
      });

      // Retornamos los datos
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Error al obtener los datos de los alumnos" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
