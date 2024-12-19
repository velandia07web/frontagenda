const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

// Define la interfaz de una Zona
export interface Zone {
  id: string; // id opcional para la creación
  name: string;
  state?: string;
}

// Interfaz para la respuesta de la API
interface ZonesResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Zone[]; // rows es un arreglo de Zone
  };
}

// Función para obtener todas las zonas
export const getAllZones = async (): Promise<Zone[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/zone/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las zonas");
    }

    const data: ZonesResponse = await response.json();
    return data.data.rows; // Devuelve solo los rows de la respuesta
  } catch (error) {
    console.error("Error en getAllZones:", error);
    throw error; // Maneja el error según tus necesidades
  }
}

export const getZoneWithPacks = async (): Promise<Zone[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/zone/zones-with-packs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la zona");
    }

    const data = await response.json();
    console.log(data)
    return data.data;
  } catch (error) {
    console.error("Error en getZoneById:", error);
    throw error;
  }
};;

export const getZoneWithProducts = async (): Promise<Zone[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/zone/zones-with-products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la zona");
    }

    const data = await response.json();
    console.log(data)
    return data.data;
  } catch (error) {
    console.error("Error en getZoneById:", error);
    throw error;
  }
};

// Función para obtener una zona específica por ID
export const getZoneById = async (id: string): Promise<Zone[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/zone/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la zona");
    }

    const data: ZonesResponse = await response.json();
    return data.data.rows; 
  } catch (error) {
    console.error("Error en getZoneById:", error);
    throw error;
  }
};

// Función para crear una nueva zona
export const createZone = async (zone: Zone): Promise<Zone> => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await fetch(`${port}/zone/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(zone), 
    });

    if (!response.ok) {
      throw new Error("Error al crear la zona");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createZone:", error);
    throw error;
  }
};

export const updateZone = async (id: string, zone: Zone): Promise<Zone> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/zone/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(zone), 
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la zona");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error en updateZone:", error);
    throw error;
  }
};

export const deleteZone = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await fetch(`${port}/zone/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la zona");
    }
  } catch (error) {
    console.error("Error en deleteZone:", error);
    throw error;
  }
};
