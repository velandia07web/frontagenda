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
import PrivateRoute from "./components/auth/privateRoute"; // Importa tu PrivateRoute
import { AuthProvider } from "./components/context/AuthContext"; // Asegúrate de importar tu AuthProvider
function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Asegúrate de que el AuthProvider envuelva el Router */}
      <Router>
        <Routes>
          {/* Ruta para el formulario de login */}
          <Route path="/" element={<LoginForm />} />

          {/* Rutas protegidas para el superadministrador */}
          <Route
            element={
              <PrivateRoute
                allowedRoles={["e2f26662-950f-4c66-895e-7c34bf74f2d8"]}
              />
            }
          >
            {/* Ruta para la página principal */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/clientes" element={<TablaClientes />} />
            <Route path="/roll" element={<TablaRoll />} />
            <Route path="/equipo" element={<TablaEquipo />} />
            <Route path="/red" element={<TablaRed />} />
            <Route path="/zona" element={<TablaZona />} />
            <Route path="/ciudad" element={<TablaCiudades />} />
          </Route>

          {/* Rutas protegidas para el comercial */}
          <Route element={<PrivateRoute allowedRoles={[""]} />}>
            {/* Agrega aquí las rutas que el comercial puede ver */}
            <Route path="/clientes" element={<TablaClientes />} />
            <Route path="/roll" element={<TablaRoll />} />
          </Route>

          {/* Nueva ruta para el cambio de contraseña */}
          <Route
            path="/cambio-contrasena/:token"
            element={<CambioContrasena />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
