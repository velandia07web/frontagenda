// PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta según tu estructura de archivos
//const { loading } = useAuth(); // Agrega loading al contexto
interface PrivateRouteProps {
  allowedRoles: string[]; // Roles permitidos para acceder a la ruta
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Muestra un indicador de carga mientras se verifica el estado de autenticación
  }

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/" replace />; // Asegura que redirija correctamente
  }

  // Verifica si el rol del usuario está en los roles permitidos
  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // Si el rol no tiene acceso, redirige a una página de acceso denegado
  return <Navigate to="/" replace />;
};

export default PrivateRoute;
