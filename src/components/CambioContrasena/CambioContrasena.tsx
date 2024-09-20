import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./styles.css";

const CambioContraseña: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>(""); // Mensaje de éxito
  const [errorMessage, setErrorMessage] = useState<string>(""); // Mensaje de error

  const passwordsMatch = password === verifyPassword && password.length > 0;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleVerifyPasswordVisibility = () => {
    setShowVerifyPassword(!showVerifyPassword);
  };

  // Función para manejar el cambio de contraseña
  const handlePasswordChange = async () => {
    try {
      const response = await fetch(
        `http://localhost:3310/api/auth/resetPassword/TOKEN`, // Reemplaza TOKEN con el token válido
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }), // Enviamos la nueva contraseña en el cuerpo de la solicitud
        }
      );

      if (response.ok) {
        setSuccessMessage("Contraseña cambiada con éxito.");
        setErrorMessage(""); // Limpia cualquier mensaje de error
      } else {
        setErrorMessage("Error al cambiar la contraseña.");
        setSuccessMessage(""); // Limpia cualquier mensaje de éxito
      }
    } catch (error) {
      setErrorMessage("Error en la solicitud. Inténtalo de nuevo.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="cambio-container">
      <h2 className="form-title">Cambiar Contraseña</h2>

      <div className="input-group">
        <label htmlFor="password">Nueva Contraseña</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`input-field ${passwordsMatch ? "match" : ""} ${
              password && !passwordsMatch ? "no-match" : ""
            }`}
            required
            placeholder="Ingresa tu nueva contraseña"
          />
          <span
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="verify-password">Verificar Contraseña</label>
        <div className="password-wrapper">
          <input
            id="verify-password"
            type={showVerifyPassword ? "text" : "password"}
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            className={`input-field ${passwordsMatch ? "match" : ""} ${
              verifyPassword && !passwordsMatch ? "no-match" : ""
            }`}
            required
            placeholder="Repite tu nueva contraseña"
          />
          <span
            className="password-toggle-icon"
            onClick={toggleVerifyPasswordVisibility}
          >
            {showVerifyPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button
        type="submit"
        className="submit-button"
        disabled={!passwordsMatch}
        onClick={handlePasswordChange} // Llamamos a la función de cambio de contraseña
      >
        Cambiar Contraseña
      </button>
    </div>
  );
};

export default CambioContraseña;
