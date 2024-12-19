import React, { useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import NavbarComponent from "../Navbar/Navbar";
import "./HomeInventory.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faTag
} from "@fortawesome/free-solid-svg-icons";

const HomeInventory: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };

  const goToInvetory = () => {
    navigate("/TablaProductos"); // Navega a la ruta de la tabla de roll
  };

  const goToPacks = () => {
    navigate("/TablaPacks"); // Navega a la ruta de la tabla de roll
  };

  const goToAdds = () => {
    navigate("/TablaAdds"); // Navega a la ruta de la tabla de roll
  };

  const goToPrice = () => {
    navigate("/PreciosPorZona"); // Navega a la ruta de la tabla de roll
  };

  const goToPricePack = () => {
    navigate("/PreciosPorZonaPacks"); // Navega a la ruta de la tabla de roll
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
            <div className="card" onClick={goToInvetory}>
              <FontAwesomeIcon icon={faBoxes} className="card-icon" />
              <h3>Cabinas</h3>
            </div>

            <div className="card" onClick={goToAdds}>
              <FontAwesomeIcon icon={faBoxes} className="card-icon" />
              <h3>Adicionales</h3>
            </div>

            <div className="card" onClick={goToPacks}>
              <FontAwesomeIcon icon={faBoxes} className="card-icon" />
              <h3>Paquetes</h3>
            </div>
          </div>
          <div className="uniqueCard">
            <div className="card" onClick={goToPrice}>
              <FontAwesomeIcon icon={faTag} className="card-icon" />
              <h3>Precio de horas de cabinas por zona</h3>
            </div><div className="card" onClick={goToPricePack}>
              <FontAwesomeIcon icon={faTag} className="card-icon" />
              <h3>Precio de horas de paquetes por zona</h3>
            </div>
          </div>
          <div className="uniqueCard">
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeInventory;
