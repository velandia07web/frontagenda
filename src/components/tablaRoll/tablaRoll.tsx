import React, { useEffect, useState } from "react";
import { getAllRoles } from "../../servicios/rol"; // Ajusta la ruta según tu estructura

// Define la interfaz Role
interface Role {
  id: string; // ID como string
  name: string;
}

// Define la interfaz para la respuesta de la API
interface RolesResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Role[]; // Arreglo de roles
  };
}

const RegisterUser: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]); // Usa el tipo Role

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData: RolesResponse = await getAllRoles(); // Asegúrate de que getAllRoles retorne este tipo
        setRoles(rolesData.data.rows); // Accede a rows de la respuesta
      } catch (error) {
        console.error("Error al cargar los roles", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <form>
      {/* Otros campos de registro */}
      <label htmlFor="role">Rol:</label>
      <select id="role">
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name} {/* Mostrar el nombre del rol */}
          </option>
        ))}
      </select>
      {/* Botón de enviar */}
    </form>
  );
};

export default RegisterUser;
