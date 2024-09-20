// roleService.ts
const API_URL = "http://localhost:3310/api/rol"; // URL del backend

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Error en la solicitud");
  }
  return response.json();
};

// Obtener todos los roles
export const getRoles = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    throw error;
  }
};

// Crear un nuevo rol
export const createRole = async (name: string) => {
  try {
    const response = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error al crear el rol:", error);
    throw error;
  }
};

// Actualizar un rol existente
export const updateRole = async (id: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    throw error;
  }
};

// Eliminar un rol
export const deleteRole = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    throw error;
  }
};
