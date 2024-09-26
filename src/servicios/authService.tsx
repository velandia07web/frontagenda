const port = import.meta.env.VITE_API_BASE_URL;
//funcion para cerrar sesion
export const logout = async (): Promise<boolean> => {
  try {
    // Supongamos que tienes el ID del usuario almacenado en el token o localStorage.
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Aquí deberías obtener el id del usuario
    localStorage.removeItem("rol");
    //console.log(userId);
    //console.log("hola", import.meta.env.VITE_API_BASE_URL);

    if (!token || !userId) {
      console.error(
        "No se encontró el token de autenticación o el ID del usuario."
      );

      return false;
    }

    const response = await fetch(`${port}/auth/${userId}`, {
      // Incluye el ID en la URL
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer Tocken ${token}`, // Añadir el token en la cabecera Authorization
      },
    });

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId"); // Opcional: eliminar el ID si es necesario
      localStorage.removeItem("user");
      return true;
    } else {
      console.error("Error al cerrar la sesión");
      return false;
    }
  } catch (error) {
    console.error("Error en la solicitud de cierre de sesión", error);
    return false;
  }
};

//funcion para iniciar sesion
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${port}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, error: "Error al autenticar usuario" };
    }
  } catch (error) {
    return { success: false, error: "Hubo un problema con el servidor" };
  }
};

//funcion para mensaje cambio contrseña
export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(`${port}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      return { success: true, message: "Correo enviado" };
    } else {
      return {
        success: false,
        error: "No se pudo enviar el correo de recuperación",
      };
    }
  } catch (error) {
    return { success: false, error: "Hubo un problema con el servidor" };
  }
};

//funcion cambio contraseña
export const cambiarContraseña = async (
  token: string,
  password: string,
  verifyPassword: string
) => {
  try {
    const response = await fetch(`${port}/auth/resetPassword/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, verifyPassword }),
    });

    if (!response.ok) {
      throw new Error("Error al cambiar la contraseña.");
    }

    return response.json(); // Puedes manejar la respuesta como necesites
  } catch (error) {
    throw error; // Lanza el error para que sea capturado en el componente
  }
};
