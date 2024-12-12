const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API


export interface EventProduct {
    id?: string;
    hours: number;
    days: number;
    quantity: number;
}

export interface EventAdd {
    id?: string;
    quantity: number;
}

export interface EventPack {
    id: string;
}

export interface Event {
    id?: string;
    name: string;
    cityId: string;
    dateEvent: string;
    packs: EventPack[];
    products: EventProduct[];
    adds: EventAdd[];
}

export interface Quotations {
    id?: string;
    reference: string;
    clientId: string;
    discount: number;
    typePricesId: string;
    telephone: string;
    SocialMediasId: string;
    email: string;
    userId?: string;
    events: Event[];
}

export interface QuotationsResume {
    id?: string;
    reference: string;
    clientId: string;
    discount: number;
    typePricesId: string;
    telephone: string;
    SocialMediasId: string;
    email: string;
    userId?: string;
    subtotal?: number;
    IVA?: number;
    state?: string;
    totalNet?: number;
    events: Event[];
}
interface QuotationsResumeResponse {
    status: number;
    message: string;
    data: QuotationsResume;
}

interface QuotationsResumeResponseWithArray {
    status: number;
    message: string;
    data: QuotationsResume[];
}
interface QuotationsResponse {
    status: number;
    message: string;
    data: {
        count: number;
        rows: Quotations[];
    }
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

        const response = await fetch(`${port}/${id}/inactivate`, {
            method: "PATCH",
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

export const createQuotation = async (quotation: Quotations): Promise<Quotations> => {
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

        const data: QuotationsResumeResponse = await response.json();
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