// rolService.ts
const port = import.meta.env.VITE_API_BASE_URL; // Asegúrate de que esta variable esté definida en tu archivo .env

// Tipo para los roles (ajusta los campos según tu modelo)
export interface Role {
  id: string; // Cambia a string si tus IDs son de tipo UUID
  name: string;
}

// Tipo para la respuesta de la API
interface RolesResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Role[];
  };
}

// Función para obtener todos los roles
export const getAllRoles = async (): Promise<RolesResponse> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/rol`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token aquí
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los roles");
    }

    const data: RolesResponse = await response.json();
    return data; // Devuelve la respuesta completa
  } catch (error) {
    console.error(error);
    throw error; // Maneja el error según tus necesidades
  }
};

// Función para obtener un rol específico
export const getRoleById = async (id: string): Promise<Role> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/rol/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token aquí
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el rol");
    }

    const data = await response.json();
    return data.data; // Retorna el rol encontrado
  } catch (error) {
    console.error(error);
    throw error; // Maneja el error según tus necesidades
  }
};
