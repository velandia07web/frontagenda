const port = import.meta.env.VITE_API_BASE_URL;

export interface Notification {
    id: string; // UUID
    userId: string; // UUID
    description: string; // Texto de la descripción
  }


export const getAllNotificationsbyUser = async (id: string): Promise<Notification[]> => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${port}/notifications/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener las notificaciones");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getAllNotifications: ", error);
      throw error;
    }
  };

// Obtener todas las notificaciones
export const getAllNotifications = async (): Promise<Notification[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/notifications/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las notificaciones");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getAllNotifications: ", error);
    throw error;
  }
};

// Generar una notificación
export const generateNotification = async (description: string): Promise<Notification> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/notifications/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al generar la notificación");
    }

    const data: Notification = await response.json();
    return data;
  } catch (error) {
    console.error("Error en generateNotification: ", error);
    throw error;
  }
};

// Generar pagos (según lo que se necesita para este endpoint, puedes ajustarlo)
export const generatePaymentsNotification = async (description: string): Promise<Notification> => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${port}/notifications/generate-payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al generar la notificación de pagos");
    }

    const data: Notification = await response.json();
    return data;
  } catch (error) {
    console.error("Error en generatePaymentsNotification: ", error);
    throw error;
  }
};
