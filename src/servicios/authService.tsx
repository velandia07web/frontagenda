export const logout = async (): Promise<boolean> => {
  try {
    // Supongamos que tienes el ID del usuario almacenado en el token o localStorage.
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Aquí deberías obtener el id del usuario
    console.log(userId);

    if (!token || !userId) {
      console.error(
        "No se encontró el token de autenticación o el ID del usuario."
      );
      return false;
    }

    const response = await fetch(`http://localhost:3310/api/auth/${userId}`, {
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
