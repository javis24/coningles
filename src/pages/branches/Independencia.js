import { useState, useEffect } from "react";
import jwt from "jsonwebtoken"; // Para decodificar el token JWT
import { useRouter } from "next/router";
import axios from "axios";

export default function UserForm() {
  const [userData, setUserData] = useState({ name: "", branch: "", role: "" });
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (userData?.branchId) {
          const response = await axios.get(`/api/appointments?branchId=${userData.branchId}`);
          setAppointments(response.data);
        }
      } catch (error) {
        console.error("Error al obtener citas:", error);
      }
    };
  
    if (userData?.branchId) {
      fetchAppointments();
    }
  }, [userData?.branchId]);
  


  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      router.push("/login");
      return;
    }
  
    try {
      const decoded = jwt.decode(token);
      console.log("Datos decodificados:", decoded); // Verifica que 'name' esté presente
      const { id, name, branchId, roleId } = decoded;
    
      if (roleId !== 3 || branchId !== 2) {
        router.push("/unauthorized");
        return;
      }
    
      setUserData({
        userId: id,
        name: name || "Desconocido",
        branchId,
        branch: branchId === 2 ? "Independencia" : "Otra Sucursal",
        role: "Alumno",
      });
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      router.push("/login");
    }
    
  }, []);
  

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!day || !time) {
      alert("Por favor, seleccione un día y un horario.");
      return;
    }

    const newAppointment = {
      day,
      time,
      userId: userData.userId,
      branchId: userData.branchId,
    };

    try {
      const response = await axios.post("/api/appointments", newAppointment);
      setAppointments((prevAppointments) => [...prevAppointments, response.data]);
      alert("Cita registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar cita:", error);
      alert("Hubo un error al registrar la cita.");
    }

    setDay("");
    setTime("");
  };

 
 // Manejar la cancelación de citas
 const handleCancelAppointment = async (appointmentId) => {
  try {
    await axios.delete(`/api/appointments/${appointmentId}`);
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== appointmentId)
    );
    alert("Cita cancelada con éxito.");
  } catch (error) {
    console.error("Error al cancelar cita:", error);
    alert("Hubo un error al cancelar la cita.");
  }
};

const isCancelable = (time) => {
  const now = new Date(); // Fecha y hora actual
  const [startHourMinute, period] = time.split(" - ")[0].split(" "); // Dividimos la hora y el periodo (AM/PM)
  const [startHour, startMinute] = startHourMinute.split(":").map(Number); // Obtenemos hora y minuto como números
  let appointmentHour = startHour;

  // Convertir el horario a formato 24 horas
  if (period === "PM" && appointmentHour !== 12) {
    appointmentHour += 12;
  } else if (period === "AM" && appointmentHour === 12) {
    appointmentHour = 0; // Medianoche
  }

  const appointmentTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    appointmentHour,
    startMinute
  );

  // Calcular la diferencia en horas
  const differenceInHours = (appointmentTime - now) / (1000 * 60 * 60);

  // Devuelve true si falta más de 1 hora para la cita
  return differenceInHours > 1;
};


if (!userData) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p>Cargando datos...</p>
    </div>
  );
}
  return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center space-y-4">      
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg rounded-3xl p-6 space-y-6 w-96"
      >
        <h1 className="text-2xl font-semibold text-white">Agendar Clase</h1>
        <label className="relative block">
          <span className="absolute left-3 top-3 text-sm text-gray-400 transition-all">
            Nombre del Alumno
          </span>
          <input
            type="text"
            className="bg-gray-900 text-white rounded-lg w-full p-3 pt-6 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={userData.name}
            readOnly
          />
        </label>

        <label className="relative block">
          <span className="absolute left-3 top-3 text-sm text-gray-400 transition-all">
            Sucursal
          </span>
          <input
            type="text"
            className="bg-gray-900 text-white rounded-lg w-full p-3 pt-6 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={userData.branch}
            readOnly
          />
        </label>

        <div className="flex space-x-4">
          <label className="relative block w-1/2">
            <span className="absolute left-3 top-3 text-sm text-gray-400 transition-all">
              Día
            </span>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="bg-gray-900 text-white rounded-lg w-full p-3 pt-6 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Seleccione un día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
          </label>

          <label className="relative block w-1/2">
            <span className="absolute left-3 top-3 text-sm text-gray-400 transition-all">
              Horario
            </span>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-gray-900 text-white rounded-lg w-full p-3 pt-6 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Seleccione un horario</option>
              <option value="7:00 AM - 8:00 AM">7:00 AM - 8:00 AM</option>
              <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
              <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
              <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
              <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
              <option value="6:00 PM - 7:00 PM">6:00 PM - 7:00 PM</option>
            </select>
          </label>
        </div>

        <div className="flex space-x-4">
          <label className="relative block w-1/2">
            <span className="absolute left-3 top-3 text-sm text-gray-400 transition-all">
              Fecha Seleccionada
            </span>
            <input
              type="text"
              className="bg-gray-900 text-white rounded-lg w-full p-3 pt-6 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={day}
              readOnly
            />
          </label>

          <label className="relative block w-1/2">
            <span className="absolute left-3 top-3 text-sm text-gray-400 transition-all">
              Horario Seleccionado
            </span>
            <input
              type="text"
              className="bg-gray-900 text-white rounded-lg w-full p-3 pt-6 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={time}
              readOnly
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white py-3 rounded-lg w-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Registrar Cita
        </button>
      </form>
 
     
      <div className="bg-gray-900 min-h-screen flex flex-col overflow-y-auto max-h-56 w-full max-w-md mt-2">
        <h2 className="text-lg font-bold text-white text-center">Citas Registradas</h2>

        {/* Contenedor con Scroll */}
        <div className="overflow-y-auto max-h-96 w-full max-w-md space-y-4 px-4">
          {appointments
            .slice(-4) // Mostrar solo las últimas 4 citas
            .map((appointment, index) => {
              const isDisabled = !isCancelable(appointment.time);

              return (
                <div
                  key={index}
                  className="relative bg-white shadow-lg rounded-lg w-full p-4 flex items-center gap-4"
                >
                  {/* Icono */}
                  <div className="bg-green-200 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                    >
                      <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                    </svg>
                  </div>

                  {/* Detalles de la cita */}
                  <div className="flex flex-col">
                    <p className="text-green-600 font-semibold text-lg">{appointment.day}</p>
                    <p className="text-gray-600 text-sm">{appointment.time}</p>
                  </div>

                  {/* Botón de cancelar */}
                  <button
                    className={`py-1 px-3 text-white rounded-lg transition ${
                      isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={isDisabled}
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancelar
                  </button>
                </div>
              );
            })}
        </div>
        <button
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
          onClick={() => {
            localStorage.removeItem("token"); // Eliminar token
            router.push("/"); // Redirigir al login
          }}
        >
          Cerrar Sesión
        </button>
      </div>

    </div>
  );
}
