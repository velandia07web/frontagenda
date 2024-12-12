const port = import.meta.env.VITE_API_BASE_URL;

export interface TypeDocument {
  id?: string;
  name: string;
}

interface TypeDocumentResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: TypeDocument[];
  };
}

// Obtener todos los documentos
export const getAllTypeDocuments = async (): Promise<TypeDocument[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeDocument/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los tipos de documento");
    }

    const data: TypeDocumentResponse = await response.json();

    return data.data.rows;
  } catch (error) {
    console.error("Error en getAllTypeDocuments:", error);
    throw error;
  }
};

// Obtener un tipo de documento por ID
export const getTypeDocumentById = async (id: string): Promise<TypeDocument> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeDocument/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el tipo de documento");
    }

    const data: TypeDocument = await response.json();

    return data;
  } catch (error) {
    console.error("Error en getTypeDocumentById:", error);
    throw error;
  }
};

// Crear un nuevo tipo de documento
export const createTypeDocument = async (
  typeDocument: TypeDocument
): Promise<TypeDocument> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeDocument/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(typeDocument),
    });

    if (!response.ok) {
      throw new Error("Error al crear el tipo de documento");
    }

    const data: TypeDocument = await response.json();

    return data;
  } catch (error) {
    console.error("Error en createTypeDocument:", error);
    throw error;
  }
};

// Actualizar un tipo de documento
export const updateTypeDocument = async (
  id: string,
  typeDocument: TypeDocument
): Promise<TypeDocument> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeDocument/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(typeDocument),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el tipo de documento");
    }

    const data: TypeDocument = await response.json();

    return data;
  } catch (error) {
    console.error("Error en updateTypeDocument:", error);
    throw error;
  }
};

// Eliminar un tipo de documento
export const deleteTypeDocument = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/typeDocument/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el tipo de documento");
    }
  } catch (error) {
    console.error("Error en deleteTypeDocument:", error);
    throw error;
  }
};
