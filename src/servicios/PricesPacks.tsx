const port = import.meta.env.VITE_API_BASE_URL;

export interface PricePack {
  id: string;
  idPack: string;  // Aquí debe ser un string, no un number
  idProduct: string;
  price: number;
  priceDeadHour: number;
}

export interface PackPriceMap {
  id?: string;
  name: string;
  description: string;
  price: number;
  priceDeadHour: number;
  idProduct?: string;
}

export interface PricePackJustHour{
  price: number;
  priceDeadHour: number;

}

interface PricePackResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: PricePack[];
  };
}

interface PricePackResponsewithArray {
  status: number;
  message: string;
  data: PackPriceMap[];
}


export const getAllPacksWithPrice = async (id: string): Promise<PackPriceMap[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pack/zone/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los packs");
    }

    const data: PricePackResponsewithArray = await response.json();
    console.log(data)
    return data.data;
  } catch (error) {
    console.error("Error en getAllPacksWithPrice: ", error);
    throw error;
  }
};


// Función para obtener todos los PricePacks
export const getAllPricePacks = async (): Promise<PricePack[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pricepack/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los pricepacks");
    }

    const data: PricePackResponse = await response.json();
    return data.data.rows;
  } catch (error) {
    console.error("Error en getAllPricePacks: ", error);
    throw error;
  }
};

// Función para obtener un PricePack por su ID
export const getPricePackById = async (id: string): Promise<PricePack> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pricepack/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el pricepack");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPricePackById: ", error);
    throw error;
  }
};

// Función para crear un nuevo PricePack
export const createPricePack = async (pricePack: PricePack): Promise<PricePack> => {
  try {
    const token = localStorage.getItem("token");


    const response = await fetch(`${port}/pricepack/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pricePack),
    });

    if (!response.ok) {
      throw new Error("Error al crear el pricepack");
    }

    const data: PricePack = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createPricePack:", error);
    throw error;
  }
};

// Función para actualizar un PricePack
export const updatePricePack = async (id: string, pricePack: PricePackJustHour): Promise<PricePack> => {
  try {
    const token = localStorage.getItem("token");
    console.log(id)

    console.log(pricePack)

    const response = await fetch(`${port}/pricePack/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pricePack),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el pricepack");
    }

    const data: PricePack = await response.json();
    return data;
  } catch (error) {
    console.error("Error en updatePricePack:", error);
    throw error;
  }
};


// Función para eliminar un PricePack
export const deletePricePack = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/pricepack/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el pricepack");
    }
  } catch (error) {
    console.error("Error en deletePricePack:", error);
    throw error;
  }
};
