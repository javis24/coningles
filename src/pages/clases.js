import { useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import SecretaryDashboard from "../components/SecretaryDashboard";

export default function ClasesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwt.decode(token);
    if (!decoded || decoded.roleId !== 2) {
      router.push("/unauthorized");
    }
  }, []);

  return (
    <div>
      <SecretaryDashboard />
    </div>
  );
}
