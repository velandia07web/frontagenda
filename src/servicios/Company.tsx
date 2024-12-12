const port = import.meta.env.VITE_API_BASE_URL;

export interface Company {
  id?: string; 
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: string; 
  website: string;
  industry: string; 
  clientId?: string; 
}

export interface CompanyResponse {
  status: number;
  message: string;
  data: {
    count: number;
    rows: Company[];
  };
}

// Obtener todas las compañías
export const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/company/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las compañías");
    }

    const data: CompanyResponse = await response.json();
    return data.data.rows;
  } catch (error) {
    console.error("Error en getAllCompanies: ", error);
    throw error;
  }
};

// Obtener una compañía por ID
export const getCompanyById = async (id: string): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/company/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la compañía");
    }

    const data: Company = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getCompanyById: ", error);
    throw error;
  }
};

// Crear una nueva compañía
export const createCompany = async (company: Company): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/company/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(company),
    });

    if (!response.ok) {
      throw new Error("Error al crear la compañía");
    }

    const data: Company = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createCompany: ", error);
    throw error;
  }
};

// Actualizar una compañía
export const updateCompany = async (id: string, company: Company): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/company/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(company),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la compañía");
    }

    const data: Company = await response.json();
    return data;
  } catch (error) {
    console.error("Error en updateCompany: ", error);
    throw error;
  }
};

// Eliminar una compañía
export const deleteCompany = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/company/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la compañía");
    }
  } catch (error) {
    console.error("Error en deleteCompany: ", error);
    throw error;
  }
};
