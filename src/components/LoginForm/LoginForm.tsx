import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser, forgotPassword } from "../../servicios/authService"; // Importar funciones del servicio
import "./styles.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Campo de email para login
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // Función para enviar el login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await loginUser(email, password);
    if (result.success) {
      localStorage.setItem("token", result.data.data.token);
      localStorage.setItem("userId", result.data.data.user.id);
      navigate("/home");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error || "Error al autenticar usuario",
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
      const result = await forgotPassword(email);
      if (result.success) {
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
          text: result.error || "No se pudo enviar el correo de recuperación.",
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
            type="email"
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
