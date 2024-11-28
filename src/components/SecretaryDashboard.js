import { useState, useEffect } from "react";
import jwt from "jsonwebtoken"; // Para decodificar el token JWT
import { useRouter } from "next/router";
import axios from "axios";

export default function SecretaryDashboard() {
  const [userData, setUserData] = useState(null);
  const [students, setStudents] = useState([]);
  const router = useRouter();

  // Validar el token JWT al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirigir al login si no hay token
      return;
    }

    try {
      const decoded = jwt.decode(token); // Decodificar el token
      const { id, branchId, roleId } = decoded;

      // Validar que el usuario sea secretaria (roleId === 2)
      if (roleId !== 2) {
        router.push("/unauthorized"); // Redirigir si no cumple las condiciones
        return;
      }

      setUserData({ userId: id, branchId });
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      router.push("/login"); // Redirigir al login si hay error
    }
  }, []);

  // Obtener los alumnos y sus citas relacionadas
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (userData?.branchId) {
          const response = await axios.get(`/api/students?branchId=${userData.branchId}`);
          setStudents(response.data);
        }
      } catch (error) {
        console.error("Error al obtener alumnos:", error);
      }
    };

    if (userData?.branchId) {
      fetchStudents();
    }
  }, [userData?.branchId]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Dashboard de Secretaría</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Alumnos de la Sucursal</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Sucursal</th>
              <th className="border px-4 py-2">Día</th>
              <th className="border px-4 py-2">Horario</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="text-gray-700">
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.Branch.name}</td>
                {student.Appointments.map((appointment, i) => (
                  <tr key={i}>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2">{appointment.day}</td>
                    <td className="border px-4 py-2">{appointment.time}</td>
                  </tr>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
