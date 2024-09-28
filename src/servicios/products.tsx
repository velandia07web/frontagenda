const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

// Define la interfaz de un Producto
export interface Product {
  id: string; // id opcional para la creación
  name: string;
  imagen: string;
  description: string;
  count: number;
  idZone: string;
}

// Interfaz para la respuesta de la API
interface ProductsResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Product[]; // rows es un arreglo de Product
  };
}

// Función para obtener todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/product/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    const data: ProductsResponse = await response.json();
    return data.data.rows; // Devuelve solo los rows de la respuesta
  } catch (error) {
    console.error("Error en getAllProducts:", error);
    throw error; // Maneja el error según tus necesidades
  }
};

// Función para obtener un producto específico por ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el producto");
    }

    const data = await response.json();
    return data; // Devuelve el producto encontrado
  } catch (error) {
    console.error("Error en getProductById:", error);
    throw error;
  }
};

// Función para crear un nuevo producto
export const createProduct = async (product: Product): Promise<Product> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/product/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(product), // Serializa el objeto product
    });

    if (!response.ok) {
      throw new Error("Error al crear el producto");
    }

    const data = await response.json();
    return data; // Devuelve el producto creado
  } catch (error) {
    console.error("Error en createProduct:", error);
    throw error;
  }
};

// Función para actualizar un producto existente
export const updateProduct = async (
  id: string,
  product: Product
): Promise<Product> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(product), // Serializa el objeto product
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el producto");
    }

    const data = await response.json();
    return data; // Devuelve el producto actualizado
  } catch (error) {
    console.error("Error en updateProduct:", error);
    throw error;
  }
};

// Función para eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    throw error;
  }
};
