import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import jwtDecode from "jsonwebtoken";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const token = response.data.token;

      // Decodificar el token JWT para obtener el branchId y roleId
      const decoded = jwtDecode.decode(token); // Decodificar el token
      const { branchId, roleId } = decoded;

      // Guardar el token en el almacenamiento local
      localStorage.setItem("token", token);

      // Redirigir según el roleId o branchId
      if (roleId === 2) {
        // Role de secretaria
        router.push("/clases");
      } else {
        // Role de alumno o cualquier otro
        switch (branchId) {
          case 1:
            router.push("/branches/GomezPalacio");
            break;
          case 2:
            router.push("/branches/Independencia");
            break;
          case 3:
            router.push("/branches/Saltillo400");
            break;
          case 4:
            router.push("/branches/Durango");
            break;
          default:
            console.error("Branch no encontrado");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <div className="border border-gray-400 p-8 rounded-2xl bg-white max-w-md mx-auto mt-10 shadow-lg">
      <div className="text-lg font-bold mb-6 text-center">SignIn to your account</div>
      <form className="space-y-6" onSubmit={handleLogin}>
        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-3 text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-blue-500 bg-white px-1"
          >
            Email
          </label>
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-3 text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-blue-500 bg-white px-1"
          >
            Password
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center space-y-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-lg font-bold uppercase rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 transition-transform"
          >
            Submit
          </button>
          <div className="text-gray-600">
            New here?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Create Account
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
