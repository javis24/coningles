import { Appointment, User, Branch } from "../../../models";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { branchId } = req.query;

    try {
      const appointments = await Appointment.findAll({
        where: { branchId },
        include: [
          { model: User, attributes: ["name"] }, // Incluir el nombre del usuario
          { model: Branch, attributes: ["name"] }, // Incluir el nombre de la sucursal
        ],
      });

      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Error fetching appointments" });
    }
  } else if (req.method === "POST") {
    const { day, time, userId, branchId } = req.body;

    try {
      const newAppointment = await Appointment.create({
        day,
        time,
        userId,
        branchId,
      });

      const createdAppointment = await Appointment.findByPk(newAppointment.id, {
        include: [
          { model: User, attributes: ["name"] }, // Incluir el nombre del usuario
          { model: Branch, attributes: ["name"] }, // Incluir el nombre de la sucursal
        ],
      });

      res.status(201).json(createdAppointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Error creating appointment" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
