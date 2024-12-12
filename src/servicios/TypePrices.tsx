const port = import.meta.env.VITE_API_BASE_URL;

export interface TypePrices {
  id?: string;
  name: string;
}

interface TypePricesResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: TypePrices[];
  };
}

// Función para obtener todos los TypePrices
export const getAllTypePrices = async (): Promise<TypePrices[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typePrice/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los tipos de precios");
    }

    const data: TypePricesResponse = await response.json();
    return data.data.rows;
  } catch (error) {
    console.error("Error en getAllTypePrices:", error);
    throw error;
  }
};

// Función para obtener un TypePrice por ID
export const getTypePriceById = async (id: string): Promise<TypePrices> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typePrice/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener un tipo de precio");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getTypePriceById:", error);
    throw error;
  }
};

// Función para crear un nuevo TypePrice
export const createTypePrice = async (typePrice: TypePrices): Promise<TypePrices> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typePrice/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(typePrice),
    });

    if (!response.ok) {
      throw new Error("Error al crear el tipo de precio");
    }

    const data: TypePrices = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createTypePrice:", error);
    throw error;
  }
};

// Función para actualizar un TypePrice
export const updateTypePrice = async (id: string, typePrice: TypePrices): Promise<TypePrices> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typePrice/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(typePrice),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el tipo de precio");
    }

    const data: TypePrices = await response.json();
    return data;
  } catch (error) {
    console.error("Error en updateTypePrice:", error);
    throw error;
  }
};

// Función para eliminar un TypePrice
export const deleteTypePrice = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typePrice/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el tipo de precio");
    }
  } catch (error) {
    console.error("Error en deleteTypePrice:", error);
    throw error;
  }
};
