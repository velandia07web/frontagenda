const port = import.meta.env.VITE_API_BASE_URL;

export interface ClientResume {
  id: string;
  name: string;
  lastName: string;
  CC: string;
  idTypeClient: string;
  email: string;
  idCompany: string;
  celphone: string;
  charge: string;
  idUser: string;
  idSocialMedia: string;
  cupoDisponible: number;
  cupoCopado: number;
  state: string;
  typePayment: string;
  idPaymentsDate: string;
  createdAt: string;    // Added
  updatedAt: string;    // Added
}

export interface EventResume {
  id: string;
  name: string;
  cityId: string;
  dateStart: string;
  dateEnd: string;
  total: number;
  quotationId: string;
  days: number;
  transportPrice: number;
  createdAt: string;    // Added
  updatedAt: string;    // Added
}

export interface QuotationResume {
  id: string;
  reference: string;
  clientId: string;
  typePricesId: string;
  telephone: string;
  SocialMediasId: string;
  email: string;
  userId: string;
  subtotal: number;
  discount: number;
  IVA: number;
  totalNet: number;
  state: string;
  etapa: string;
  createdAt: string;    // Added
  updatedAt: string;    // Added
  Client: ClientResume;
  Events: EventResume[];
}

export interface SaleData {
  id: string;
  idQuotation: string;
  idPaymentsDate: string | null;
  arrearsDays: number | null;      // Changed to string | null
  timelyPaymentDate: string | null;
  idPass: string | null;
  pendingPayment: number | null;
  idInvoice: string | null;
  dateInvoice: string | null;
  state: string;
  etapa: string;
  createdAt: string;    // Added
  updatedAt: string;    // Added
  Quotation: QuotationResume;
  PaymentsDate: string | null;   // Changed to specific null
}

export interface SalesResume {
  saleId: string;
  sale: SaleData;       // Added sale object
  totalNet: number;
  IVA: number;
  subtotal: number;
  totalTransport: number;
  methodOfPayment: string;
  fechaDePago: string;
  totalAbono: number;
}

export interface SalesResumeAll {
  status: number;
  message: string;
  data: SalesResume;
}

export interface Sales {
  saleId?: string;
  quotationid?: string;
  clientName: string;
  totalNet: number;
  IVA: number;
  subtotal: number;
  totalTransport: number;
  pendingPayment: number;
  totalPayments: number;
  state: string;
  etapa: string;
  invoiceDate: string;
  createdAt: string;
}

interface SalesResponse {
  status: number;
  message: string;
  data: Sales[];
}

// Obtener todas las ventas
export const getAllSales = async (): Promise<Sales[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/sales/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las ventas");
    }

    const data: SalesResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error en getAllSales: ", error);
    throw error;
  }
};

// Obtener todas las ventas
export const getAllSalesByUser = async (id: string): Promise<Sales[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/sales/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las ventas");
    }

    const data: SalesResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error en getAllSales: ", error);
    throw error;
  }
};

// Obtener una venta por ID
export const getSaleById = async (id: string): Promise<SalesResume> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/sales/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la venta");
    }

    const data: SalesResumeAll = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error en getSaleById: ", error);
    throw error;
  }
};

// Crear una nueva venta
export const createSale = async (sale: Sales): Promise<Sales> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/sales/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sale),
    });

    if (!response.ok) {
      throw new Error("Error al crear la venta");
    }

    const data: Sales = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createSale: ", error);
    throw error;
  }
};

// Actualizar una venta
export const updateSale = async (id: string, sale: Sales): Promise<Sales> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/sales/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sale),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la venta");
    }

    const data: Sales = await response.json();
    return data;
  } catch (error) {
    console.error("Error en updateSale: ", error);
    throw error;
  }
};

// Eliminar una venta
export const deleteSale = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/sales/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la venta");
    }
  } catch (error) {
    console.error("Error en deleteSale: ", error);
    throw error;
  }
};
