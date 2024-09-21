//import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//import "datatables.net-dt/css/jquery.dataTables.css";
import LoginForm from "./components/LoginForm/LoginForm";
import HomePage from "./components/HomePage/HomePage";
import TablaClientes from "./components/tablaClientes/tablaClientes"; // Importa el componente correctamente
import TablaRoll from "./components/tablaRoll/tablaRoll";
import TablaEquipo from "./components/tablaEquipoTrabajo/tablaEquipo";
import TablaRed from "./components/tablaRedSocial/RedSocial";
import TablaZona from "./components/tablaZona/tablaZona";
import TablaCiudades from "./components/tablaCiudades/tablaCiudades";
import CambioContrasena from "./components/CambioContrasena/CambioContrasena";
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el formulario de login */}
        <Route path="/" element={<LoginForm />} />

        {/* Ruta para la página principal */}
        <Route path="/home" element={<HomePage />} />

        {/* Ruta para la tabla de clientes */}
        <Route path="/clientes" element={<TablaClientes />} />

        {/* Ruta para la tabla de roll */}
        <Route path="/roll" element={<TablaRoll />} />

        {/* Ruta para la tabla de equipo */}
        <Route path="/equipo" element={<TablaEquipo />} />

        {/* Ruta para la tabla de equipo */}
        <Route path="/red" element={<TablaRed />} />

        {/* Ruta para la tabla de equipo */}
        <Route path="/zona" element={<TablaZona />} />

        {/* Ruta para la tabla de equipo */}
        <Route path="/ciudad" element={<TablaCiudades />} />
        {/* Nueva ruta para el cambio de contraseña */}
        <Route
          path="/cambio-contrasena/:token"
          element={<CambioContrasena />}
        />
      </Routes>
    </Router>
  );
}

export default App;
