const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

// Define la interfaz de un Pack
export interface Pack {
  id: string; // ID del paquete
  name: string;
  description: string;
  price: number;
  idProduct: string;
  idZone: string;
}

// Interfaz para la respuesta de la API
interface PacksResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Pack[]; // rows es un arreglo de Pack
  };
}

// Función para obtener todos los paquetes
export const getAllPacks = async (): Promise<Pack[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/pack/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los paquetes");
    }

    const data: PacksResponse = await response.json();
    return data.data.rows; // Devuelve solo los rows de la respuesta
  } catch (error) {
    console.error("Error en getAllPacks:", error);
    throw error; // Maneja el error según tus necesidades
  }
};

// Función para obtener un paquete específico por ID
export const getPackById = async (id: string): Promise<Pack> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/pack/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el paquete");
    }

    const data: Pack = await response.json();
    return data; // Devuelve el paquete encontrado
  } catch (error) {
    console.error("Error en getPackById:", error);
    throw error;
  }
};

// Función para crear un nuevo paquete
export const createPack = async (pack: Pack): Promise<Pack> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/pack/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(pack), // Serializa el objeto pack
    });

    if (!response.ok) {
      throw new Error("Error al crear el paquete");
    }

    const data: Pack = await response.json();
    return data; // Devuelve el paquete creado
  } catch (error) {
    console.error("Error en createPack:", error);
    throw error;
  }
};

// Función para actualizar un paquete existente
export const updatePack = async (id: string, pack: Pack): Promise<Pack> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/pack/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(pack), // Serializa el objeto pack
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el paquete");
    }

    const data: Pack = await response.json();
    return data; // Devuelve el paquete actualizado
  } catch (error) {
    console.error("Error en updatePack:", error);
    throw error;
  }
};

// Función para eliminar un paquete
export const deletePack = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/pack/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el paquete");
    }
  } catch (error) {
    console.error("Error en deletePack:", error);
    throw error;
  }
};
