import { Appointment, User, Branch } from "../../../models";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    switch (method) {
      case "GET":
        // Obtener una cita por ID
        if (id) {
          const appointment = await Appointment.findByPk(id, {
            include: [User, Branch],
          });
          if (!appointment) {
            return res.status(404).json({ error: "Cita no encontrada" });
          }
          return res.status(200).json(appointment);
        }
        // Obtener todas las citas
        const appointments = await Appointment.findAll({
          include: [User, Branch],
        });
        return res.status(200).json(appointments);

      case "POST":
        // Crear una nueva cita
        const { day, time, userId, branchId } = req.body;
        const newAppointment = await Appointment.create({
          day,
          time,
          userId,
          branchId,
        });
        return res.status(201).json({ message: "Cita creada", appointment: newAppointment });

      case "PUT":
        // Actualizar una cita existente
        if (!id) return res.status(400).json({ error: "ID no proporcionado" });
        const { day: updatedDay, time: updatedTime } = req.body;
        const appointmentToUpdate = await Appointment.findByPk(id);
        if (!appointmentToUpdate) {
          return res.status(404).json({ error: "Cita no encontrada" });
        }
        await appointmentToUpdate.update({ day: updatedDay, time: updatedTime });
        return res.status(200).json({ message: "Cita actualizada", appointment: appointmentToUpdate });

      case "DELETE":
        // Eliminar una cita existente
        if (!id) return res.status(400).json({ error: "ID no proporcionado" });
        const appointmentToDelete = await Appointment.findByPk(id);
        if (!appointmentToDelete) {
          return res.status(404).json({ error: "Cita no encontrada" });
        }
        await appointmentToDelete.destroy();
        return res.status(200).json({ message: "Cita eliminada" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Método ${method} no permitido` });
    }
  } catch (error) {
    console.error("Error en la API de citas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
