const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

// Define la interfaz de un Usuario (sin password ni failedAttempts)

export interface User {
  id: string; // id opcional para la creación
  name: string;
  lastName: string;
  email: string;
  cedula: number;
  phone: string;
  idRol: string;
  idZone: string;
  active: boolean;
  state?: string;
}

export interface CreateUserPayload extends User {
  password: string;
}

// Interfaz para la respuesta de la API
interface UsersResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: User[]; // rows es un arreglo de User
  };
}

// Función para obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    const data: UsersResponse = await response.json();
    return data.data.rows; // Devuelve solo los rows de la respuesta
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    throw error; // Maneja el error según tus necesidades
  }
};

// Función para obtener un usuario específico por ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el usuario");
    }

    const data = await response.json();
    return data; // Devuelve el usuario encontrado
  } catch (error) {
    console.error("Error en getUserById:", error);
    throw error;
  }
};

// Función para crear un nuevo usuario (sin incluir la contraseña en la interfaz)
export const createUser = async (user: CreateUserPayload): Promise<User> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Error al crear el usuario");
    }

    const data = await response.json();
    return data; // Devuelve el usuario creado
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
};

// Función para actualizar un usuario existente (sin gestionar la contraseña)
export const updateUser = async (id: string, user: User): Promise<User> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(user), // Serializa el objeto user
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }

    const data = await response.json();
    return data; // Devuelve el usuario actualizado
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};

// Función para eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }
  } catch (error) {
    console.error("Error en deleteUser:", error);
    throw error;
  }
};
