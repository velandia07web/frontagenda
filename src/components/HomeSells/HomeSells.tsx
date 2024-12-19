import React, { useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import NavbarComponent from "../Navbar/Navbar";
import "./HomeSells.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faDollarSign,
  faCalendarDays
} from "@fortawesome/free-solid-svg-icons";

const HomeSells: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };

  const goToCotizaciones = () => {
    navigate("/cotizaciones"); // Navega a la ruta de la tabla de roll
  };

  const goToSells = () => {
    const userId = localStorage.getItem("userId")
    navigate(`/Ventas/${userId}`); // Navega a la ruta de la tabla de roll
  };
  const goToDays = () => {
    navigate("/Dias_de_pago"); // Navega a la ruta de la tabla de roll
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
            <div className="card" onClick={goToCotizaciones}>
              <FontAwesomeIcon icon={faReceipt} className="card-icon" />
              <h3>Cotizaciones</h3>
            </div>
            <div className="card" onClick={goToDays}>
              <FontAwesomeIcon icon={faCalendarDays} className="card-icon" />
              <h3>Días de mora</h3>
            </div>
            <div className="card" onClick={goToSells}>
              <FontAwesomeIcon icon={faDollarSign} className="card-icon" />
              <h3>Ventas</h3>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeSells;
