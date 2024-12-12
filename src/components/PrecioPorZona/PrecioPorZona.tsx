import React, { useEffect, useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import NavbarComponent from "../Navbar/Navbar";
import "./PrecioPorZona.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxes } from "@fortawesome/free-solid-svg-icons";
import { getZoneWithProducts, Zone } from "../../servicios/zone";

const TablaPreciosPorZona: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [zones, setZones] = useState<Array<Zone>>([]);
  const navigate = useNavigate(); // Hook para navegación

  const handleToggleMenu = (isExpanded: boolean) => {
    setIsSlideMenuExpanded(isExpanded);
  };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zoneData = await getZoneWithProducts();
        setZones(zoneData);
      } catch (error) {
        console.error("Error al obtener las zonas: ", error);
      }
    };

    fetchZones();
  }, []);

  return (
    <div className="homepage-container">
      <NavbarComponent />
      <div className="d-flex">
        <SlideMenu onToggleMenu={handleToggleMenu} />
        <main
          className={`content-area ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <h1 className="text-center titulo-tabla">Zonas parametrizadas</h1>
          <div className="dashboard-cardsPrices" >
            {Array.isArray(zones) && zones.length > 0 ? (
              zones.map((zone) => (
                <div key={zone.id} className="card" onClick={() => navigate(`/tablaPrecios/${zone.id}`)}>
                  <FontAwesomeIcon icon={faBoxes} className="card-icon" />
                  <h3>{zone.name}</h3>
                </div>
              ))
            ) : (
              <p>No hay zonas disponibles.</p>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default TablaPreciosPorZona;
