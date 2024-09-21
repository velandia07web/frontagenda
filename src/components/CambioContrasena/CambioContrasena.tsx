import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./styles.css";

const CambioContraseña: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>(""); // Mensaje de éxito
  const [errorMessage, setErrorMessage] = useState<string>(""); // Mensaje de error
  const [passwordError, setPasswordError] = useState<string>(""); // Error de validación de contraseña
  const navigate = useNavigate(); // Inicializa el hook de navegación
  const passwordsMatch = password === verifyPassword && password.length > 0;

  // Expresión regular para validar la contraseña
  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
    const sqlInjectionPattern = /(['"\\\-\-;\*\=\<\>])/;

    if (!passwordRegex.test(password)) {
      return "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
    } else if (sqlInjectionPattern.test(password)) {
      return "La contraseña contiene caracteres no permitidos.";
    } else {
      return "";
    }
  };

  // Función para manejar el cambio en el campo de contraseña
  const handlePasswordChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Validar la contraseña
    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleVerifyPasswordVisibility = () => {
    setShowVerifyPassword(!showVerifyPassword);
  };

  // Función para manejar el cambio de contraseña
  const handlePasswordChange = async () => {
    if (!passwordError && passwordsMatch) {
      try {
        const response = await fetch(
          `http://localhost:3310/api/auth/resetPassword/${token}`, // Reemplaza TOKEN con el token válido
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password, verifyPassword }), // Enviamos la nueva contraseña en el cuerpo de la solicitud
          }
        );

        if (response.ok) {
          setSuccessMessage("Contraseña cambiada con éxito.");
          setErrorMessage(""); // Limpia cualquier mensaje de error
          // Redirige a la raíz después de un breve tiempo
          setTimeout(() => {
            navigate("/"); // Redirige a la página de inicio
          }, 1500); // 1.5segundos de retraso antes de redirigir (opcional)
        } else {
          setErrorMessage("Error al cambiar la contraseña.");
          setSuccessMessage(""); // Limpia cualquier mensaje de éxito
        }
      } catch (error) {
        setErrorMessage("Error en la solicitud. Inténtalo de nuevo.");
        setSuccessMessage("");
      }
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
            onChange={handlePasswordChangeInput}
            className={`input-field ${passwordsMatch ? "match" : ""} ${
              password && !passwordsMatch ? "no-match" : ""
            }`}
            required
            placeholder="Ingresa Nueva Contraseña"
            onPaste={(e) => e.preventDefault()} // Prevenir pegar en este campo
          />
          <span
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {passwordError && <p className="error-message">{passwordError}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="verify-password">Verificar Contraseña</label>
        <div className="password-wrapper">
          <input
            id="verifypassword"
            type={showVerifyPassword ? "text" : "password"}
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            className={`input-field ${passwordsMatch ? "match" : ""} ${
              verifyPassword && !passwordsMatch ? "no-match" : ""
            }`}
            required
            placeholder="Repite Contraseña"
            onPaste={(e) => e.preventDefault()} // Prevenir pegar en este campo
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
        disabled={!passwordsMatch || passwordError !== ""}
        onClick={handlePasswordChange} // Llamamos a la función de cambio de contraseña
      >
        Cambiar Contraseña
      </button>
    </div>
  );
};

export default CambioContraseña;
