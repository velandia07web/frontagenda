import React, { createContext, useContext, useState, useEffect } from "react";
//const [loading, setLoading] = useState(true); // Estado de carga
// Define el puerto/base URL de tu API
const port = import.meta.env.VITE_API_BASE_URL;

// Define el tipo para los datos del usuario
interface User {
  id: string;
  username: string;
  role: string;
}

// Define el tipo de los roles (ajusta según tu estructura)
interface RolesResponse {
  id: string;
  role: string;
}

// Define el contexto
interface AuthContextType {
  user: User | null;
  roles: RolesResponse[] | null; // Almacenar los roles
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean; // Añade loading aquí
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<RolesResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Añadir el estado loading

  // Función para decodificar el token JWT
  const decodeToken = (token: string): any | null => {
    try {
      const base64Url = token.split(".")[1]; // Obtiene la parte del payload del token
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64)); // Decodifica el payload
      return decodedPayload;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser({
          id: decodedUser.id,
          username: decodedUser.username,
          role: decodedUser.role,
        });
        getRol(token).finally(() => setLoading(false)); // Carga completa tras obtener roles
      } else {
        setLoading(false); // Finaliza la carga si no hay token
      }
    } else {
      setLoading(false); // Finaliza la carga si no hay token
    }
  }, []);

  // Función para obtener los roles basados en el token
  const getRol = async (token: string): Promise<void> => {
    try {
      const decoded = decodeToken(token); // Decodifica el token
      //console.log("hola", decoded.role);

      if (!decoded || !decoded.role) {
        throw new Error("No se pudo obtener el idRol del token");
      }

      //console.log("idRol:", decoded.role); // Imprime el idRol desde el token decodificado

      // Realiza la solicitud para obtener los roles
      const response = await fetch(`${port}/rol/${decoded.role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en la cabecera
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los roles");
      }

      const data: RolesResponse[] = await response.json();
      setRoles(data); // Guarda los roles en el estado
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  // Función para cerrar sesión (logout)

  // Si ya existe un token en el localStorage, obtener roles automáticamente

  // Función para iniciar sesión (login)
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    const token = localStorage.getItem("token");

    if (token) {
      getRol(token); // Llama a la función para obtener los roles tras el login
    }
  };

  const logout = () => {
    setUser(null);
    setRoles(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("rol");
    localStorage.removeItem("user");
    // Aquí puedes redirigir a la página de login si es necesario
  };

  return (
    <AuthContext.Provider value={{ user, roles, login, logout, loading }}>
      {!loading ? children : <div>Cargando...</div>}{" "}
      {/* Renderizar si no está cargando */}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
