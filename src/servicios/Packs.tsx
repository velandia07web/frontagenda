const port = import.meta.env.VITE_API_BASE_URL;

export interface Packs {
  id?: string;
  name: string;
  description: string;
  state?: string;
  idProduct?: string;
  idZone?: string;
}

interface PacksResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Packs[];
  };
}


// Función para obtener todos los Packs
export const getAllPacks = async (): Promise<Packs[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pack/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los packs");
    }

    const data: PacksResponse = await response.json();
    return data.data.rows;
  } catch (error) {
    console.error("Error en getAllPacks: ", error);
    throw error;
  }
};


// Función para obtener un Pack por su ID
export const getPackById = async (id: string): Promise<Packs> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pack/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el pack");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPackById: ", error);
    throw error;
  }
};

// Función para crear un nuevo Pack
export const createPack = async (pack: Packs): Promise<Packs> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pack/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pack),
    });

    if (!response.ok) {
      throw new Error("Error al crear el pack");
    }

    const data: Packs = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createPack:", error);
    throw error;
  }
};

// Función para actualizar un Pack
export const updatePack = async (id: string, pack: Packs): Promise<Packs> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pack/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pack),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el pack");
    }

    const data: Packs = await response.json();
    return data;
  } catch (error) {
    console.error("Error en updatePack:", error);
    throw error;
  }
};

// Función para eliminar un Pack
export const deletePack = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pack/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el pack");
    }
  } catch (error) {
    console.error("Error en deletePack:", error);
    throw error;
  }
};
