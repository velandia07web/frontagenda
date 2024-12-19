const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

// Define la interfaz de una Ciudad
export interface City {
  id: string; // Cambiar a string ya que el id parece ser un UUID
  name: string;
  idZone: string; // idZone puede ser opcional// Cambiar a idZone en lugar de zone
  transportPrice: number;
  state?: string;
}

// Interfaz para la respuesta de la API
interface CitiesResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: City[]; // rows es un arreglo de City
  };
}

// Función para obtener todas las ciudades
export const getAllCities = async (): Promise<City[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/city/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las ciudades");
    }

    const data: CitiesResponse = await response.json();
    return data.data.rows; // Devuelve solo los rows de la respuesta
  } catch (error) {
    console.error("Error en getAllCities:", error);
    throw error; // Maneja el error según tus necesidades
  }
};

// Función para obtener una ciudad específica por ID
export const getCityById = async (id: string): Promise<City> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/city/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la ciudad");
    }

    const data = await response.json();
    return data; // Devuelve la ciudad encontrada
  } catch (error) {
    console.error("Error en getCityById:", error);
    throw error;
  }
};

// Función para crear una nueva ciudad
export const createCity = async (city: City): Promise<City> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/city/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(city), // Serializa el objeto city
    });

    if (!response.ok) {
      throw new Error("Error al crear la ciudad");
    }

    const data = await response.json();
    return data; // Devuelve la ciudad creada
  } catch (error) {
    console.error("Error en createCity:", error);
    throw error;
  }
};

// Función para actualizar una ciudad existente
export const updateCity = async (id: string, city: City): Promise<City> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/city/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(city), // Serializa el objeto city
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la ciudad");
    }

    const data = await response.json();
    return data; // Devuelve la ciudad actualizada
  } catch (error) {
    console.error("Error en updateCity:", error);
    throw error;
  }
};

// Función para eliminar una ciudad
export const deleteCity = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/city/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la ciudad");
    }
  } catch (error) {
    console.error("Error en deleteCity:", error);
    throw error;
  }
};
