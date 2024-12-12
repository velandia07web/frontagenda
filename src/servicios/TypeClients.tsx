const port = import.meta.env.VITE_API_BASE_URL;

export interface TypeClient {
  id?: string;
  name: string;
}

interface TypeClientResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: TypeClient[];
  };
}

// Obtener todos los tipos de cliente
export const getAllTypeClients = async (): Promise<TypeClient[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeClients/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los tipos de cliente");
    }

    const data: TypeClientResponse = await response.json();

    return data.data.rows;
  } catch (error) {
    console.error("Error en getAllTypeClients:", error);
    throw error;
  }
};

// Obtener un tipo de cliente por ID
export const getTypeClientById = async (id: string): Promise<TypeClient> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeClients/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el tipo de cliente");
    }

    const data: TypeClient = await response.json();

    return data;
  } catch (error) {
    console.error("Error en getTypeClientById:", error);
    throw error;
  }
};

// Crear un nuevo tipo de cliente
export const createTypeClient = async (
  typeClient: TypeClient
): Promise<TypeClient> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeClients/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(typeClient),
    });

    if (!response.ok) {
      throw new Error("Error al crear el tipo de cliente");
    }

    const data: TypeClient = await response.json();

    return data;
  } catch (error) {
    console.error("Error en createTypeClient:", error);
    throw error;
  }
};

// Actualizar un tipo de cliente
export const updateTypeClient = async (
  id: string,
  typeClient: TypeClient
): Promise<TypeClient> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeClients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(typeClient),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el tipo de cliente");
    }

    const data: TypeClient = await response.json();

    return data;
  } catch (error) {
    console.error("Error en updateTypeClient:", error);
    throw error;
  }
};

// Eliminar un tipo de cliente
export const deleteTypeClient = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeClients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el tipo de cliente");
    }
  } catch (error) {
    console.error("Error en deleteTypeClient:", error);
    throw error;
  }
};
