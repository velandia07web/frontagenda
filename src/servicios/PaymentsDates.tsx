const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

// Interfaz para PaymentDates
export interface PaymentDates {
  id?: string; // El ID puede ser opcional al momento de crear
  numberDays: number; // Número de días
}

// Interfaz para la respuesta de la API
interface PaymentDatesResponse {
  status: number;
  message: string;
  data: PaymentDates[]; // rows es un arreglo de PaymentDates
}

// Función para obtener todos los registros de PaymentDates
export const getAllPaymentDates = async (): Promise<PaymentDates[]> => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    const response = await fetch(`${port}/paymentsDate/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los registros de PaymentDates");
    }

    const data: PaymentDatesResponse = await response.json();
    return data.data; // Devuelve solo los rows de la respuesta
  } catch (error) {
    console.error("Error en getAllPaymentDates:", error);
    throw error;
  }
};

// Función para obtener un registro específico de PaymentDates por ID
export const getPaymentDateById = async (id: string): Promise<PaymentDates> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/paymentsDate/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el registro de PaymentDates");
    }

    const data = await response.json();
    return data; // Devuelve el registro encontrado
  } catch (error) {
    console.error("Error en getPaymentDateById:", error);
    throw error;
  }
};

// Función para crear un nuevo registro de PaymentDates
export const createPaymentDate = async (paymentDate: PaymentDates): Promise<PaymentDates> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/paymentsDate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(paymentDate), // Serializa el objeto paymentDate
    });

    if (!response.ok) {
      throw new Error("Error al crear el registro de PaymentDates");
    }

    const data = await response.json();
    return data; // Devuelve el registro creado
  } catch (error) {
    console.error("Error en createPaymentDate:", error);
    throw error;
  }
};

// Función para actualizar un registro existente de PaymentDates
export const updatePaymentDate = async (id: string, paymentDate: PaymentDates): Promise<PaymentDates> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/paymentsDate/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
      body: JSON.stringify(paymentDate), // Serializa el objeto paymentDate
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el registro de PaymentDates");
    }

    const data = await response.json();
    return data; // Devuelve el registro actualizado
  } catch (error) {
    console.error("Error en updatePaymentDate:", error);
    throw error;
  }
};

// Función para eliminar un registro de PaymentDates
export const deletePaymentDate = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    const response = await fetch(`${port}/paymentsDate/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en el header
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el registro de PaymentDates");
    }
  } catch (error) {
    console.error("Error en deletePaymentDate:", error);
    throw error;
  }
};
