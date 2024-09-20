import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert2
import "./styles.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Cambiamos a email
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Enviar la petición POST al servidor
      const response = await fetch("http://localhost:3310/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // Pasamos el email
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data:", data);
        console.log("Token antes de almacenar:", data.data.token);
        console.log("User ID antes de almacenar:", data.data.user.id);
        // Guardar el token en localStorage o cookies si es necesario
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.user.id);

        // Redirigir al home si el login es exitoso
        navigate("/home");
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Credenciales incorrectas", // Mostrar el mensaje de error del backend
          confirmButtonColor: "#007072",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con el servidor. Inténtalo de nuevo.",
        confirmButtonColor: "#007072",
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Bienvenido</h2>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="email" // Cambiar el tipo a email
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-button">
          Entrar
        </button>
        <button type="button" className="forgot-password">
          Olvidé mi contraseña
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
