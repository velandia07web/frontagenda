import { Company } from "./Company";
// Base URL
const port = import.meta.env.VITE_API_BASE_URL;

// Interfaz Client
export interface Client {
    id?: string;
    name: string;
    lastName: string;
    CC: string;
    email: string;
    idCompany: string;
    celphone: string;
    charge: string;
    cupoDisponible: number;
    cupoCopado: number;
    numberDocument: string;
    idUser?: string; //
    idSocialMedia?: string; //
    idTypeDocument?: string;
    idTypeClient?: string; //
}

export interface clientFiltred{
    idCliente?: string;
    nameCliente: string;
    nameCompany: string;
    telCliente: string;
    emailcliente: string;
    typeClient: string;
}

interface clientsFiltred {
    status: number;
    message: string;
    data: clientFiltred[];
}

// Respuesta del backend para Client
interface ClientResponse {
    status: number;
    message: string;
    data: {
        count: number;
        rows: Client[];
    };
}

// Obtener todos los clientes
export const getAllClients = async (): Promise<Client[]> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/client/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los clientes");
        }

        const data: ClientResponse = await response.json();
        return data.data.rows;
    } catch (error) {
        console.error("Error en getAllClients:", error);
        throw error;
    }
};


export const getAllClientsFiltred = async (): Promise<clientFiltred[]> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/client/getAllClientsCompany`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los clientes");
        }

        const data: clientsFiltred = await response.json();
        console.log()
        return data.data;
    } catch (error) {
        console.error("Error en getAllClients:", error);
        throw error;
    }
};

// Obtener un cliente por ID
export const getClientById = async (id: string): Promise<Client> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/client/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener un cliente");
        }

        const data: Client = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getClientById:", error);
        throw error;
    }
};

export const getCompanyByClientId = async (id: string): Promise<Company> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/client/company/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener una compañia del cliente");
        }
        console.log(response)

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getCompanyByClientId:", error);
        throw error;
    }
};

// Crear un nuevo cliente
export const createClient = async (client: Client): Promise<Client> => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        console.log(client)

        client.idUser = userId || "";
        console.log(client)
        if(client.CC == ""){
            client.CC = client.numberDocument
        }
        console.log(client)

        const response = await fetch(`${port}/client/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(client),
        });

        if (!response.ok) {
            throw new Error("Error al crear el cliente");
        }

        const data: Client = await response.json();
        return data;
    } catch (error) {
        console.error("Error en createClient:", error);
        throw error;
    }
};

// Actualizar un cliente
export const updateClient = async (id: string, client: Client): Promise<Client> => {
    try {
        const token = localStorage.getItem("token");

        console.log(id)
        console.log(client)

        const response = await fetch(`${port}/client/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(client),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el cliente");
        }

        const data: Client = await response.json();
        return data;
    } catch (error) {
        console.error("Error en updateClient:", error);
        throw error;
    }
};

// Eliminar un cliente
export const deleteClient = async (id: string): Promise<void> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${port}/client/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el cliente");
        }
    } catch (error) {
        console.error("Error en deleteClient:", error);
        throw error;
    }
};
