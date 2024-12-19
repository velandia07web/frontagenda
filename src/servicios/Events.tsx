const port = import.meta.env.VITE_API_BASE_URL; // URL de tu API

export interface Event {
    id: string;
    name: string;
    cityId: string;
    dateStart: string;
    dateEnd: string;
    total: number;
    days: number;
    transportPrice: number;
    status: string;
    personName?: string;
    personPhone?: string;
    eventImage?: string;
    eventDescription?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
    quotationId?: string;  // El campo original quotationId
    quotationReference?: string;  // El nuevo campo quotationReference, opcional
    coordinatorId?: string;
    designerId?: string;
    logisticId?: string;
    coordinator?: {id?: string, name: string, email: string, cedula: string}
    designer?: {id?: string, name: string, email: string, cedula: string}
    logistic?: {id?: string, name: string, email: string, cedula: string}
    eventAdds?: { name: string, description: string, quantity: number }[];  // Ahora es opcional
    eventPacks?: { name: string, description: string, quantity: number }[]; // Ahora es opcional
    eventProducts?: { name: string, description: string, quantity: number }[]; // Ahora es opcional
  }
  
  
interface EventsResponse {
    status: number;
    message: string;
    data:  Event[]; // rows es un arreglo de Event
}

// Función para obtener todos los eventos
export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const token = localStorage.getItem("token"); // Obtiene el token del localStorage

        const response = await fetch(`${port}/event/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agrega el token en el header
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los eventos");
        }

        const data: EventsResponse = await response.json();
        return data.data; // Devuelve solo los rows de la respuesta
    } catch (error) {
        console.error("Error en getAllEvents:", error);
        throw error; // Maneja el error según tus necesidades
    }
};

// Función para obtener un evento específico por ID
export const getEventById = async (id: string): Promise<Event> => {
    try {
        const token = localStorage.getItem("token"); // Obtén el token del localStorage

        const response = await fetch(`${port}/event/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agrega el token en el header
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener el evento");
        }

        const data = await response.json();
        return data.data; // Devuelve el evento encontrado
    } catch (error) {
        console.error("Error en getEventById:", error);
        throw error;
    }
};

// Función para crear un nuevo evento
export const createEvent = async (event: Event): Promise<Event> => {
    try {
        const token = localStorage.getItem("token"); // Obtén el token del localStorage

        const response = await fetch(`${port}/event/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agrega el token en el header
            },
            body: JSON.stringify(event), // Serializa el objeto event
        });

        if (!response.ok) {
            throw new Error("Error al crear el evento");
        }

        const data = await response.json();
        return data; // Devuelve el evento creado
    } catch (error) {
        console.error("Error en createEvent:", error);
        throw error;
    }
};

// Función para actualizar un evento existente
export const updateEvent = async (id: string, event: Event): Promise<Event> => {
    try {
        const token = localStorage.getItem("token"); // Obtén el token del localStorage

        const response = await fetch(`${port}/event/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agrega el token en el header
            },
            body: JSON.stringify(event), // Serializa el objeto event
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el evento");
        }

        const data = await response.json();
        return data; // Devuelve el evento actualizado
    } catch (error) {
        console.error("Error en updateEvent:", error);
        throw error;
    }
};

// Función para eliminar un evento
export const deleteEvent = async (id: string): Promise<void> => {
    try {
        const token = localStorage.getItem("token"); // Obtén el token del localStorage

        const response = await fetch(`${port}/event/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`, // Agrega el token en el header
            },
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el evento");
        }
    } catch (error) {
        console.error("Error en deleteEvent:", error);
        throw error;
    }
};