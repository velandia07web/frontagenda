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
import TablaProductos from "./components/tablaProductos/tablaProductos";
import TablaCiudades from "./components/tablaCiudades/tablaCiudades";
import CambioContrasena from "./components/CambioContrasena/CambioContrasena";
import PrivateRoute from "./components/auth/privateRoute"; // Importa tu PrivateRoute
import { AuthProvider } from "./components/context/AuthContext"; // Asegúrate de importar tu AuthProvider
import CotizacionPage from "./components/cotizacion/cotizacion";
import FormCotization from "./components/formCotizacion/formCotizacion";
import HomeInventory from "./components/HomeInventory/HomeInventory";
import TablaAdds from "./components/tablaAdds/tablaAdds";
import TablaPacks from "./components/tablaPacks/tablaPacks";
import HomeClient from "./components/HomeClients/HomeClient";
import TablaEmpresas from "./components/tablaEmpresas/tablaEmpresas";
import TablaPreciosPorZona from "./components/PrecioPorZona/PrecioPorZona";
import TablaPrecios from "./components/tableHours/tableHours";

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
                allowedRoles={["7ffeb105-5710-4348-b01f-45d5e19c06d4", "b7b46a2a-3161-4866-ab7d-6f6d8cffee36"]}
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
            <Route path="/TablaProductos" element={<TablaProductos />} />
            <Route path="/Cotizacion" element={<CotizacionPage />} />
            <Route path="/homeInventory" element={<HomeInventory />} />
            <Route path="/TablaPacks" element={<TablaPacks />} />
            <Route path="/TablaAdds" element={<TablaAdds />} />
            <Route path="/HomeClient" element={<HomeClient />} />
            <Route path="/TablaEmpresas" element={<TablaEmpresas />} />
            <Route path="/PreciosPorZona" element={<TablaPreciosPorZona />} />
            <Route path="/tablaPrecios/:idZone" element={<TablaPrecios />} />
            <Route path="/Crear_Cotizacion" element={<FormCotization reference={""} clientId={""} discount={0} typePricesId={""} telephone={""} SocialMediasId={""} email={""} events={[]} />} />
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
