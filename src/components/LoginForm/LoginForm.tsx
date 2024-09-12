import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert2
import "./styles.css";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "jhonatan" && password === "123") {
      navigate("/home");
    } else {
      Swal.fire({
        icon: "error", // Tipo de ícono
        title: "Error",
        text:
          username !== "jhonatan"
            ? "Usuario incorrecto"
            : "Contraseña incorrecta", // Mensaje dinámico
        confirmButtonColor: "#007072", // Color del botón de confirmación
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
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
