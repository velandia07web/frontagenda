import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { cambiarContraseña } from "../../servicios/authService"; // Importar la función de auth.ts
import "./cambioContrasena.css";

const CambioContraseña: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();
  const passwordsMatch = password === verifyPassword && password.length > 0;

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

  const handlePasswordChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleVerifyPasswordVisibility = () => {
    setShowVerifyPassword(!showVerifyPassword);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordError && passwordsMatch) {
      try {
        await cambiarContraseña(token || "", password, verifyPassword);
        setSuccessMessage("Contraseña cambiada con éxito.");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/"); // Redirige a la página de inicio después de 1.5 segundos
        }, 1500);
      } catch (error) {
        setErrorMessage(
          "Error al cambiar la contraseña. Inténtalo de nuevo más tarde."
        );
        setSuccessMessage("");
      }
    }
  };

  return (
    <div className="cambio-container">
      <form className="passwor-form" onSubmit={handlePasswordChange}>
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
        >
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
};

export default CambioContraseña;
