// RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta según tu estructura de archivos
const { loading } = useAuth(); // Agrega loading al contexto
interface RoleRouteProps {
  role: string; // Rol específico permitido para acceder a la ruta
}

const RoleRoute = ({ role }: RoleRouteProps) => {
  const { user } = useAuth();
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Verifica si el rol del usuario coincide con el rol requerido
  if (user.role === role) {
    return <Outlet />;
  }

  // Si el rol no tiene acceso, redirige a una página de acceso denegado
  return <Navigate to="/" replace />;
};

export default RoleRoute;
