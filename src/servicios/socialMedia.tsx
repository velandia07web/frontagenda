const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

// Define la interfaz de una Red Social
export interface SocialMedia {
  id?: string; // id opcional para la creación
  name: string;
  state?: string;
}

// Interfaz para la respuesta de la API
interface SocialMediaResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: SocialMedia[]; // rows es un arreglo de SocialMedia
  };
}

// Función para obtener todas las redes sociales
export const getAllSocialMedias = async (): Promise<SocialMedia[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/socialMedia/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las redes sociales");
    }

    const data: SocialMediaResponse = await response.json();
    return data.data.rows; // Devuelve solo los rows de la respuesta
  } catch (error) {
    console.error("Error en getAllSocialMedias:", error);
    throw error; // Maneja el error según tus necesidades
  }
};

// Función para obtener una red social específica por ID
export const getSocialMediaById = async (id: string): Promise<SocialMedia> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/socialMedia/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la red social");
    }

    const data = await response.json();
    return data; // Devuelve la red social encontrada
  } catch (error) {
    console.error("Error en getSocialMediaById:", error);
    throw error;
  }
};

// Función para crear una nueva red social
export const createSocialMedia = async (
  socialMedia: SocialMedia
): Promise<SocialMedia> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/socialMedia/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(socialMedia), // Serializa el objeto socialMedia
    });

    if (!response.ok) {
      throw new Error("Error al crear la red social");
    }

    const data = await response.json();
    return data; // Devuelve la red social creada
  } catch (error) {
    console.error("Error en createSocialMedia:", error);
    throw error;
  }
};

// Función para actualizar una red social existente
export const updateSocialMedia = async (
  id: string,
  socialMedia: SocialMedia
): Promise<SocialMedia> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/socialMedia/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(socialMedia), // Serializa el objeto socialMedia
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la red social");
    }

    const data = await response.json();
    return data; // Devuelve la red social actualizada
  } catch (error) {
    console.error("Error en updateSocialMedia:", error);
    throw error;
  }
};

// Función para eliminar una red social
export const deleteSocialMedia = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/socialMedia/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la red social");
    }
  } catch (error) {
    console.error("Error en deleteSocialMedia:", error);
    throw error;
  }
};
