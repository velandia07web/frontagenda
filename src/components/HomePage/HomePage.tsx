import React, { useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import NavbarComponent from "../Navbar/Navbar";
import "./HomePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faShoppingCart,
  faBoxes,
  faCalendarAlt,
  faTag, // Icono para 'Precios'
  faCity, // Icono para 'Ciudades'
  faCog, // Icono para 'Equipo de Trabajo'
  faPuzzlePiece, // Icono para 'Productos Adicionales'
} from "@fortawesome/free-solid-svg-icons";

const HomePage: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };
  const goToClientes = () => {
    navigate("/clientes"); // Navega a la ruta de la tabla de clientes
  };

  const goTored = () => {
    navigate("/red"); // Navega a la ruta de la tabla de roll
  };

  const goTozonas = () => {
    navigate("/zona"); // Navega a la ruta de la tabla de roll
  };

  const goTociudades = () => {
    navigate("/ciudad"); // Navega a la ruta de la tabla de roll
  };

  const goToequipo = () => {
    navigate("/equipo"); // Navega a la ruta de la tabla de roll
  };
  const goToproductos = () => {
    navigate("/TablaProductos"); // Navega a la ruta de la tabla de roll
  };

  return (
    <div className="homepage-container">
      <NavbarComponent />
      <div className="d-flex">
        <SlideMenu onToggleMenu={handleToggleMenu} />
        <main
          className={`content-area ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <div className="dashboard-cards">
            <div className="card" onClick={goTored}>
              <FontAwesomeIcon icon={faPuzzlePiece} className="card-icon" />
              <h3>Tabla Redes</h3>
            </div>

            <div className="card" onClick={goTozonas}>
              <FontAwesomeIcon icon={faPuzzlePiece} className="card-icon" />
              <h3>Tabla Zonas</h3>
            </div>

            <div className="card" onClick={goTociudades}>
              <FontAwesomeIcon icon={faCity} className="card-icon" />
              <h3>Ciudades</h3>
            </div>

            <div className="card" onClick={goToequipo}>
              <FontAwesomeIcon icon={faCog} className="card-icon" />
              <h3>Equipo de Trabajo</h3>
            </div>

            <div className="card" onClick={goToproductos}>
              <FontAwesomeIcon icon={faBoxes} className="card-icon" />
              <h3>Inventario</h3>
            </div>

            <div className="card" onClick={goToClientes}>
              {/* Agrega el evento de clic */}
              <FontAwesomeIcon icon={faUsers} className="card-icon" />
              <h3>Clientes</h3>
            </div>

            <div className="card">
              <FontAwesomeIcon icon={faShoppingCart} className="card-icon" />
              <h3>Ventas</h3>
            </div>

            <div className="card">
              <FontAwesomeIcon icon={faCalendarAlt} className="card-icon" />
              <h3>Eventos</h3>
            </div>
            <div className="card">
              <FontAwesomeIcon icon={faTag} className="card-icon" />
              <h3>Precios</h3>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
