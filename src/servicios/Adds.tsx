const port = import.meta.env.VITE_API_BASE_URL;

export interface productAditional {
  id?: string;
  description: string;
  precio_unitario: number;
  amount: number;
  value: number;
}


export interface Adds {
    id?: string;
    name: string;
    price: number;
    state?: string;
    idTypePrice?: string;
}

interface AddsResponse {
    status: number;
    message: string;
    data: {
        count: number;
        rows: Adds[];
    }
}

export const getAllAdds = async(): Promise<Adds[]> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/add/`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if(!response.ok) {
            throw new Error("Error al obtener los productos adicionales");
        }

        const data: AddsResponse = await response.json()

        return data.data.rows;
    } catch (error) {
        console.error("Error en getAllAdds: ", error);
        throw error;
    }
}

export const getAddById = async( id: string): Promise<Adds> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/add/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if(!response.ok) {
            throw new Error("Error al obtener un producto adicional")
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error en getAddById: ", error);
        throw error;
    }
}

// Función para crear un nuevo producto adicional
export const createAdd = async (add: Adds): Promise<Adds> => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${port}/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(add),
      });
  
      if (!response.ok) {
        throw new Error("Error al crear el producto adicional");
      }
  
      const data: Adds = await response.json();
      return data;
    } catch (error) {
      console.error("Error en createAdd:", error);
      throw error;
    }
  };
  
  // Función para actualizar un producto adicional
  export const updateAdd = async (id: string, add: Adds): Promise<Adds> => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${port}/add/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(add),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el producto adicional");
      }
  
      const data: Adds = await response.json();
      return data;
    } catch (error) {
      console.error("Error en updateAdd:", error);
      throw error;
    }
  };
  
  // Función para eliminar un producto adicional
  export const deleteAdd = async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${port}/add/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al eliminar el producto adicional");
      }
    } catch (error) {
      console.error("Error en deleteAdd:", error);
      throw error;
    }
  };