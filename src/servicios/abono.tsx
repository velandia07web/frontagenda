const port = import.meta.env.VITE_API_BASE_URL;
export interface Abono {
    quotationId: string;
    payment: number;
    file: File | null;
}

// Modelo para un pago dentro de un pase
export interface PassPayment {
    id: string;
    idPass: string;
    payment: number;
    file: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Modelo para un pase relacionado con una cotización
  export interface QuotationPass {
    id: string;
    quotationId: string;
    createdAt: string;
    updatedAt: string;
    PassPayments: PassPayment[];
  }
  
  // Respuesta de la API para un pase
  export interface AbonosResponse {
    status: number; // Código de estado de la respuesta
    message: string; // Mensaje de la API
    data: QuotationPass; // Un solo pase con sus pagos
  }
  
  export const getFile = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${port}/pass/file/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener el archivo");
      }
  
      // Convertir la respuesta en un Blob (archivo binario)
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error en getFile: ", error);
      throw error;
    }
  };
  

// Obtener un pase y sus pagos
export const getAllAbonos = async (id: string): Promise<QuotationPass> => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${port}/pass/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener los abonos");
      }
  
      // Analizar la respuesta de la API
      const responseData: AbonosResponse = await response.json();
  
      // Retornar el objeto `QuotationPass` dentro de `data`
      return responseData.data;
    } catch (error) {
      console.error("Error en getAllAbonos: ", error);
      throw error;
    }
  };
  

// Obtener un abono por ID
export const getAbonoById = async (id: string): Promise<Abono> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/pass/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener el abono");
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error en getAbonoById: ", error);
        throw error;
    }
};

// Crear un nuevo abono
export const createAbono = async (abono: Abono): Promise<Abono> => {
    try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("quotationId", abono.quotationId);
        formData.append("payment", abono.payment.toString());
        formData.append("file", abono.file!);

        console.log(formData.get('quotationId'))

        const response = await fetch(`${port}/pass/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error al crear el abono");
        }

        const data: Abono = await response.json();
        return data;
    } catch (error) {
        console.error("Error en createAbono: ", error);
        throw error;
    }
};

// Actualizar un abono
export const updateAbono = async (id: string, abono: Abono): Promise<Abono> => {
    try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("quotationId", abono.quotationId);
        formData.append(    "payment", abono.payment.toString());
        formData.append("file", abono.file!);

        const response = await fetch(`${port}/pass/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el abono");
        }

        const data: Abono = await response.json();
        return data;
    } catch (error) {
        console.error("Error en updateAbono: ", error);
        throw error;
    }
};

// Eliminar un abono
export const deleteAbono = async (id: string): Promise<void> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/pass/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el abono");
        }
    } catch (error) {
        console.error("Error en deleteAbono: ", error);
        throw error;
    }
};
