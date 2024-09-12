import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFileAlt,
  faCalendarAlt,
  faUsers,
  faChevronDown,
  faChevronUp,
  faMinus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./SlideMenu.css";
import FormEquipoTrabajo from "../formEquipoTrabajo/equipoTrabajo";
import FormClientes from "../formClientes/formClientes";
import FormCiudades from "../formCiudades/formCiudades";
import FormInventario from "../formInventario/formInventario";

interface SlideMenuProps {
  onToggleMenu: (isExpanded: boolean) => void;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ onToggleMenu }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({
    formularios: false,
    agenda: false,
    usuarios: false,
  });

  const [showModalEquipo, setShowModalEquipo] = useState(false);
  const [showModalClientes, setShowModalClientes] = useState(false);
  const [showModalCiudades, setShowModalCiudades] = useState(false);
  const [showModalInventario, setShowModalInventario] = useState(false);

  const toggleMenu = () => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    onToggleMenu(newIsExpanded);
  };

  const handleMouseEnter = () => {
    if (!isExpanded) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isExpanded) {
      setIsHovered(false);
    }
  };

  const toggleSubMenu = (menu: keyof typeof isSubMenuOpen) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleOpenModalEquipo = () => setShowModalEquipo(true);
  const handleCloseModalEquipo = () => setShowModalEquipo(false);
  const handleOpenModalClientes = () => setShowModalClientes(true);
  const handleCloseModalClientes = () => setShowModalClientes(false);
  const handleOpenModalCiudades = () => setShowModalCiudades(true);
  const handleCloseModalCiudades = () => setShowModalCiudades(false);
  const handleOpenModalInventario = () => setShowModalInventario(true);
  const handleCloseModalInventario = () => setShowModalInventario(false);

  return (
    <>
      <div
        className={`slide-menu-container ${
          isExpanded ? "expanded" : "collapsed"
        }`}
        style={
          {
            "--slide-menu-width": isExpanded ? "250px" : "60px",
          } as React.CSSProperties
        }
      >
        <div className={`menu-header ${isExpanded ? "expanded" : "collapsed"}`}>
          <div className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isExpanded ? faBars : faTimes} />
          </div>
        </div>

        <div
          className={`slide-menu ${
            isExpanded || isHovered ? "expanded" : "collapsed"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ul className="menu-items">
            <li>
              <div
                onClick={() => toggleSubMenu("formularios")}
                className="menu-item"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                {(isExpanded || isHovered) && (
                  <>
                    <span> Formularios</span>
                    <FontAwesomeIcon
                      icon={
                        isSubMenuOpen.formularios ? faChevronUp : faChevronDown
                      }
                      className="chevron-icon"
                    />
                  </>
                )}
              </div>
              {isSubMenuOpen.formularios && (isExpanded || isHovered) && (
                <ul className="submenu">
                  <li onClick={handleOpenModalClientes}>
                    <FontAwesomeIcon icon={faMinus} /> Clientes
                  </li>
                  <li onClick={handleOpenModalEquipo}>
                    <FontAwesomeIcon icon={faMinus} /> Equipo de Trabajo
                  </li>
                  <li onClick={handleOpenModalCiudades}>
                    <FontAwesomeIcon icon={faMinus} /> Ciudades
                  </li>
                  <li onClick={handleOpenModalInventario}>
                    <FontAwesomeIcon icon={faMinus} /> Inventario
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div
                onClick={() => toggleSubMenu("agenda")}
                className="menu-item"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {(isExpanded || isHovered) && (
                  <>
                    <span>Agenda</span>
                    <FontAwesomeIcon
                      icon={isSubMenuOpen.agenda ? faChevronUp : faChevronDown}
                      className="chevron-icon"
                    />
                  </>
                )}
              </div>
              {isSubMenuOpen.agenda && (isExpanded || isHovered) && (
                <ul className="submenu">
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Ventas</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Eventos</span>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div
                onClick={() => toggleSubMenu("usuarios")}
                className="menu-item"
              >
                <FontAwesomeIcon icon={faUsers} />
                {(isExpanded || isHovered) && (
                  <>
                    <span>Tablas Maestras</span>
                    <FontAwesomeIcon
                      icon={
                        isSubMenuOpen.usuarios ? faChevronUp : faChevronDown
                      }
                      className="chevron-icon"
                    />
                  </>
                )}
              </div>
              {isSubMenuOpen.usuarios && (isExpanded || isHovered) && (
                <ul className="submenu">
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Equipo de Trabajo</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Clientes</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Precios con ciudades</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Inventario</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Productos adicionales</span>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      {showModalEquipo && (
        <FormEquipoTrabajo
          show={showModalEquipo}
          handleClose={handleCloseModalEquipo}
        />
      )}
      {showModalClientes && (
        <FormClientes
          show={showModalClientes}
          handleClose={handleCloseModalClientes}
        />
      )}
      {showModalCiudades && (
        <FormCiudades
          show={showModalCiudades}
          handleClose={handleCloseModalCiudades}
        />
      )}
      {showModalInventario && (
        <FormInventario
          show={showModalInventario}
          handleClose={handleCloseModalInventario}
        />
      )}
    </>
  );
};

export default SlideMenu;
