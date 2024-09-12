//import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//import "datatables.net-dt/css/jquery.dataTables.css";
import LoginForm from "./components/LoginForm/LoginForm";
import HomePage from "./components/HomePage/HomePage";
//import TablaClientes from "./components/tablaClientes/tablaClientes"; // Importa el componente correctamente

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el formulario de login */}
        <Route path="/" element={<LoginForm />} />

        {/* Ruta para la página principal */}
        <Route path="/home" element={<HomePage />} />

        {/* Ruta para la tabla de clientes 
        <Route path="/clientes" element={<TablaClientes />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
