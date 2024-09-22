import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert2
import "./styles.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Campo de email para login
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // Función para enviar el loginºº
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3310/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.user.id);

        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al autenticar usuario",
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

  // Función para recuperar contraseña
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Recuperar contraseña",
      text: "Por favor, ingresa tu correo para recuperar tu contraseña.",
      input: "email", // Input de tipo correo electrónico
      inputPlaceholder: "Correo electrónico",
      showCancelButton: true,
      confirmButtonColor: "#007072",
      cancelButtonColor: "#d33",
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar tu correo";
        }
      },
    });

    if (email) {
      try {
        const response = await fetch("http://localhost:3310/api/auth/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email, // Se envía el correo ingresado
          }),
        });

        if (response.ok) {
          Swal.fire({
            title: "Correo enviado",
            text: "Revisa tu bandeja de entrada para continuar con la recuperación de tu contraseña.",
            icon: "success",
            confirmButtonColor: "#007072",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar el correo de recuperación.",
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
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Bienvenido</h2>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="email" // Input de tipo email
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

        {/* Botón para abrir la recuperación de contraseña */}
        <button
          type="button"
          className="forgot-password"
          onClick={handleForgotPassword}
        >
          Olvidé mi contraseña
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
