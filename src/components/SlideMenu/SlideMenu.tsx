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
import FormEquipo from "../formEquipoTrabajo/equipoTrabajo";
import FormClientes from "../formClientes/formClientes";
import FormCiudades from "../formCiudades/formCiudades";
import FormInventario from "../formInventario/formInventario";
import FormRoll from "../formRoll/formRoll";
import FormRed from "../formRedSocial/formRedSocial";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

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
  const navigate = useNavigate();

  const [showModalroll, setShowModalroll] = useState(false);
  const [showModalEquipo, setShowModalEquipo] = useState(false);
  const [showModalRed, setShowModalRed] = useState(false);
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

  // constane para navegar en las tablas y vistas al dar click en slide
  const handleNavigateToTablaRoll = () => {
    navigate("/roll"); // Redirige a la vista de Tabla Roll
  };

  const handleNavigateToTablaequipo = () => {
    navigate("/equipo"); // Redirige a la vista de Tabla Roll
  };

  const handleNavigateToTablaRed = () => {
    navigate("/red"); // Redirige a la vista de Tabla Roll
  };

  const handleNavigateToTablaclientes = () => {
    navigate("/clientes"); // Redirige a la vista de Tabla Roll
  };

  // logica para recibir datos al modal
  const [isEditingRoll, setIsEditingRoll] = useState(false);
  const [selectedRoll, setSelectedRoll] = useState<{
    nombreRoll: string;
  } | null>(null);

  const [isEditingequipo, setIsEditingequipo] = useState(false);
  const [selectedequipo, setSelectedequipo] = useState<{
    nombre: string;
  } | null>(null);

  const [isEditingRed, setIsEditingRed] = useState(false);
  const [selectedRed, setSelectedRed] = useState<{
    nombreRed: string;
  } | null>(null);

  // logica modal de formularios roll
  const handleOpenCreateRollModal = () => {
    setSelectedRoll(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingRoll(false); // No estamos editando
    setShowModalroll(true); // Abre el modal
  };

  const handleCloseModalroll = () => {
    setShowModalroll(false); // Cierra el modal
    setIsEditingRoll(false); // Resetea el modo edición
    setSelectedRoll(null); // Resetea el rol seleccionado
  };

  // modal equipo trabajo
  const handleOpenCreateequipoModal = () => {
    setSelectedequipo(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingequipo(false); // No estamos editando
    setShowModalEquipo(true); // Abre el modal
  };
  const handleCloseModalequipo = () => {
    setShowModalEquipo(false); // Cierra el modal
    setIsEditingequipo(false); // Resetea el modo edición
    setSelectedequipo(null); // Resetea el rol seleccionado
  };

  // modal Red Conexion
  const handleOpenCreateRedModal = () => {
    setSelectedRed(null); // No hay rol seleccionado, es un nuevo rol
    setIsEditingRed(false); // No estamos editando
    setShowModalRed(true); // Abre el modal
  };
  const handleCloseModalRed = () => {
    setShowModalRed(false); // Cierra el modal
    setIsEditingRed(false); // Resetea el modo edición
    setSelectedRed(null); // Resetea el rol seleccionado
  };

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
                  <li onClick={handleOpenCreateRollModal}>
                    <FontAwesomeIcon icon={faMinus} /> Crear Roll
                  </li>

                  <li onClick={handleOpenCreateequipoModal}>
                    <FontAwesomeIcon icon={faMinus} /> Equipo de Trabajo
                  </li>

                  <li onClick={handleOpenCreateRedModal}>
                    <FontAwesomeIcon icon={faMinus} /> Crear Red De Conexion
                  </li>

                  <li onClick={handleOpenModalClientes}>
                    <FontAwesomeIcon icon={faMinus} /> Clientes
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
                  <li onClick={handleNavigateToTablaRoll}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Tabla Roll</span>
                  </li>

                  <li onClick={handleNavigateToTablaequipo}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Equipo de Trabajo</span>
                  </li>

                  <li onClick={handleNavigateToTablaRed}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>Red De Conexion</span>
                  </li>
                  <li onClick={handleNavigateToTablaclientes}>
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

      {/* logica modales close */}
      {showModalroll && (
        <FormRoll
          show={showModalroll}
          handleClose={handleCloseModalroll}
          roll={selectedRoll} // Pasa el rol seleccionado o null
          isEditing={isEditingRoll} // Pasa si estamos editando o creando
        />
      )}

      {showModalEquipo && (
        <FormEquipo
          show={showModalEquipo}
          handleClose={handleCloseModalequipo}
          roll={selectedequipo} // Pasa el rol seleccionado o null
          isEditing={isEditingequipo} // Pasa si estamos editando o creando
        />
      )}

      {showModalRed && (
        <FormRed
          show={showModalRed}
          handleClose={handleCloseModalRed}
          roll={selectedRed} // Pasa el rol seleccionado o null
          isEditing={isEditingRed} // Pasa si estamos editando o creando
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
