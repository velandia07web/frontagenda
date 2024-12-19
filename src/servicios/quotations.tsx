const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

export interface EventProduct {
    nameProduct: string;
    id: string;
    hour: string;
    price: number;
    numberHour: number;
    days: number;
    quantityPriceDeadHour: number;
    priceDeadHour: number;
    quantity: number;
}

export interface EventAdd {
    id?: string;
    nameAdd: string;
    quantity: number;
    price: number;
}

export interface EventPack {
    id: string;
    namePack: string;
    price: number;
    quantity: number;
}

export interface Event {
    id?: string;
    name: string;
    cityId: string;
    dateStart: string;
    dateEnd: string;
    days: number;
    total: number;
    transportPrice: number;
    packs: EventPack[];
    products: EventProduct[];
    adds: EventAdd[];
}

export interface Quotations {
    id?: string;
    reference?: string;
    clientId: string;
    discount: number;
    IVA: number;
    totalNeto: number;
    subTotal: number;
    typePricesId: string;
    telephone: string;
    SocialMediasId: string;
    email: string;
    userId?: string;
    events: Event[];
}

export interface QuotationsResume {
    id?: string;
    reference?: string;
    clientId: string;
    telephone: string;
    email: string;
    state?: string;
    subtotal?: number;
    IVA?: number;
    discount: number;
    totalNet?: number;
    etapa?: string;
    userId?: string;
    typePricesId: string;
    SocialMediasId: string;
    events: Event[];
}
export interface response {
    id: string;
    reference: string;
    clientId: string;
    discount: number;
    IVA: number;
    totalNet: number;
    subtotal: number;
    typePricesId: string;
    telephone: string;
    SocialMediasId: string;
    email: string;
    userId: string;
    state: string; 
    etapa: string; 
}

interface QuotationsResumeResponseWithArray {
    status: number;
    message: string;
    data: QuotationsResume[];
}

interface QuotationsResponse {
    status: number;
    message: string;
    data: response;
}


export const getAllQuotations = async (): Promise<QuotationsResume[]> => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${port}/quotation`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Hubo un error al obtener las cotizaciones");
        }

        const data: QuotationsResumeResponseWithArray = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error en getAllQuotations", error);
        throw error;
    }
}

export const getQuotationById = async (id: string): Promise<Quotations> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/quotation/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al obtener la cotización")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getQuotationById:", error)
        throw error;
    }
}


export const sendEmail = async (id: string) : Promise<Quotations> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/quotation/email/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error no se ha podido enviar el correo")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en sendEmail:", error)
        throw error;
    }
}

export const inactiveQuotation = async (id: string): Promise <Quotations> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/quotation/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error no se ha podido inactivar la cotización")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en inactiveQuotation:", error)
        throw error;
    }
}

export const createQuotation = async (quotation: Quotations): Promise<response> => {
    try {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")

        quotation.userId = userId || "";
        const response = await fetch(`${port}/quotation/quotations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(quotation),
        });

        if (!response.ok) {
            throw new Error("Error al crear una cotización")
        }

        const data: QuotationsResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error en createQuotation:", error);
        throw error;
    }
}

export const updateQuotation = async (id: string, quotation: Quotations): Promise<Quotations> => {
    try {
        const token = localStorage.getItem("token")

        const response = await fetch(`${port}/quotation/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(quotation),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar la cotización")
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en updateQuotation:", error);
        throw error;
    }
};