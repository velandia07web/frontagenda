import React, { useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import NavbarComponent from "../Navbar/Navbar";
import "./HomeClient.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const HomeClient: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };

  const goToCompanys = () => {
    navigate("/TablaEmpresas"); // Navega a la ruta de la tabla de roll
  };

  const goToClients = () => {
    navigate("/clientes"); // Navega a la ruta de la tabla de roll
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
            <div className="card" onClick={goToCompanys}>
              <FontAwesomeIcon icon={faUsers} className="card-icon" />
              <h3>Empresas</h3>
            </div>

            <div className="card" onClick={goToClients}>
              <FontAwesomeIcon icon={faUsers} className="card-icon" />
              <h3>Clientes</h3>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeClient;
